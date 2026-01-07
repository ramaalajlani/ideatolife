// src/components/Welcome.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const { ideaId } = useParams(); // الحصول على ideaId من URL

  const handleStart = () => {
    // الانتقال إلى صفحة Business Model Canvas مع ideaId
    navigate(`/ideas/${ideaId}/business-model`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-gray-900">
      {/* الصورة مصغرة قليلاً */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/src/assets/Business Model Canvas.jpg" 
          alt="Business Model Canvas"
          className="max-w-none max-h-none object-contain"
          style={{ 
            width: '85%',
            height: '85%'
          }}
        />
      </div>
      
      {/* Overlay لتخفيف الصورة لجعل النص مقروءًا */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Welcome to
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Business Model
            <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
              {" "}
              Canvas
            </span>
          </h1>
          <p className="text-lg text-white mb-8 max-w-md mx-auto">
            Build your business model step by step with our comprehensive canvas tool
          </p>
          {/* إظهار ideaId إذا كان موجوداً */}
          {ideaId && (
            <p className="text-lg text-orange-300 mb-4">
              Working on Idea: <span className="font-bold">#{ideaId}</span>
            </p>
          )}
        </div>
        
        <button 
          onClick={handleStart}
          className="bg-gradient-to-r from-orange-500 to-orange-800 text-white font-semibold text-lg px-12 py-4 rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-900 transform hover:scale-105 transition-all duration-300"
        >
          Let's Start
        </button>
        
        <div className="mt-12 flex justify-center space-x-8 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">9</div>
            <div className="text-sm">Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">15</div>
            <div className="text-sm">Minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;