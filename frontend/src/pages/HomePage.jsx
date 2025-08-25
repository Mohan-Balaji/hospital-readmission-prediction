import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import flowDiagram from '../assets/flow_diagram.jpg';
import heroImage from '../assets/hero_image.jpg';

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking...');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/health`).then(r => r.json()).then(d => setStatus(d.status || 'ok')).catch(() => setStatus('down'));
  }, [API_URL]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  // Only show landing page for non-authenticated users
  if (!user) {
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
                    onClick={() => navigate('/sign-up')}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Dashboard
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
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Solution</h3>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  We've developed an AI-powered system that addresses the limitations of conventional 
                  models by using advanced machine learning techniques and real-time data processing.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Advanced ML Models */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Advanced ML Models</h4>
                    <p className="text-gray-700 leading-relaxed">
                      State-of-the-art algorithms for accurate predictions with high precision and recall rates.
                    </p>
                    <div className="mt-6 flex items-center text-blue-600 font-medium">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Real-time Processing */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Real-time Processing</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Instant risk assessment and alerts with sub-second response times for critical decisions.
                    </p>
                    <div className="mt-6 flex items-center text-green-600 font-medium">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Secure & Compliant */}
                <div className="group relative">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Secure & Compliant</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Healthcare-grade security and privacy with HIPAA compliance and enterprise encryption.
                    </p>
                    <div className="mt-6 flex items-center text-purple-600 font-medium">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how our AI-powered platform can revolutionize your healthcare practice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Predictive Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced machine learning models predict patient readmission risks with high accuracy, 
                  helping you intervene early and improve outcomes.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Compliant</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built with healthcare security standards in mind. Your patient data is protected with 
                  enterprise-grade encryption and compliance.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant notifications and actionable insights. Monitor patient progress and 
                  make informed decisions in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hospital Readmission Process Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI system analyzes patient data to predict readmission risks and provide actionable insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Collection</h3>
                <p className="text-gray-600">Patient demographics, medical history, and treatment data are securely collected and processed.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
                <p className="text-gray-600">Advanced machine learning algorithms analyze patterns and identify risk factors for readmission.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                <p className="text-gray-600">Patients are categorized into low, medium, and high-risk groups based on AI predictions.</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Intervention</h3>
                <p className="text-gray-600">Healthcare providers receive alerts and recommendations for preventive care strategies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}

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

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
