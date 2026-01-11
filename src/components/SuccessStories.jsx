import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
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
      <div className="text-center py-20 text-xl text-gray-500">
        Loading success stories...
      </div>
    );
  }

  return (
    <section className="mt-20 bg-white py-16">
      <div className="container mx-auto px-4">
        {/* العنوان */}
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

        {/* البطاقات */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => {
            const initials = project.owner.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 sm:mx-auto sm:rounded-lg"
              >
                {/* الخلفية */}
                <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-800 transition-all duration-300 group-hover:scale-[10]" />

                <div className="relative z-10 mx-auto">
                  {/* الصورة */}
                  <div className="relative -mt-6 h-56 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-800 shadow-lg mb-6">
                    <img
                      src="https://via.placeholder.com/400x300?text=Graduated+Project"
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* المستخدم */}
                  <div className="flex items-center mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-800 text-white font-bold text-lg">
                      {initials}
                    </div>
                    <div className="ml-4">
                      <h5 className="text-xl font-semibold text-gray-900 group-hover:text-[#FEEE91]">
                        {project.owner.name}
                      </h5>
                      <p className="text-orange-600 font-medium group-hover:text-[#FEEE91]">
                        {project.title}
                      </p>
                    </div>
                  </div>

                  {/* القصة */}
                  <p className="text-gray-600 group-hover:text-white/90 line-clamp-3">
                    This project successfully graduated from the platform and
                    became an independent business.
                  </p>

                  {/* معلومات إضافية */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-4 group-hover:text-white/80">
                    <div>
                      <span className="font-semibold">Committee:</span>{" "}
                      {project.committee?.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Graduated:</span>{" "}
                      {project.graduation_date}
                    </div>
                  </div>

                  {/* زر */}
                  <div className="flex justify-end mt-6">
                    <button className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-6 text-sm font-bold uppercase text-white transition-all hover:scale-105">
                      Read More
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;
