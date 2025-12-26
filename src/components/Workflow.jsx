// components/Workflow.jsx
import { CheckCircle2 } from "lucide-react";
import codeImg from "../assets/code.jpg";
import { workflowSteps } from "../constants";

const Workflow = () => {
  return (
    <div className="mt-16"> {/* Reduced margin from mt-20 to mt-16 */}
 <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-4 tracking-wide">
  The Integrated System for{" "}
  <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
    Idea Incubation
  </span>
</h2>
<div className="flex flex-wrap justify-center mt-8">
  <div className="p-2 w-full lg:w-1/2">
    <img 
      src={codeImg} 
      alt="Business development workflow" 
      className="rounded-lg h-200 object-cover w-full"
    />
  </div>

        <div className="pt-8 w-full lg:w-1/2"> {/* Reduced pt-12 to pt-8 */}
          {workflowSteps.map((step, index) => (
            <div key={index} className="flex mb-8"> {/* Reduced mb-12 to mb-8 */}
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-3 text-xl">{step.title}</h5> {/* Reduced mb-2 to mb-3 for better spacing */}
                <p className="text-md text-neutral-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;