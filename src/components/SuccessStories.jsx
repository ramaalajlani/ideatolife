import React from 'react';
import { successStories } from "../constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3, // كل بطاقة تظهر بعد الأخرى
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const SuccessStories = () => {
  return (
    <section className="mt-20 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl lg:text-6xl mb-4 tracking-wide text-black"
          >
            Success{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
              Stories
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-neutral-600 max-w-3xl mx-auto"
          >
            Inspiring projects that started on our platform
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }} // تأثير القفز عند الهوفر
              className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 sm:mx-auto sm:rounded-lg"
            >
              {/* الدائرة المتحركة في الخلفية */}
              <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-800 transition-all duration-300 group-hover:scale-[10]"></span>

              <div className="relative z-10 mx-auto">
                {/* الصورة */}
                <div className="relative -mt-6 h-56 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-border text-white shadow-lg mb-6">
                  <img
                    src={story.image}
                    alt={story.project}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                {/* معلومات المستخدم */}
                <div className="flex items-center mb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-800 transition-all duration-300 group-hover:bg-[#FEEE91] text-white font-bold text-lg">
                    {story.initials}
                  </div>
                  <div className="ml-4">
                    <h5 className="text-xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-[#FEEE91]">
                      {story.name}
                    </h5>
                    <p className="text-orange-600 font-medium transition-all duration-300 group-hover:text-[#FEEE91]">
                      {story.project}
                    </p>
                  </div>
                </div>

                {/* القصة */}
                <div className="space-y-4 pt-2 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                  <p className="line-clamp-3">{story.story}</p>
                </div>

                {/* التمويل والمدة */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 mt-4 transition-all duration-300 group-hover:text-white/80">
                  <div>
                    <span className="font-semibold">Funding:</span> {story.funding}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {story.duration}
                  </div>
                </div>

                {/* التقييم والزر */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-yellow-400 text-lg transition-all duration-300 group-hover:text-yellow-300">
                    {"★".repeat(story.rating)}
                  </div>
                  <button className="select-none rounded-lg bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-6 text-center font-sans text-sm font-bold uppercase text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 focus:opacity-85 active:opacity-85 group-hover:bg-[#FEEE91]">
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;
