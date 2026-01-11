import { features } from "../constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const FeatureSection = () => {
  const [backendFeatures, setBackendFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/contents/index?type=feature")
      .then((res) => {
        setBackendFeatures(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching features:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-orange-500 font-bold uppercase tracking-widest">
        Loading features...
      </div>
    );
  }

  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px] bg-[#0F172A]">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center pt-10"
      >
        <span className="bg-orange-500/10 text-orange-500 rounded-full h-6 text-sm font-black px-4 py-1 uppercase tracking-tighter">
          Features
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-tight font-black text-white">
          Transform Ideas Into{" "}
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
            Successful Businesses
          </span>
        </h2>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap mt-10 lg:mt-20 px-4"
      >
        {backendFeatures.map((feature, index) => {
          const icon = features[index % features.length]?.icon;

          return (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="w-full sm:w-1/2 lg:w-1/3 p-4"
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              {/* البطاقة باللون الأبيض */}
              <div className="bg-white group cursor-pointer h-full rounded-[2.5rem] p-8 shadow-xl shadow-black/20 hover:shadow-orange-500/20 transition-all duration-500 border border-gray-100 flex flex-col items-start text-left">
                
                {/* أيقونة مميزة */}
                <div className="flex mb-6 h-14 w-14 bg-orange-50 text-orange-600 justify-center items-center rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-inner">
                  {icon}
                </div>
                
                <div>
                  {/* عنوان باللون الكحلي الغامق ليكون واضحاً على الأبيض */}
                  <h5 className="mb-4 text-2xl font-black text-[#0F172A] group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h5>
                  
                  {/* وصف بلون رمادي داكن مريح للعين */}
                  <p className="text-md leading-relaxed text-gray-500 font-medium group-hover:text-gray-700 transition-colors duration-300">
                    {feature.text}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FeatureSection;