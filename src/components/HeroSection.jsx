import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/ProdifyLanding');
  };

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20 bg-white text-black">
      <h1 className="text-4xl sm:text-7xl lg:text-8xl text-center tracking-wide font-bold">
        E-Business Incubator
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          for StartUp
        </span> 
      </h1>
      
      <p className="mt-10 text-lg text-center text-black max-w-4xl">
        Empower your creativity and bring your app ideas to life with our intuitive development tools. Get started today and turn your imagination into immersive reality!
      </p>

      <div className="flex justify-center my-10">
        <button
          onClick={handleStartFree}
          className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 rounded-md text-white transition-all duration-300 hover:scale-105"
        >
          Start for Free
        </button>
      </div>
    </div>
  );
};

export default HeroSection;