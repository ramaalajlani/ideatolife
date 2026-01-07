import { testimonials } from "../constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5, // كل بطاقة تظهر بعد 0.5 ثانية
      delayChildren: 0.2,   // بداية ظهور البطاقات بعد 0.2 ثانية
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
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

const Testimonials = () => {
  return (
    <div className="mt-20 tracking-wide">
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
            <div className="bg-gray-800 rounded-md p-6 text-md border border-gray-700 font-thin">
              <p className="text-gray-200">{testimonial.text}</p>

              <div className="flex mt-8 items-start">
                <div className="w-12 h-12 mr-6 rounded-full border border-gray-600 bg-gray-700 overflow-hidden flex items-center justify-center">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.user}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-500 to-orange-800 flex items-center justify-center text-white text-sm font-bold">
                      {testimonial.user.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div>
                  <h6 className="text-lg font-semibold text-white">{testimonial.user}</h6>
                  <span className="text-sm font-normal italic text-gray-400">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonials;