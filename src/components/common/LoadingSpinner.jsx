// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'جاري التحميل...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;