// ActiveSliderFromBackend.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import axios from "axios";

import "swiper/css";

const SWIPER_CONFIG = {
  slidesPerView: 2,
  spaceBetween: 20,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
  speed: 5000,
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
        style={{ backgroundImage: `url(${service.image})` }}
      />
    </div>

    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300 group-hover:w-full" />
  </div>
);

const ActiveSliderFromBackend = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/contents/index?type=slide")
      .then((res) => {
        // نحول المسار ليكون صالح للعرض
        const formatted = res.data.map((item) => ({
          ...item,
          image: `http://localhost:8000/${item.image}`,
        }));
        setSlides(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AxiosError:", err);
        setError("Failed to fetch slides");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-b-4 border-gray-700"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (slides.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500">
        No slides to display.
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Swiper {...SWIPER_CONFIG} modules={[Autoplay]} className="w-full">
          {slides.map((slide, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <div className="py-2 h-full">
                <ServiceCard service={slide} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ActiveSliderFromBackend;
