// src/components/Timeline/TimelineItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Lottie from 'lottie-react';

const TimelineItem = ({ data, index, roadmapInfo, ideaId }) => {
  const navigate = useNavigate();
  const {
    stage_name,
    colors,
    isCurrent,
    isCompleted,
    link,
    animation
  } = data;

  const handleClick = () => {
    console.log('النقر على مرحلة:', stage_name);
    console.log('سيتم الانتقال إلى:', link?.url);
    
    if (link?.url && link.url !== '#') {
      navigate(link.url);
    } else if (ideaId) {
      navigate(`/ideas/${ideaId}/roadmap?stage=${encodeURIComponent(stage_name)}`);
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = () => {
    if (isCompleted) {
      return {
        icon: <CheckCircle className="w-5 h-5" />,
        text: 'مكتمل',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    }
    if (isCurrent) {
      return {
        icon: <Clock className="w-5 h-5 animate-pulse" />,
        text: 'جاري التنفيذ',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    }
    return {
      icon: <AlertCircle className="w-5 h-5" />,
      text: 'قيد الانتظار',
      color: 'text-gray-400',
      bgColor: 'bg-gray-100'
    };
  };

  const statusInfo = getStatusIcon();

  return (
    <div className="group relative my-4 flex w-1/2 justify-end pr-16 odd:justify-start odd:self-end odd:pl-16 odd:pr-0">
      {/* الخط الواصل */}
      <div 
        className="absolute top-1/2 w-16 h-0.5 transform -translate-y-1/2"
        style={{ 
          backgroundColor: colors.main,
          right: index % 2 === 0 ? '-1rem' : 'auto',
          left: index % 2 !== 0 ? '-1rem' : 'auto'
        }}
      ></div>
      
      {/* الدرجة ثلاثية الأبعاد */}
      <div 
        className={`relative w-[380px] max-w-[95%] transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer rounded-xl shadow-lg ${
          isCurrent ? 'ring-4 ring-yellow-400 ring-opacity-50' : 
          isCompleted ? 'ring-2 ring-green-400' : ''
        }`}
        onClick={handleClick}
        style={{
          background: `linear-gradient(145deg, ${colors.light} 0%, ${colors.main} 100%)`,
          border: `3px solid ${colors.dark}`,
        }}
      >
        {/* تأثير الظل */}
        <div 
          className="absolute inset-0 rounded-xl opacity-30 blur-sm"
          style={{
            background: `linear-gradient(145deg, ${colors.dark} 0%, transparent 50%)`,
            transform: 'translateY(8px) scale(0.95)',
          }}
        ></div>

        {/* الحافة الأمامية */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-4 rounded-b-xl z-0"
          style={{
            backgroundColor: colors.dark,
            transform: 'translateY(4px)',
            boxShadow: `0 4px 8px ${colors.dark}40`
          }}
        ></div>

        {/* المحتوى */}
        <div className="relative z-10 p-6 rounded-xl bg-white/95 backdrop-blur-sm m-2">

          {/* الأنيميشن */}
          <div className="h-48 mb-4 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <Lottie
              animationData={animation}
              loop={true}
              autoplay={true}
              className="h-full w-full"
            />
          </div>

          {/* اسم المرحلة */}
          <div 
            className="w-full p-3 text-center text-lg font-bold uppercase tracking-wider rounded-lg shadow-md"
            style={{ 
              backgroundColor: colors.main, 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {stage_name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;