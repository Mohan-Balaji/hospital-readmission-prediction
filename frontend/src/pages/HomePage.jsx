import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { toast } from 'sonner';
import flowDiagram from '../assets/flow_diagram.jpg';
import heroImage from '../assets/hero_image.jpg';
import tailwindLogo from '../assets/tailwind-logo.png';
import scikitLogo from '../assets/Scikit-learn-Logo.jpg';
import shapLogo from '../assets/shap_logo.jpg';
import appServicesLogo from '../assets/AppServices.png';
import swaLogo from '../assets/SWA.jpg';
import AzureLogo from '../assets/AzureLogo.png';
import backend_icon from '../assets/backend_icon.jpg'
import frontend_icon from '../assets/frontend_icon.jpg'

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking...');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/health`).then(r => r.json()).then(d => setStatus(d.status || 'ok')).catch(() => setStatus('down'));
  }, [API_URL]);

  // Show toast notification for authenticated users
  useEffect(() => {
    if (!loading && user) {
      toast.success('Welcome back! Click "Go to Dashboard" to start making predictions.', {
        duration: 5000,
        action: {
          label: 'Go to Dashboard',
          onClick: () => navigate('/dashboard')
        }
      });
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Section */}

        {/* Hero Section */}
        <section className="relative py-20 px-5 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Hospital Readmission
                    <span className="block text-blue-600">Prediction System</span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Our AI-powered platform helps healthcare providers predict patient readmissions, 
                    improve outcomes, and deliver better care through data-driven decisions.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => user ? navigate('/dashboard') : navigate('/sign-up')}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {user ? 'Go to Dashboard' : 'Dashboard'}
                  </button>
                  <button
                    onClick={() => navigate('/about')}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                  >
                    Learn More
                  </button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Hospital Readmission Visualization */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Readmission Risk Analysis</h3>
                    <p className="text-sm text-gray-600">AI-powered prediction model</p>
                  </div>
                  
                  {/* Chart Visualization */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Low Risk</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-green-200 rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full" style={{width: '25%'}}></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">25%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-yellow-200 rounded-full h-3">
                          <div className="bg-yellow-500 h-3 rounded-full" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">45%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">High Risk</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-red-200 rounded-full h-3">
                          <div className="bg-red-500 h-3 rounded-full" style={{width: '30%'}}></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">30%</span>
                    </div>
                  </div>
                  
                  {/* Patient Icons */}
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement & Dataset Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Project Overview
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the challenge and our approach to solving hospital readmission prediction
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Problem Statement */}
                             <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                 <div className="flex items-center mb-6">
                   <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 relative">
                     {/* Lightbulb with exclamation mark */}
                     <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zM12 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                       <path d="M12 6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1z"/>
                       <circle cx="12" cy="12" r="1"/>
                     </svg>
                     {/* Checkmark circle overlapping top-right */}
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                       <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                       </svg>
                     </div>
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900">Problem Statement</h3>
                 </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Hospital readmissions are one of the costliest challenges facing healthcare systems, 
                  but conventional models fail to predict readmissions well. Many existing models use 
                  exclusively manually-engineered features, which are dataset-specific and lack the 
                  flexibility to adapt to different healthcare environments.
                </p>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Key Challenges:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• High costs associated with preventable readmissions</li>
                    <li>• Poor prediction accuracy of existing models</li>
                    <li>• Dataset-specific feature engineering limitations</li>
                    <li>• Lack of real-time risk assessment capabilities</li>
                  </ul>
                </div>
              </div>

              {/* Dataset Information */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Dataset & Training</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dataset Source</h4>
                    <a 
                      href="https://www.kaggle.com/datasets/dubradave/hospital-readmissions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      https://www.kaggle.com/datasets/dubradave/hospital-readmissions
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Machine Learning Task</h4>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Classification
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Objective</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Build a predictive model that can accurately classify patients as readmitted or not, 
                      based on the provided features. This model helps healthcare providers identify 
                      high-risk patients and take proactive measures to prevent readmissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution Overview */}
           
                
          </div>
          
        </section>
        

        {/* System Architecture Flow Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                System Architecture
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                End-to-end machine learning pipeline from data processing to prediction deployment
              </p>
            </div>

            {/* Flow Diagram Image */}
            <div className="flex justify-center">
              <div className="max-w-6xl w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                  <img 
                    src={flowDiagram} 
                    alt="Hospital Readmission Prediction System Architecture Flow" 
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '600px' }}
                  />
                </div>
              </div>
            </div>

            {/* Description below the image */}
            <div className="mt-12 text-center">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Complete ML Pipeline Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Data Pipeline</h4>
                    <p className="text-gray-700 text-sm">
                      Hospital data collection, ingestion, cleaning, and transformation processes 
                      to prepare data for machine learning models.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h4 className="font-semibold text-orange-800 mb-3">ML Model Training</h4>
                    <p className="text-gray-700 text-sm">
                      Feature engineering, model selection, training, and evaluation to create 
                      accurate prediction models.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="font-semibold text-green-800 mb-3">Deployment</h4>
                    <p className="text-gray-700 text-sm">
                      Model registry, Flask API, React frontend, and real-time prediction 
                      delivery to healthcare providers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Problem Statement Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Learning Problem Statement
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the machine learning challenge and our approach to solving hospital readmission prediction
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Machine Learning Task</h3>
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Problem Type</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span><strong>Task:</strong> Classification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span><strong>Target:</strong> 30-day hospital readmission (Yes/No)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span><strong>Evaluation:</strong> Accuracy, ROC-AUC, F1-Score</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                      <span><strong>Domain:</strong> Healthcare And Life Science</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Input Features</h4>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"age"</strong> - age bracket of the patient</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"time_in_hospital"</strong> - days (from 1 to 14)</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"n_procedures"</strong> - number of procedures performed during the hospital stay</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"n_lab_procedures"</strong> - number of laboratory procedures performed during the hospital stay</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"n_medications"</strong> - number of medications administered during the hospital stay</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"n_outpatient"</strong> - number of outpatient visits in the year before a hospital stay</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"n_inpatient"</strong> - number of inpatient visits in the year before the hospital stay</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"n_emergency"</strong> - number of visits to the emergency room in the year before the hospital stay</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"medical_specialty"</strong> - the specialty of the admitting physician</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"diag_1"</strong> - primary diagnosis (Circulatory, Respiratory, Digestive, etc.)</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-lime-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"diag_2"</strong> - secondary diagnosis</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"diag_3"</strong> - additional secondary diagnosis</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"glucose_test"</strong> - whether the glucose serum came out as high (&gt; 200), normal, or not performed</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-fuchsia-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"A1Ctest"</strong> - whether the A1C level of the patient came out as high (&gt; 7%), normal, or not performed</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"change"</strong> - whether there was a change in the diabetes medication ('yes' or 'no')</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                      <span><strong>"diabetes_med"</strong> - whether a diabetes medication was prescribed ('yes' or 'no')</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Challenges</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Class Imbalance</h4>
                    <p className="text-gray-600 text-sm">Target class is imbalanced where one class (non-readmission) has significantly more samples than the other (readmission cases), creating imbalanced classes that require special handling techniques like SMOTE, class weighting, or threshold optimization.</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Feature Engineering</h4>
                    <p className="text-gray-600 text-sm">Complex medical data requires sophisticated feature engineering to extract meaningful patterns and relationships.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Interpretability</h4>
                    <p className="text-gray-600 text-sm">Healthcare decisions require explainable AI models to understand prediction factors and build trust.</p>
                  </div>
                </div>        
                <div className="mt-6 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                     <div className="flex items-center">
                       <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span>Accuracy &gt; 78%</span>
                     </div>
                     
                     <div className="flex items-center">
                       <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>ROC-AUC &gt; 86%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>F1-Score &gt; 81%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dataset & Methodology Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Dataset & Methodology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding our data sources and the methodology behind our machine learning approach
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kaggle Dataset</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Hospital Readmission Prediction Dataset</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="font-medium">Kaggle</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Records:</span>
                      <span className="font-medium">~25,000 patient records</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Features:</span>
                      <span className="font-medium">17 clinical variables</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Period:</span>
                      <span className="font-medium">10 Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="font-medium">30-day readmission</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Key Features Included:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>age</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>time_in_hospital</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>n_procedures</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>n_lab_procedures</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span>n_medications</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>n_outpatient</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>n_inpatient</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>n_emergency</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>medical_specialty</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>diag_1</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>diag_2</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>diag_3</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>glucose_test</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>A1Ctest</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>change</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>diabetes_med</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span>readmitted</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Approach</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">1. Data Preprocessing</h4>
                    <p className="text-gray-600 text-sm">Comprehensive data cleaning, feature engineering, and handling of missing values to prepare the dataset for machine learning.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">2. Model Development</h4>
                    <p className="text-gray-600 text-sm">Development of ensemble models using Random Forest, XGBoost, and other advanced algorithms for optimal prediction accuracy.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">3. Explainable AI</h4>
                    <p className="text-gray-600 text-sm">Implementation of SHAP (SHapley Additive exPlanations) for model interpretability and feature importance analysis.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">4. Web Application</h4>
                    <p className="text-gray-600 text-sm">Development of a user-friendly web interface for healthcare providers to input patient data and receive predictions.</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">5. Cloud Deployment</h4>
                    <p className="text-gray-600 text-sm">Deployment on Microsoft Azure with CI/CD pipeline for scalable, secure, and reliable healthcare applications.</p>
                  </div>
                </div>
              </div>
              
            </div>
              
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 py-40">
          <h2 className="text-4xl  font-bold text-gray-900 mb-8 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10">
            {/* Frontend Technologies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <img src={backend_icon} alt="SHAP" className="w-8 h-8"/>
                
                </div>
                Frontend Technologies
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">React.js</h4>
                      <p className="text-sm text-gray-600">Modern UI framework</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">v18+</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src={tailwindLogo} alt="Tailwind CSS" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Tailwind CSS</h4>
                      <p className="text-sm text-gray-600">Utility-first CSS framework</p>
                    </div>
                  </div>
                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">v3+</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Firebase</h4>
                      <p className="text-sm text-gray-600">Authentication & hosting</p>
                    </div>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">v9+</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Vite</h4>
                      <p className="text-sm text-gray-600">Build tool & dev server</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">v4+</span>
                </div>
              </div>
            </div>

            {/* Backend Technologies */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                <img src={frontend_icon} alt="SHAP" className="w-8 h-8"/>
                </div>
                Backend Technologies
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Python</h4>
                      <p className="text-sm text-gray-600">Programming language</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">v3.12</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" alt="FastAPI" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">FastAPI</h4>
                      <p className="text-sm text-gray-600">Modern web framework</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">v0.100+</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src={scikitLogo} alt="Scikit-learn" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Scikit-learn</h4>
                      <p className="text-sm text-gray-600">Machine learning library</p>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">v1.3+</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                      <img src={shapLogo} alt="SHAP" className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">SHAP</h4>
                      <p className="text-sm text-gray-600">Model explainability</p>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">v0.42+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cloud & DevOps */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
               <img src={AzureLogo} alt="Azure Static Apps" className="w-8 h-8" />
              </div>
              Cloud Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                    <img src={swaLogo} alt="Azure Static Apps" className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Azure Static Apps</h4>
                    <p className="text-sm text-gray-600">Frontend hosting</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                    <img src={appServicesLogo} alt="Azure App Services" className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Azure App Services</h4>
                    <p className="text-sm text-gray-600">Backend hosting</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">GitHub</h4>
                    <p className="text-sm text-gray-600">Version control & CI/CD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      

          </div>
          
        </section>

      

        {/* Technology Stack Section */}
      


        {/* Status Indicator */}
        <div className="fixed bottom-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            API: {status}
          </div>
        </div>
      </div>
    );
  }
