import { features } from "../constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5, // زيادة الفاصل بين ظهور كل ميزة → أبطأ
      delayChildren: 0.3,   // تأخير بداية ظهور أول ميزة
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50, // حركة أكبر لتكون أكثر وضوحًا
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8, // مدة أطول → ظهور أبطأ وأكثر سلس
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FeatureSection = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px] bg-gray-900">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="bg-gray-800 text-orange-500 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
          Features
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
          Transform Ideas Into{" "}
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            Successful Businesses
          </span>
        </h2>
      </motion.div>

      {/* Features */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap mt-10 lg:mt-20"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="w-full sm:w-1/2 lg:w-1/3"
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <div className="flex cursor-pointer hover:bg-gray-800/50 transition-all duration-300 rounded-xl p-4 mx-2">
              <div className="flex mx-6 h-10 w-10 p-2 bg-gray-800 text-orange-700 justify-center items-center rounded-full group-hover:bg-orange-700 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <div>
                <h5 className="mt-1 mb-6 text-xl text-white group-hover:text-orange-400 transition-colors duration-300">
                  {feature.text}
                </h5>
                <p className="text-md p-2 mb-20 text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeatureSection;