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
      color: "from-orange-600 to-red-700"
    },
    {
      title: "Launch",
      description: "Introduce your product to the world",
      color: "from-red-600 to-red-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
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
            className="absolute rounded-full bg-gradient-to-r from-orange-400 to-red-600 opacity-20 animate-float"
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
          

          <div 
            className="flex flex-col items-center cursor-pointer select-none mb-12" 
            onClick={() => navigate("/")}
          >
            <span className="text-7xl md:text-8xl font-black text-[#f87115] tracking-[ -0.05em] leading-[0.8]">
              Idea
            </span>
            <div className="relative">
              <div className="bg-[#f87115] px-3 py-1.5 rounded-[3px] mt-2 ml-16">
                <span className="text-white text-4xl md:text-5xl font-black tracking-tighter leading-none">
                  2Life
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <p className="text-xl md:text-2xl font-light mt-8 text-gray-700">
              Where <span className="font-bold text-orange-600">Ideas</span> Become{' '}
              <span className="font-bold text-orange-600">Successful Ventures</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white backdrop-blur-sm border border-gray-200 hover:border-orange-300 transition-all duration-500 hover:transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="mb-12">
              <p className="text-lg md:text-xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
                Transform coding into commercial success. We provide technical expertise, resources, and a support system to help software projects evolve from initial concepts to market-ready solutions.
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => navigate('/submit-idea')}
                className="relative group bg-gradient-to-r from-orange-500 to-orange-500 py-5 px-12 rounded-full text-white font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:scale-105"
              >
                Launch Your Startup
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