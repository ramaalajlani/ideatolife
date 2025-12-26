// src/components/GanttChart/TimelineHeader.jsx
import React from 'react';
import { LIST_COLUMN_WIDTH } from '../../utils/ganttUtils';

const TimelineHeader = React.memo(({ days, viewMode, columnWidth }) => {
    const extraDays = 5;
    
    return (
        <div 
            className="grid border-b border-gray-300 sticky top-0 bg-white shadow-lg z-20"
            style={{ 
                gridTemplateColumns: `${LIST_COLUMN_WIDTH} repeat(${days.length + extraDays}, ${columnWidth}px)`,
            }}
        >
            <div className="w-full px-4 py-3 text-sm font-bold text-gray-800 bg-gray-100 border-l border-gray-300 sticky right-0 z-30">
                Task Details
            </div>
            
            {days.map((day, index) => {
                const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
                const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

                return (
                    <div 
                        key={index} 
                        className={`text-center py-2 transition-colors border-l ${isWeekend ? 'border-gray-200 bg-gray-50' : 'border-gray-100'} ${
                            day.isToday 
                                ? 'bg-gradient-to-b from-pink-100 to-pink-50 text-pink-700 font-bold border-pink-200' 
                                : 'bg-white text-gray-900' 
                        }`}
                    >
                        <span className="block text-xs font-medium text-gray-500">
                            {viewMode === 'day' ? dayName : dayName.charAt(0)}
                        </span>
                        <span className={`block text-sm font-bold ${day.isToday ? 'text-pink-600' : 'text-gray-800'}`}>
                            {day.day}
                        </span>
                    </div>
                );
            })}
            
            {Array.from({ length: 5 }).map((_, index) => (
                <div 
                    key={`extra-${index}`}
                    className={`text-center py-2 transition-colors border-l border-gray-100 bg-white`}
                >
                    <span className="block text-xs font-medium text-gray-500">
                        -
                    </span>
                    <span className="block text-sm font-bold text-gray-400">
                        -
                    </span>
                </div>
            ))}
        </div>
    );
});

export default TimelineHeader;