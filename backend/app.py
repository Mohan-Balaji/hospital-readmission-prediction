from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import joblib
import pandas as pd
import numpy as np
import os

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
        # Defaults for missing
        defaults = {'n_outpatient':0,'n_inpatient':0,'n_emergency':0,'n_procedures':0,'n_lab_procedures':0,'n_medications':0,'time_in_hospital':1}
        for k,v in defaults.items():
            if k not in df_sample.columns: df_sample[k] = v
        # Feature engineering (same as training)
        df_sample['num_diagnoses'] = df_sample[['diag_1','diag_2','diag_3']].count(axis=1)
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
