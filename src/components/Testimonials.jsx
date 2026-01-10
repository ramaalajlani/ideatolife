import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Variants لظهور البطاقات
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.2,
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

// بيانات ستاتيك لبقية الحقول
const staticData = {
  bgColor: "bg-gray-800",
  borderColor: "border-gray-700",
  fontColor: "text-white",
  titleClass: "text-lg font-semibold mb-4",
  descClass: "text-gray-200",
};

// قائمة الأدوار الثابتة
const fixedRoles = ["Economist", "Market", "Legal", "Technical", "Investor"];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/contents/index")
      .then((res) => {
        const filtered = res.data.filter((item) => item.type === "testimonial");
        setTestimonials(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AxiosError:", err);
        setError("Failed to fetch testimonials");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-b-4 border-gray-700"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500">
        No testimonials to display.
      </div>
    );
  }

  return (
    <div className="mt-20 tracking-wide">
      {/* العنوان مع نفس تصميم gradient للكود السابق */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 tracking-wide"
      >
        Get Personalized Guidance From Our Team of{" "}
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          Specialized Experts
        </span>
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2"
          >
            <div
              className={`${staticData.bgColor} rounded-md p-6 text-md border ${staticData.borderColor} font-thin flex flex-col items-center`}
            >
              {/* title */}
              <h6 className={`${staticData.titleClass} text-center`}>
                {testimonial.title}
              </h6>

              {/* text */}
              <p className={`${staticData.descClass} text-center`}>
                {testimonial.text}
              </p>

              {/* الصورة داخل الدائرة */}
              <div className="mt-6 w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0">
                {testimonial.image ? (
                  <img
                    src={`http://localhost:8000/${testimonial.image}`}
                    alt={testimonial.title || "testimonial"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                )}
              </div>

              {/* وصف الدور ثابت ولكن متغير بالتتابع */}
              <span className="italic text-gray-400 mt-2">
                {fixedRoles[index % fixedRoles.length]}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonials;
