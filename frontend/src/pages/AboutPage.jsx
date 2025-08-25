import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Hospital Readmissions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering healthcare providers with AI-driven insights to reduce readmission rates and improve patient outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
