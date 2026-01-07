import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const HeroSection = () => {
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, -60]);

  const handleStartFree = () => {
    navigate('/prodify'); // تم التعديل هنا
  };

  const title = "Software Startup Incubator Platform";
  const titleWords = title.split(" ");

  const subTitle =
    "Build, launch, and scale your software startup with expert guidance, smart tools, and a collaborative ecosystem designed for ambitious founders.";
  const subTitleWords = subTitle.split(" ");

  return (
    <div className="relative overflow-hidden">
      
      {/* --- عناصر الخلفية المتحركة --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        {/* فقاعة علوية يمين */}
        <motion.div 
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-100 rounded-full blur-[120px] opacity-60" 
        />
        {/* فقاعة سفلية يسار */}
        <motion.div 
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] opacity-50" 
        />
      </div>
      {/* --------------------------- */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{ y: parallaxY }}
        className="flex flex-col items-center mt-6 lg:mt-20 px-4 min-h-[80vh] justify-center"
      >
        {/* Title */}
        <motion.h1 className="text-4xl sm:text-7xl lg:text-8xl text-center tracking-wide font-bold flex flex-wrap justify-center">
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="mx-1 bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Sub Title */}
        <motion.h2 className="mt-6 text-xl sm:text-2xl lg:text-3xl text-center max-w-5xl text-gray-700 leading-relaxed flex flex-wrap justify-center">
          {subTitleWords.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="mx-1"
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={wordVariants}
          className="mt-10 text-lg text-center max-w-4xl text-gray-600"
        >
          A digital incubator dedicated to software and tech projects, helping founders
          transform ideas into scalable applications and platforms.
        </motion.p>

        {/* Button */}
        <motion.div variants={wordVariants} className="my-10">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartFree}
            className="bg-[#f87115] py-4 px-8 rounded-md text-white font-bold hover:bg-orange-600 transition-colors text-lg shadow-lg"
          >
            Start for Free
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;