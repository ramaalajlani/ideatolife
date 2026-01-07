import React from 'react';

const CalendarGrid = ({ currentDate, selectedDate, meetings, onDateSelect, onMeetingSelect }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meeting_date);
      return isSameDay(meetingDate, date);
    });
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    return newDate;
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const days = [];
  
  const daysInPrevMonth = getDaysInMonth(prevMonth());
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayDate = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i);
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      meetings: getMeetingsForDate(dayDate)
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentYear, currentMonth, day);
    days.push({
      date: dayDate,
      isCurrentMonth: true,
      meetings: getMeetingsForDate(dayDate)
    });
  }

  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const dayDate = new Date(currentYear, currentMonth + 1, day);
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      meetings: getMeetingsForDate(dayDate)
    });
  }

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onDateSelect(prevMonth())}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ‹ Previous Month
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {currentDate.toLocaleDateString([], { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
        
        <button
          onClick={() => onDateSelect(nextMonth())}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          Next Month ›
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = isSameDay(day.date, selectedDate);
          const isTodayDate = isToday(day.date);
          
          return (
            <div
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={`
                min-h-24 p-2 border rounded-lg cursor-pointer transition-all
                ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isSelected ? 'border-blue-500 border-2' : 'border-gray-200'}
                ${isTodayDate && day.isCurrentMonth ? 'bg-blue-50' : ''}
                hover:bg-gray-50
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium
                  ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                  ${isTodayDate && day.isCurrentMonth ? 'text-blue-600 font-bold' : ''}
                `}>
                  {day.date.getDate()}
                </span>
                
                {day.meetings.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                    {day.meetings.length}
                  </span>
                )}
              </div>

              {/* Meetings List */}
              <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                {day.meetings.slice(0, 2).map((meeting, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMeetingSelect(meeting);
                    }}
                    className={`
                      text-xs p-1 rounded truncate cursor-pointer
                      ${meeting.is_soon ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                      hover:opacity-90
                    `}
                    title={meeting.idea_title}
                  >
                    ⏰ {meeting.meeting_date.split(' ')[1]}
                  </div>
                ))}
                
                {day.meetings.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.meetings.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;