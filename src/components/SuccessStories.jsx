import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const SuccessStories = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/graduated-projects")
      .then((res) => {
        setProjects(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-white">
        <div className="w-12 h-12 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative py-32 bg-white overflow-hidden text-slate-900">
      <div className="container mx-auto px-6">
        {/* الهيدر */}
        <div className="max-w-4xl mx-auto text-center mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.25em]">
            Hall of Excellence
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-[ -0.04em] leading-none">
            Success <span className="text-orange-600">Stories.</span>
          </h2>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            From conceptual sparks to market leaders. Explore the projects that define our ecosystem's success.
          </p>
        </div>

        {/* شبكة البطاقات */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col h-full bg-white rounded-[3rem] border-2 border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden
                         transition-all duration-300 hover:bg-orange-50 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Card Badge */}
              <div className="absolute top-8 left-8 z-20">
                <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 text-[10px] font-black uppercase text-slate-900 shadow-sm">
                  {project.graduation_date || "Class of 2024"}
                </span>
              </div>

              {/* Text Content */}
              <div className="px-10 pt-16 pb-12 text-center flex-grow flex flex-col">
                <div className="mb-6">
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-4 h-[2px] bg-orange-500/30"></span>
                    {project.owner.name}
                    <span className="w-4 h-[2px] bg-orange-500/30"></span>
                  </p>
                </div>

                <p className="text-slate-500 text-base leading-relaxed font-medium mb-10 line-clamp-3">
                  {project.description ||
                    "A revolutionary project that successfully transitioned from a visionary prototype to a high-impact market solution."}
                </p>

                {/* Card Footer */}
                <div className="mt-auto pt-8 border-t border-slate-50">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">
                      Supervised By
                    </span>
                    <div className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl shadow-slate-200">
                      {project.committee?.name || "Innovation Council"}
                    </div>
                  </div>
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
