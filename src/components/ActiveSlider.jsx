import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ServiceData } from "../constants"; 

import "swiper/css";

const SWIPER_CONFIG = {
  slidesPerView: 2,
  spaceBetween: 20,
  autoplay: { 
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  speed: 5000, // سرعة متوسطة (5 ثواني)
  loop: true,
  grabCursor: true,
  allowTouchMove: true,
  freeMode: {
    enabled: true,
    momentum: false,
  },
};

const ServiceCard = ({ service }) => (
  <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200">
    <div className="h-80 w-full overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${service.backgroundImage})` }}
      />
    </div>
    
    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 group-hover:w-full" />
  </div>
);

const ActiveSlider = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Swiper
            {...SWIPER_CONFIG}
            modules={[Autoplay]}
            className="w-full"
          >
            {ServiceData.map((service, index) => (
              <SwiperSlide key={`service-${index}`}>
                <div className="py-2 h-full">
                  <ServiceCard service={service} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ActiveSlider;