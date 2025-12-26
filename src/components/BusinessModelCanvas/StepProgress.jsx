// src/components/BusinessModelCanvas/StepProgress.jsx
import React from 'react';

const StepProgress = ({ currentStep, totalSteps, currentTitle }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-bold text-orange-600">{currentTitle}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-orange-500 to-orange-800 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepProgress;