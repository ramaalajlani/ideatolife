import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import IdeasBulbs from '../assets/animations/Ideas Bulbs.json';

const ProdifyLanding = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/IdeaSubmissionForm');
  };

  const features = [
    {
      title: "Innovate",
      description: "Bring your unique ideas to life",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Develop",
      description: "Transform concepts into reality",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Launch",
      description: "Introduce your product to the world",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <Lottie 
          animationData={IdeasBulbs}
          loop={true}
          autoplay={true}
          className="w-full h-full"
          style={{ width: '100vw', height: '100vh' }}
        />
      </div>

      <div className="absolute inset-0 z-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-400 to-purple-500 opacity-30 animate-float"
            style={{
              width: Math.random() * 20 + 5 + 'px',
              height: Math.random() * 20 + 5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-8">
        <div className="max-w-6xl mx-auto text-center w-full">
          
          <div className="mb-16">
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
                <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 text-transparent bg-clip-text">
                  IDEA2LIFE
                </span>
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 text-transparent bg-clip-text blur-xl opacity-50 -z-10"></div>
            </div>
            
            <p className="text-2xl md:text-3xl font-light mb-8 text-gray-300">
              Where <span className="font-bold text-orange-400">Ideas</span> Become{' '}
              <span className="font-bold text-purple-400">Products</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-orange-400/30 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="mb-12">
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                Transform your vision into reality and become a pioneer in your market with an innovative product that inspires the world
              </p>
            </div>

            <div className="relative">
              <button 
                onClick={handleStartBuilding}
                className="relative group bg-gradient-to-r from-orange-500 to-purple-600 py-6 px-12 rounded-full text-white font-bold text-xl transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/25 transform hover:scale-110"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Launch Your Idea</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 blur-lg group-hover:blur-xl transition-all duration-500 opacity-75 group-hover:opacity-100 -z-10"></div>
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 animate-ping opacity-20"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProdifyLanding;