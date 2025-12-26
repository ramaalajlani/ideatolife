import React from 'react';

const CalendarDays = ({ days, onMeetingSelect }) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-b-2xl shadow-xl">
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {dayNames.map(day => (
          <div key={day} className="p-4 text-center font-bold text-gray-700 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              min-h-[120px] p-2 bg-white transition-all duration-200
              ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              ${day.isToday ? 'ring-2 ring-blue-500 ring-inset bg-blue-50' : ''}
              ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
              hover:bg-gray-50 cursor-pointer
            `}
          >
            <div className={`
              text-sm font-semibold mb-1
              ${day.isToday ? 'text-blue-600' : ''}
              ${!day.isCurrentMonth ? 'text-gray-400' : ''}
            `}>
              {day.date.getDate()}
            </div>
            
            {/* Meetings */}
            <div className="space-y-1">
              {day.meetings.slice(0, 2).map((meeting, meetingIndex) => (
                <div
                  key={meetingIndex}
                  className="text-xs p-1 bg-blue-500 text-white rounded truncate cursor-pointer hover:bg-blue-600 transition-colors"
                  onClick={() => onMeetingSelect(meeting)}
                >
                  {meeting.title}
                </div>
              ))}
              
              {day.meetings.length > 2 && (
                <div className="text-xs text-gray-500 text-center">
                  +{day.meetings.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDays;