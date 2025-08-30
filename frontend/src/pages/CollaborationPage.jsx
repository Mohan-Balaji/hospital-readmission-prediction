import React from 'react';
import { useNavigate } from 'react-router-dom';
import workDoneImage from '../assets/workdone.png';
import jiraTimelineImage from '../assets/jira-timeline-white.png';
import workProgressImage from '../assets/workprogress.png';
import jiraLogo from '../assets/jira_logo.png';
import githubLogo from '../assets/githublogo.png';
import Google_Meet_Symbol from '../assets/Google_Meet_Symbol.png';
import GoogleDoc from '../assets/GoogleDoc.png';

const CollaborationPage = () => { 
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Simple Modern Team Chart */}
      
            
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Team Contributors
            </h2>
            <p className="text-gray-600 text-lg">Hospital Readmission Prediction System Team</p>
          </div>
          
          {/* Simple Team Chart Layout */}
          <div className="space-y-6">
            
            {/* All Team Members Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Mohan Balaji */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-white font-bold text-lg">MB</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">MOHAN BALAJI B</h4>
                <p className="text-sm text-gray-600 mb-3">Team Leader</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• Azure Cloud Deployment</div>
                  <div>• Full-Stack Integration</div>
                  <div>• CI/CD Pipeline Management</div>
                </div>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/mohanbalaji2004/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>
              
              {/* Tarun */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">TARUN RAJ D</h4>
                <p className="text-sm text-gray-600 mb-3">ML Specialist</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• Scikit-learn Models</div>
                  <div>• Data Preprocessing</div>
                  <div>• Feature Engineering</div>
                </div>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/tarun-raj-d-578351296/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Monish */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">MONISH G H</h4>
                <p className="text-sm text-gray-600 mb-3">ML Engineer</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• Advanced Algorithms</div>
                  <div>• Data Pipelines</div>
                  <div>• Performance Tuning</div>
                </div>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/monish-gh/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Vishal */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">VISHAL S</h4>
                <p className="text-sm text-gray-600 mb-3">ML Evaluator</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• Model Validation</div>
                  <div>• Performance Metrics</div>
                  <div>• Visualization</div>
                </div>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/vishal-s-aa9baa268/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Faizur */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">FAIZUR RAHMAN H</h4>
                <p className="text-sm text-gray-600 mb-3">Data Analyst</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>• EDA & Insights</div>
                  <div>• ML & Data Visualization</div>
                  <div>• Complexity Analysis</div>
                </div>
                <div className="mt-3">
                  <a href="https://www.linkedin.com/in/faizrahman59/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Simple Jira Explanation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-base leading-relaxed max-w-4xl mx-auto">
                Throughout our development process, we used <strong>Jira</strong> to track our work progress systematically. 
                Our 5-member team managed <strong>38 work items</strong> over <strong>8 days</strong>, organizing everything into 
                focused sprints with daily standups, velocity tracking, and visual dashboards. This agile approach ensured 
                transparency, accountability, and efficient delivery of our Hospital Readmission Prediction System.
              </p>
            </div>
          </div>
        </div>


        {/* Work Progress Image Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Jira Work Progress Overview</h2>
          <div className="text-center">
            <img 
              src={workProgressImage} 
              alt="Jira Work Progress - All Work Items" 
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              style={{ maxHeight: '700px' }}
            />
            <p className="text-gray-600 mt-4 text-lg">
              Complete view of all 38 work items tracked in Jira, showing project completion status and team productivity
            </p>
          </div>
        </div>

        

        {/* 1-Week Sprint Timeline Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">1-Week Sprint Timeline</h2>
          <div>
            
            {/* Jira Timeline Image */}
            <div className="text-center mb-8">
              <img 
                src={jiraTimelineImage} 
                alt="Jira Sprint Timeline" 
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                style={{ maxHeight: '400px' }}
              />
              <p className="text-gray-600 mt-4 text-lg">
                Actual Jira sprint timeline showing our project progress
              </p>
            </div>
            
            {/* Timeline Header */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">August 20-29, 2025</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Work Completed</span>
                </div>
              </div>
              
              {/* Date Header */}
              <div className="grid grid-cols-10 gap-1 mb-6">
                {['20','21','22', '23', '24', '25', '26', '27', '28', '29'].map((date, index) => (
                  <div key={date} className={`text-center p-2 rounded ${index === 9 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'}`}>
                    <span className={`text-sm font-medium ${index === 9 ? 'text-blue-700' : 'text-gray-700'}`}>Aug {date}</span>
                  </div>
                ))}
              </div>
              
              {/* Sprint Bars */}
              <div className="relative">
                {/* Current Date Line */}
                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 z-10"></div>
                
                {/* Sprint 1 & 2 Bar - spans 5 days (22-26) */}
                <div className="bg-green-600 rounded-lg p-4 mb-4 relative" style={{ width: '55%' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
                      <span className="text-white font-semibold">SCRUM Sprint 1 & 2</span>
                    </div>
                    <span className="text-green-100 text-sm">Aug 20-25</span>
                  </div>
                </div>
                
                {/* Final Sprint Bar - spans 4 days (27-30) */}
                <div className="bg-purple-600 rounded-lg p-4 relative ml-auto" style={{ width: '45%' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
                      <span className="text-white font-semibold">Final Sprint</span>
                    </div>
                    <span className="text-purple-100 text-sm">Aug 26-29</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sprint Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Sprint 1 & 2 (Aug 22-26)
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">5 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Items:</span>
                    <span className="font-medium">22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Focus:</span>
                    <span className="font-medium">UI & Core Features</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h5 className="font-medium text-gray-800 mb-2">Key Deliverables:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Problem Statement Discussion</li>
                    <li>• ML Model Development</li>
                    <li>• Frontend authentication system</li>
                    <li>• Dashboard UI components</li>
                    <li>• Basic API integration</li>
                    <li>• User story mapping</li>
                    <li>• Core functionality setup</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Final Sprint (Aug 27-30)
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">4 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Items:</span>
                    <span className="font-medium">16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-purple-600">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Focus:</span>
                    <span className="font-medium">ML & Deployment</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <h5 className="font-medium text-gray-800 mb-2">Key Deliverables:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hosted in Azure</li>
                    <li>• CI/CD Continous Development</li>
                    <li>• ML model integration</li>
                    <li>• Production deployment</li>
                    <li>• User acceptance testing</li>
                    <li>• Documentation completion</li>
                    <li>• Final bug fixes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools & Integration Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Collaboration Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-17 h-12 flex items-center justify-center mx-auto mb-3">
                <img src={jiraLogo} alt="Jira" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Jira</h3>
              <p className="text-sm text-gray-600">Project management & issue tracking</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-17 h-12 flex items-center justify-center mx-auto mb-3">
                <img src={githubLogo} alt="GitHub" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">GitHub</h3>
              <p className="text-sm text-gray-600">Version control & code collaboration</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-17 h-12 flex items-center justify-center mx-auto mb-3">
                <img src={Google_Meet_Symbol} alt="Google Meet"/>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Google Meet</h3>
              <p className="text-sm text-gray-600">Communication & video meetings</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-17 h-12 flex items-center justify-center mx-auto mb-3">
                <img src={GoogleDoc} alt="Google Documents"/>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Google Documents</h3>
              <p className="text-sm text-gray-600">Documentation & knowledge sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;

