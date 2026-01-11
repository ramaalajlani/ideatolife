// components/Workflow.jsx
import { CheckCircle2 } from "lucide-react";
import codeImg from "../assets/code.jpg";
import { workflowSteps } from "../constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.3,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 }, 
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const Workflow = () => {
  return (
    <div className="mt-16 px-4">
      {/* العنوان مع تحسين سماكة الخط والتباعد */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl text-center mt-4 tracking-tight font-black text-white leading-tight">
        The Integrated System for{" "}
        <span className="bg-gradient-to-r from-orange-400 to-orange-700 text-transparent bg-clip-text">
          Idea Incubation
        </span>
      </h2>

      <div className="flex flex-wrap justify-center mt-12 lg:mt-20">
        {/* الصورة مع إضافة ظل ناعم */}
        <div className="p-4 w-full lg:w-1/2 flex justify-center">
          <img 
            src={codeImg} 
            alt="Business development workflow" 
            className="rounded-[2rem] h-auto max-h-[600px] object-cover w-full shadow-2xl border border-neutral-800 hover:scale-[1.01] transition-transform duration-500"
          />
        </div>

        {/* الخطوات مع تحسين نصوص العناوين والوصف */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="pt-8 w-full lg:w-1/2 lg:pl-12"
        >
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="flex mb-10 group cursor-default p-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300"
            >
              {/* أيقونة التحقق */}
              <div className="text-emerald-400 mx-6 bg-neutral-900 h-12 w-12 p-3 justify-center items-center rounded-xl flex border border-neutral-800 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 transition-all duration-300 shadow-inner">
                <CheckCircle2 strokeWidth={3} />
              </div>

              <div>
                {/* العنوان: جعلته عريضاً (Bold) ولونه أكثر بياضاً */}
                <h5 className="mt-1 mb-2 text-2xl font-black text-white tracking-tight group-hover:text-orange-400 transition-colors duration-300">
                  {step.title}
                </h5>
                
                {/* الوصف: جعلته بلون رمادي فاتح مع زيادة ارتفاع السطر لسهولة القراءة */}
                <p className="text-md text-neutral-400 leading-relaxed font-medium group-hover:text-neutral-200 transition-colors duration-300 max-w-md">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Workflow;