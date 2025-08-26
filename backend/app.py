from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import joblib
import pandas as pd
import numpy as np
import os
import shap

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and threshold at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "hospital_readmission_model.pkl")
THRESHOLD_PATH = os.path.join(os.path.dirname(__file__), "models", "best_threshold.pkl")

model_data = joblib.load(MODEL_PATH)
model = model_data['model']
preprocessor = model_data['preprocessor']
training_columns = model_data['columns']
top_specialties = model_data['top_specialties']
threshold = joblib.load(THRESHOLD_PATH)

# Cache for SHAP explainer
_shap_explainer = None

class PatientData(BaseModel):
    model_config = {"extra": "allow"}  # Allow extra fields
    # Define some common fields as optional
    age: str = None
    medical_specialty: str = None
    n_outpatient: int = 0
    n_inpatient: int = 0
    n_emergency: int = 0
    n_procedures: int = 0
    n_lab_procedures: int = 0
    n_medications: int = 0
    time_in_hospital: int = 1
    diag_1: str = None
    diag_2: str = None
    diag_3: str = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(patient: PatientData):
    try:
        # Convert Pydantic model to dict, including extra fields
        patient_data = patient.model_dump()
        df_sample = pd.DataFrame([patient_data])
        # Ensure optional columns exist
        for opt_col, default_val in [('diag_1', None), ('diag_2', None), ('diag_3', None), ('age', None), ('medical_specialty', None)]:
            if opt_col not in df_sample.columns:
                df_sample[opt_col] = default_val
        # Defaults for missing
        defaults = {'n_outpatient':0,'n_inpatient':0,'n_emergency':0,'n_procedures':0,'n_lab_procedures':0,'n_medications':0,'time_in_hospital':1}
        for k,v in defaults.items():
            if k not in df_sample.columns: df_sample[k] = v
        # Feature engineering (same as training)
        df_sample['num_diagnoses'] = df_sample.filter(items=['diag_1','diag_2','diag_3']).count(axis=1)
        df_sample['total_med_procedures'] = df_sample['n_lab_procedures'] + df_sample['n_procedures']
        df_sample['med_to_stay_ratio'] = (df_sample['n_medications'] / df_sample['time_in_hospital']).replace([np.inf,-np.inf],0).fillna(0)
        df_sample['had_procedures'] = (df_sample['n_procedures']>0).astype(int)
        df_sample['procedures_per_day'] = (df_sample['n_procedures']/(df_sample['time_in_hospital']+1)).replace([np.inf,-np.inf],0).fillna(0)
        df_sample['procedures_vs_medications'] = (df_sample['n_procedures']/(df_sample['n_medications']+1)).replace([np.inf,-np.inf],0).fillna(0)
        df_sample['procedures_interaction'] = df_sample['n_procedures']*df_sample['time_in_hospital']
        def simplify_age_group(age_range):
            if pd.isna(age_range): return 'Other'
            if age_range in ['[0-10)','[10-20)','[20-30)','[30-40)','[40-50)']: return 'Young'
            elif age_range in ['[50-60)','[60-70)','[70-80)']: return 'Middle-aged'
            else: return 'Senior'
        df_sample['age_group_simplified'] = df_sample['age'].apply(simplify_age_group)
        def simplify_diag(diag):
            if pd.isna(diag): return 'Other'
            diag = str(diag).lower()
            if 'diabetes' in diag: return 'Diabetes'
            if 'circulatory' in diag: return 'Circulatory'
            if 'respiratory' in diag: return 'Respiratory'
            if 'digestive' in diag: return 'Digestive'
            if 'injury' in diag: return 'Injury'
            if 'musculoskeletal' in diag: return 'Musculoskeletal'
            return 'Other'
        for c in ['diag_1','diag_2','diag_3']:
            if c not in df_sample.columns:
                df_sample[c] = None
            df_sample[c] = df_sample[c].apply(simplify_diag)
        # Binary indicators and interactions
        diag_groups = ['Respiratory','Circulatory','Diabetes','Digestive','Other','Injury','Musculoskeletal','Missing']
        for dg in diag_groups:
            df_sample[f'has_{dg.lower()}_diag'] = ((df_sample['diag_1']==dg) | (df_sample['diag_2']==dg) | (df_sample['diag_3']==dg)).astype(int)
            df_sample[f'{dg.lower()}_procedures_interaction'] = df_sample[f'has_{dg.lower()}_diag']*df_sample['n_procedures']
        # Severity
        diag_severity = {'Respiratory':7,'Circulatory':6,'Diabetes':5,'Digestive':4,'Other':3,'Injury':2,'Musculoskeletal':1,'Missing':0}
        for c in ['diag_1','diag_2','diag_3']:
            df_sample[f'{c}_severity'] = df_sample[c].map(diag_severity)
        df_sample['max_diag_severity'] = df_sample[[f'{c}_severity' for c in ['diag_1','diag_2','diag_3']]].max(axis=1)
        df_sample['total_diag_severity'] = df_sample[[f'{c}_severity' for c in ['diag_1','diag_2','diag_3']]].sum(axis=1)
        # Specialty
        df_sample['medical_specialty'] = df_sample['medical_specialty'].apply(lambda x: x if x in top_specialties else 'Other')
        # Align columns
        for col in training_columns:
            if col not in df_sample.columns:
                df_sample[col] = 0
        df_sample = df_sample[training_columns]
        X_input = preprocessor.transform(df_sample)
        y_prob = model.predict_proba(X_input)[:,1]
        return {'predicted_class': int(y_prob[0]>=threshold), 'readmission_probability': float(y_prob[0])}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/explain")
def explain(patient: PatientData):
    try:
        global _shap_explainer

        # Convert input to DataFrame and replicate the exact feature engineering
        patient_data = patient.model_dump()
        df_sample = pd.DataFrame([patient_data])

        # Ensure optional columns exist
        for opt_col, default_val in [('diag_1', None), ('diag_2', None), ('diag_3', None), ('age', None), ('medical_specialty', None)]:
            if opt_col not in df_sample.columns:
                df_sample[opt_col] = default_val

        defaults = {'n_outpatient':0,'n_inpatient':0,'n_emergency':0,'n_procedures':0,'n_lab_procedures':0,'n_medications':0,'time_in_hospital':1}
        for k,v in defaults.items():
            if k not in df_sample.columns: df_sample[k] = v

        df_sample['num_diagnoses'] = df_sample.filter(items=['diag_1','diag_2','diag_3']).count(axis=1)
        df_sample['total_med_procedures'] = df_sample['n_lab_procedures'] + df_sample['n_procedures']
        df_sample['med_to_stay_ratio'] = (df_sample['n_medications'] / df_sample['time_in_hospital']).replace([np.inf,-np.inf],0).fillna(0)
        df_sample['had_procedures'] = (df_sample['n_procedures']>0).astype(int)
        df_sample['procedures_per_day'] = (df_sample['n_procedures']/(df_sample['time_in_hospital']+1)).replace([np.inf,-np.inf],0).fillna(0)
        df_sample['procedures_vs_medications'] = (df_sample['n_procedures']/(df_sample['n_medications']+1)).replace([np.inf,-np.inf],0).fillna(0)
        df_sample['procedures_interaction'] = df_sample['n_procedures']*df_sample['time_in_hospital']

        def simplify_age_group(age_range):
            if pd.isna(age_range): return 'Other'
            if age_range in ['[0-10)','[10-20)','[20-30)','[30-40)','[40-50)']: return 'Young'
            elif age_range in ['[50-60)','[60-70)','[70-80)']: return 'Middle-aged'
            else: return 'Senior'
        df_sample['age_group_simplified'] = df_sample['age'].apply(simplify_age_group)

        def simplify_diag(diag):
            if pd.isna(diag): return 'Other'
            diag = str(diag).lower()
            if 'diabetes' in diag: return 'Diabetes'
            if 'circulatory' in diag: return 'Circulatory'
            if 'respiratory' in diag: return 'Respiratory'
            if 'digestive' in diag: return 'Digestive'
            if 'injury' in diag: return 'Injury'
            if 'musculoskeletal' in diag: return 'Musculoskeletal'
            return 'Other'
        for c in ['diag_1','diag_2','diag_3']:
            if c not in df_sample.columns:
                df_sample[c] = None
            df_sample[c] = df_sample[c].apply(simplify_diag)

        diag_groups = ['Respiratory','Circulatory','Diabetes','Digestive','Other','Injury','Musculoskeletal','Missing']
        for dg in diag_groups:
            df_sample[f'has_{dg.lower()}_diag'] = ((df_sample['diag_1']==dg) | (df_sample['diag_2']==dg) | (df_sample['diag_3']==dg)).astype(int)
            df_sample[f'{dg.lower()}_procedures_interaction'] = df_sample[f'has_{dg.lower()}_diag']*df_sample['n_procedures']

        diag_severity = {'Respiratory':7,'Circulatory':6,'Diabetes':5,'Digestive':4,'Other':3,'Injury':2,'Musculoskeletal':1,'Missing':0}
        for c in ['diag_1','diag_2','diag_3']:
            df_sample[f'{c}_severity'] = df_sample[c].map(diag_severity)
        df_sample['max_diag_severity'] = df_sample[[f'{c}_severity' for c in ['diag_1','diag_2','diag_3']]].max(axis=1)
        df_sample['total_diag_severity'] = df_sample[[f'{c}_severity' for c in ['diag_1','diag_2','diag_3']]].sum(axis=1)

        df_sample['medical_specialty'] = df_sample['medical_specialty'].apply(lambda x: x if x in top_specialties else 'Other')

        # Keep a copy before aligning to model columns for SHAP background
        df_engineered = df_sample.copy()

        # Align columns for model input
        for col in training_columns:
            if col not in df_engineered.columns:
                df_engineered[col] = 0
        df_model = df_engineered[training_columns]

        # Transform through the training preprocessor to match model input
        X_input = preprocessor.transform(df_model)
        if hasattr(X_input, 'toarray'):
            X_input = X_input.toarray()

        # Build a richer background by perturbing numeric inputs and re-transforming
        numeric_input_fields = ['n_outpatient','n_inpatient','n_emergency','n_procedures','n_lab_procedures','n_medications','time_in_hospital']
        bg_rows = []
        for scale in [0.8, 0.9, 1.0, 1.1, 1.2]:
            noisy = df_engineered.copy()
            for f in numeric_input_fields:
                if f in noisy.columns:
                    val = pd.to_numeric(noisy.loc[0, f], errors='coerce')
                    if pd.isna(val):
                        continue
                    new_val = max(0, val * scale)
                    noisy.loc[0, f] = int(round(new_val))
            # recompute engineered features after noise
            noisy['num_diagnoses'] = noisy.filter(items=['diag_1','diag_2','diag_3']).count(axis=1)
            noisy['total_med_procedures'] = noisy['n_lab_procedures'] + noisy['n_procedures']
            noisy['med_to_stay_ratio'] = (noisy['n_medications'] / noisy['time_in_hospital']).replace([np.inf,-np.inf],0).fillna(0)
            noisy['had_procedures'] = (noisy['n_procedures']>0).astype(int)
            noisy['procedures_per_day'] = (noisy['n_procedures']/(noisy['time_in_hospital']+1)).replace([np.inf,-np.inf],0).fillna(0)
            noisy['procedures_vs_medications'] = (noisy['n_procedures']/(noisy['n_medications']+1)).replace([np.inf,-np.inf],0).fillna(0)
            noisy['procedures_interaction'] = noisy['n_procedures']*noisy['time_in_hospital']
            for c in ['diag_1','diag_2','diag_3']:
                noisy[f'{c}_severity'] = noisy[c].map({'Respiratory':7,'Circulatory':6,'Diabetes':5,'Digestive':4,'Other':3,'Injury':2,'Musculoskeletal':1,'Missing':0})
            noisy['max_diag_severity'] = noisy[[f'{c}_severity' for c in ['diag_1','diag_2','diag_3']]].max(axis=1)
            noisy['total_diag_severity'] = noisy[[f'{c}_severity' for c in ['diag_1','diag_2','diag_3']]].sum(axis=1)
            noisy['medical_specialty'] = noisy['medical_specialty'].apply(lambda x: x if x in top_specialties else 'Other')
            # align and select model columns
            for col in training_columns:
                if col not in noisy.columns:
                    noisy[col] = 0
            noisy = noisy[training_columns]
            bg_rows.append(noisy)
        df_bg = pd.concat(bg_rows, ignore_index=True)
        X_background = preprocessor.transform(df_bg)
        if hasattr(X_background, 'toarray'):
            X_background = X_background.toarray()

        # Create a per-request KernelExplainer on background
        explainer = shap.KernelExplainer(lambda X: model.predict_proba(X)[:, 1], X_background)

        shap_values = explainer.shap_values(X_input, nsamples='auto')

        # Extract feature names from preprocessor output if available
        try:
            if hasattr(preprocessor, 'get_feature_names_out'):
                feature_names = list(preprocessor.get_feature_names_out(training_columns))
            else:
                feature_names = [f'f_{i}' for i in range(X_input.shape[1])]
        except Exception:
            feature_names = [f'f_{i}' for i in range(X_input.shape[1])]

        # Handle different shap outputs (tree vs kernel), now single-output
        values = np.array(shap_values)
        if values.ndim == 2:
            values = values[0, :]

        # Base value and predicted probability
        y_prob = float(model.predict_proba(X_input)[:,1][0])
        base_value = 0.0
        try:
            base_vals = np.array(shap_values.base_values)
            base_value = float(base_vals[0]) if base_vals.ndim > 0 else float(base_vals)
        except Exception:
            pass

        # Map contributions to names
        contributions = [
            {
                'feature': feature_names[i] if i < len(feature_names) else f'f_{i}',
                'shap_value': float(values[i])
            }
            for i in range(len(values))
        ]
        # Sort by absolute impact
        contributions_sorted = sorted(contributions, key=lambda x: abs(x['shap_value']), reverse=True)

        # Derive human-friendly risk label and reasons
        predicted_class = int(y_prob>=threshold)
        risk_label = 'High risk' if predicted_class == 1 else 'Low risk'

        top_positive = [c for c in contributions_sorted if c['shap_value'] > 0][:5]
        top_negative = [c for c in contributions_sorted if c['shap_value'] < 0][:5]

        def pretty_name(raw: str) -> str:
            name = raw.split('__')[-1]
            name = name.replace('=', ' = ').replace('_', ' ')
            return name.strip()

        reasons = []
        for c in top_positive:
            reasons.append(f"{pretty_name(c['feature'])} increased risk by +{abs(c['shap_value']):.3f}")
        for c in top_negative:
            reasons.append(f"{pretty_name(c['feature'])} reduced risk by -{abs(c['shap_value']):.3f}")

        explanation_summary = (
            'These features increased risk the most' if predicted_class == 1 else 'These features decreased risk the most'
        )

        return {
            'predicted_class': predicted_class,
            'risk_label': risk_label,
            'readmission_probability': y_prob,
            'threshold': float(threshold),
            'base_value': base_value,
            'top_contributions': contributions_sorted[:20],
            'top_positive_contributions': top_positive,
            'top_negative_contributions': top_negative,
            'reasons': reasons,
            'explanation_summary': explanation_summary,
            'all_contributions_count': len(contributions_sorted)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
