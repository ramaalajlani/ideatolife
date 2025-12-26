import React from 'react';
import { dateUtils } from '../utils/dateUtils'; // تغيير المسار من ./ إلى ../

const CalendarHeader = ({ currentDate, onPrevious, onNext }) => {
  const currentMonth = dateUtils.getFormattedMonth(currentDate);

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-2xl">
      <button 
        onClick={onPrevious}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 font-medium"
      >
        <span>‹</span>
        الشهر السابق
      </button>
      
      <h2 className="text-2xl font-bold text-center">
        {currentMonth}
      </h2>
      
      <button 
        onClick={onNext}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 font-medium"
      >
        الشهر التالي
        <span>›</span>
      </button>
    </div>
  );
};

export default CalendarHeader;