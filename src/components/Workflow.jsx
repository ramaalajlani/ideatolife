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
    <div className="mt-16">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-4 tracking-wide">
        The Integrated System for{" "}
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          Idea Incubation
        </span>
      </h2>

      <div className="flex flex-wrap justify-center mt-8">
        {/* Image */}
        <div className="p-2 w-full lg:w-1/2">
          <img 
            src={codeImg} 
            alt="Business development workflow" 
            className="rounded-lg h-200 object-cover w-full shadow-lg hover:opacity-90 transition-opacity duration-300"
          />
        </div>

        {/* Steps with slower stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="pt-8 w-full lg:w-1/2"
        >
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="flex mb-8 hover:bg-gray-800/30 p-3 rounded-lg transition-all duration-300"
            >
              <div className="text-green-400 mx-6 bg-gray-700 h-10 w-10 p-2 justify-center items-center rounded-full flex border border-gray-600 hover:bg-green-500 hover:text-white transition-colors duration-300">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-3 text-xl hover:text-orange-400 transition-colors duration-300">
                  {step.title}
                </h5>
                <p className="text-md text-neutral-300 hover:text-white transition-colors duration-300">
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