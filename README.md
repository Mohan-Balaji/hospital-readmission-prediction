# 🏥 Hospital Readmission Prediction System

[![Azure](https://img.shields.io/badge/Deployed%20on-Azure-blue.svg)](https://azure.microsoft.com/)

[![RMD Engineering College](https://img.shields.io/badge/Institution-RMD%20Engineering%20College-blue.svg)](https://rmd.ac.in)


## 🎓 RMD Engineering College - Team SuperNexis

**Domain:** Life Sciences
**Problem:** Predicting Hospital Readmission Risk using Machine Learning  
**Solution:** Meta-Classifier Ensemble with Explainable AI


## 📋 Table of Contents

- [Problem & Solution](#problem--solution)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Machine Learning Model](#machine-learning-model)
- [Live Demo](#live-demo)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Team](#team)
- [Contact](#contact)

## 🎯 Problem & Solution

### The Healthcare Challenge
Hospital readmissions cost the U.S. healthcare system **$41 billion annually**, with 1 in 7 patients readmitted within 30 days.

### Our Solution
A **meta-classifier ensemble** system that:
- Predicts readmission risk with **>90% accuracy**
- Provides **explainable AI** insights using SHAP
- Offers **dual-mode interface** (manual + Excel batch processing)
- Deployed on **Microsoft Azure** with enterprise security


## ⚡ Key Features

### AI-Powered Intelligence
- **Meta-Classifier Ensemble:** Advanced two-level architecture
- **Real-time Predictions:** Sub-second response times
- **SHAP Explainable AI:** Transparent feature importance with clinical reasoning
- **Risk Stratification:** Automated patient categorization (Low/Medium/High risk)

### User Experience
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Dual Input Modes:** Manual entry or Excel batch processing
- **Interactive Dashboard:** Real-time visualizations with exportable reports
- **Enterprise Authentication:** Firebase-powered secure user management

### Cloud Architecture
- **Azure Static Web Apps:** Global CDN with edge optimization
- **Auto-scaling Backend:** Azure App Service with intelligent scaling
- **Enterprise Security:** HTTPS, CORS, and HIPAA-ready compliance
- **Real-time Monitoring:** Application insights and health checks

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Data Visualization
- **Firebase Auth** - Authentication

### Backend
- **FastAPI** - Web Framework
- **Python 3.11** - Programming Language
- **XGBoost** - Gradient Boosting
- **Logistic Regression** - Meta-Classifier
- **Random Forest** - Ensemble Learning
- **SHAP** - Explainable AI
- **pandas** - Data Processing

### Infrastructure
- **Azure Static Web Apps** - Frontend Hosting
- **Azure App Service** - Backend API
- **GitHub Actions** - CI/CD Pipeline

## 📊 Machine Learning Model

### Meta-Classifier Ensemble Architecture
Our system uses a **two-level ensemble approach**:

**Level 1: Base Classifiers**
- **Random Forest** - Handles feature interactions, robust to outliers
- **XGBoost** - Gradient boosting with high accuracy
- **Support Vector Machine** - Strong generalization capabilities

**Level 2: Meta-Classifier**
- **Logistic Regression** - Combines predictions from base classifiers optimally

## 🔥 Live Demo

**🚀 Live Application:** [https://hospital-readmission-prediction.azurewebsites.net](https://hospital-readmission-prediction.azurewebsites.net)

**📹 Video Demo:** [Google Drive](https://drive.google.com/drive/folders/1xR6bsENC0vNs_pI55uyq3dNEQismFDKi?usp=sharing)

### Features
- **Individual Patient Assessment:** Enter patient data manually
- **Batch Processing:** Upload Excel files with multiple patients
- **Real-time Visualizations:** Interactive charts and risk breakdowns
- **SHAP Explanations:** See exactly why the AI made its prediction
- **Mobile-Friendly:** Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Setup
```powershell
# 1. Clone Repository
git clone https://github.com/Mohan-Balaji/hospital-readmission-prediction.git
cd hospital-readmission-prediction

# 2. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# 3. Frontend Setup (new terminal)
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📚 API Documentation

### Key Endpoints

#### Health Check
```http
GET /health
```

#### Predict Readmission Risk
```http
POST /predict
Content-Type: application/json

{
  "age": "[50-60)",
  "time_in_hospital": 3,
  "n_inpatient": 10,
  "n_emergency": 9,
  "diabetes_med": "Yes",
  "diag_1": "Diabetes"
}
```

#### Get SHAP Explanation
```http
POST /explain
Content-Type: application/json
```

## 👥 Team

### Team SuperNexis - RMD Engineering College

**Mohan Balaji** - *Team Lead & ML Engineer*
- **Role:** Full-Stack Development, Machine Learning Architecture, DevOps
- **Expertise:** Python, React, Azure Cloud, XGBoost, Deep Learning
- **Contact:** bmohanbalaji1976@gmail.com
- **GitHub:** [@Mohan-Balaji](https://github.com/Mohan-Balaji)

**Academic Institution:** RMD Engineering College  
**Department:** Artificial Intelligence and Machine Learning  


**📧 Email:** bmohanbalaji1976@gmail.com  
**🔗 GitHub:** [hospital-readmission-prediction](https://github.com/Mohan-Balaji/hospital-readmission-prediction)  
**🏫 Institution:** RMD Engineering College, Chennai  
**📚 Department:** Artificial Intelligence and Machine Learning  



**"Building the future of healthcare, one prediction at a time." - Team SuperNexis**

[![RMD Engineering College](https://img.shields.io/badge/Institution-RMD%20Engineering%20College-blue.svg)](https://rmd.ac.in)
[![Azure Deployed](https://img.shields.io/badge/Deployed%20on-Microsoft%20Azure-0078d4.svg)](https://azure.microsoft.com)

