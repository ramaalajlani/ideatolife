import React from 'react';
import { successStories } from "../constants";

const SuccessStories = () => {
  return (
    <section className="mt-20 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl mb-4 tracking-wide text-black">
            Success{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
              Stories
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Inspiring projects that started on our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <div 
              key={index} 
              className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:rounded-lg"
            >
              {/* الدائرة المتحركة في الخلفية */}
              <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-800 transition-all duration-300 group-hover:scale-[10]"></span>
              
              <div className="relative z-10 mx-auto">
                {/* الصورة */}
                <div className="relative -mt-6 h-56 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-border text-white shadow-lg mb-6">
                  <img
                    src={story.image}
                    alt={story.project}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                
                {/* معلومات المستخدم */}
                <div className="flex items-center mb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-800 transition-all duration-300 group-hover:bg-orange-400 text-white font-bold text-lg">
                    {story.initials}
                  </div>
                  <div className="ml-4">
                    <h5 className="text-xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-white">
                      {story.name}
                    </h5>
                    <p className="text-orange-600 font-medium transition-all duration-300 group-hover:text-orange-200">
                      {story.project}
                    </p>
                  </div>
                </div>

                {/* القصة */}
                <div className="space-y-4 pt-2 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                  <p className="line-clamp-3">
                    {story.story}
                  </p>
                </div>

                {/* التمويل والمدة */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 mt-4 transition-all duration-300 group-hover:text-white/80">
                  <div>
                    <span className="font-semibold">Funding:</span> {story.funding}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {story.duration}
                  </div>
                </div>

                {/* التقييم والزر */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-yellow-400 text-lg transition-all duration-300 group-hover:text-yellow-300">
                    {"★".repeat(story.rating)}
                  </div>
                  <button className="select-none rounded-lg bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-6 text-center font-sans text-sm font-bold uppercase text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 focus:opacity-85 active:opacity-85">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;