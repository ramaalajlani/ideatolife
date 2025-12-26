// في Testimonials.jsx - أضف fallback
import { testimonials } from "../constants";

const Testimonials = () => {
  return (
    <div className="mt-20 tracking-wide">
<h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20 tracking-wide">
  Get Personalized Guidance From Our Team of{" "}
  <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
    Specialized Experts
  </span>
</h2>

      <div className="flex flex-wrap justify-center">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
            <div className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-800 font-thin">
              <p>{testimonial.text}</p>
              
              <div className="flex mt-8 items-start">
                <div className="w-12 h-12 mr-6 rounded-full border border-neutral-300 bg-neutral-700 overflow-hidden flex items-center justify-center">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.user}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-r from-orange-500 to-orange-800 flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.user.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <h6 className="text-lg font-semibold">{testimonial.user}</h6>
                  <span className="text-sm font-normal italic text-neutral-600">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;