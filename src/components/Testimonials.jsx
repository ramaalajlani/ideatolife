import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fixedRoles = ["Economist Expert", "Market Analyst", "Legal Consultant", "Technical Lead", "Strategic Investor"];

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
        setError("Failed to fetch expert guidance data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#0a0f1d]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <section className="relative py-28 bg-[#0a0f1d] overflow-hidden">
      {/* الخلفية الحيوية الداكنة */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6">
        {/* العنوان - أبيض للتباين مع الخلفية الداكنة */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Get Personalized Guidance From Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-800">
              Specialized Experts
            </span>
          </motion.h2>
        </div>

        {/* شبكة البطاقات البيضاء */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -15, transition: { duration: 0.3 } }}
              className="group relative bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_40px_80px_rgba(255,115,0,0.2)] transition-all duration-500 border border-white/10 hover:border-orange-500/50"
            >
              {/* أيقونة اقتباس خفيفة على البطاقة البيضاء */}
              <div className="absolute top-8 right-10 text-slate-100 group-hover:text-orange-100 transition-colors">
                <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="flex flex-col h-full relative z-10">
                {/* العميل / الخبير: الصورة على اليسار */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm group-hover:border-orange-500 transition-all duration-500">
                      {testimonial.image ? (
                        <img
                          src={`http://localhost:8000/${testimonial.image}`}
                          alt={testimonial.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold">
                          {testimonial.title?.charAt(0) || "S"}
                        </div>
                      )}
                    </div>
                    {/* Badge صغير للدور الوظيفي */}
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 w-6 h-6 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-xl mb-1 group-hover:text-orange-600 transition-colors">
                      {testimonial.title}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-50 px-2 py-1 rounded-md inline-block">
                      {fixedRoles[index % fixedRoles.length]}
                    </p>
                  </div>
                </div>

                {/* نص التقييم / النصيحة */}
                <div className="relative">
                  <p className="text-slate-600 text-lg leading-relaxed font-medium italic mb-6">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* خط تفاعلي سفلي */}
                <div className="mt-auto pt-4">
                  <div className="w-12 h-1.5 bg-slate-100 group-hover:bg-orange-500 group-hover:w-24 transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;