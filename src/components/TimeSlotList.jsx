// TimeSlotList.jsx
import React from 'react';

const TimeSlotList = ({ selectedDate, meetings, onMeetingSelect, upcomingMeetings }) => {
  // Create time slots from 8 AM to 8 PM
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    let time12hr = '';
    if (hour === 12) {
      time12hr = '12:00 PM';
    } else if (hour < 12) {
      time12hr = `${hour}:00 AM`;
    } else {
      time12hr = `${hour - 12}:00 PM`;
    }
    timeSlots.push(time12hr);
  }

  // Get meetings for specific time slot
  const getMeetingForTimeSlot = (timeSlot) => {
    return meetings.find(meeting => meeting.time === timeSlot);
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatMeetingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Static data for upcoming meetings
  const staticUpcomingMeetings = [
    {
      id: 1,
      idea_title: 'Mobile App Development Project',
      committee_name: 'Technical Evaluation Committee',
      meeting_date: '2024-01-20 14:30',
      meeting_link: 'https://meet.google.com/abc-def-ghi',
      notes: 'Please prepare to present the complete business plan',
      requested_by: 'committee',
      type: 'business_plan_review',
      hours_left: 12,
      is_soon: true
    },
    {
      id: 2,
      idea_title: 'E-learning Platform',
      committee_name: 'Funding Committee',
      meeting_date: '2024-01-22 10:00',
      meeting_link: 'https://meet.google.com/xyz-uvw-rst',
      notes: null,
      requested_by: 'committee',
      type: 'funding_review',
      hours_left: 58,
      is_soon: false
    },
    {
      id: 3,
      idea_title: 'E-commerce Management System',
      committee_name: 'Marketing Committee',
      meeting_date: '2024-01-25 16:00',
      meeting_link: null,
      notes: 'Meeting to discuss marketing strategy',
      requested_by: 'committee',
      type: 'marketing_review',
      hours_left: 120,
      is_soon: false
    }
  ];

  // Use provided data or static data
  const displayUpcomingMeetings = upcomingMeetings || staticUpcomingMeetings;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* List Title */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {isToday ? "Today's Schedule" : "Schedule for"}
        </h3>
        <p className="text-lg text-purple-600 font-semibold">
          {formatSelectedDate(selectedDate)}
        </p>
        <div className="w-12 h-1 bg-purple-500 rounded-full mt-2"></div>
      </div>

      {/* Time Slots List */}
      <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
        {timeSlots.map((timeSlot, index) => {
          const meeting = getMeetingForTimeSlot(timeSlot);
          const isCurrentTime = false;

          return (
            <div
              key={index}
              onClick={() => meeting && onMeetingSelect(meeting)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                meeting
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-md hover:border-blue-300'
                  : isCurrentTime
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    meeting ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className={`font-semibold ${
                    meeting ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {timeSlot}
                  </span>
                </div>
                
                {meeting ? (
                  <div className="text-right flex-1 ml-4">
                    <div className="font-bold text-gray-800 text-sm">{meeting.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {meeting.duration} min • {meeting.participants.length} participants
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No meetings</span>
                )}
              </div>

              {meeting && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 3).map((participant, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                      >
                        {participant.charAt(0)}
                      </div>
                    ))}
                    {meeting.participants.length > 3 && (
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        +{meeting.participants.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    with {meeting.participants.slice(0, 2).join(', ')}
                    {meeting.participants.length > 2 && ' and others'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Meetings Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Meetings</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {displayUpcomingMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                meeting.is_soon 
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' 
                  : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
              }`}
              onClick={() => onMeetingSelect({
                id: meeting.id,
                title: `Meeting with ${meeting.committee_name}`,
                date: new Date(meeting.meeting_date),
                time: new Date(meeting.meeting_date).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                description: `${meeting.type === 'business_plan_review' ? 'Business Plan Review' : meeting.type === 'funding_review' ? 'Funding Review' : 'Marketing Review'} meeting for "${meeting.idea_title}"`,
                participants: [meeting.committee_name],
                duration: 60,
                meeting_link: meeting.meeting_link,
                notes: meeting.notes,
                type: 'upcoming'
              })}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">
                    {meeting.idea_title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {meeting.committee_name}
                  </p>
                  <p className="text-xs text-purple-600 font-semibold">
                    {formatMeetingDate(meeting.meeting_date)}
                  </p>
                </div>
                
                {meeting.is_soon && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                    Soon
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {meeting.hours_left} hours left
                </span>
                
                {meeting.meeting_link && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(meeting.meeting_link, '_blank');
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Join Meeting
                  </button>
                )}
              </div>

              {/* Meeting Type */}
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  meeting.type === 'business_plan_review' 
                    ? 'bg-blue-100 text-blue-800'
                    : meeting.type === 'funding_review'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {meeting.type === 'business_plan_review' && 'Business Plan Review'}
                  {meeting.type === 'funding_review' && 'Funding Review'}
                  {meeting.type === 'marketing_review' && 'Marketing Review'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Meetings Summary */}
        {displayUpcomingMeetings.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Upcoming Meetings:</span>
              <span className="font-semibold text-gray-800">
                {displayUpcomingMeetings.length} meetings
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Meetings Soon:</span>
              <span className="font-semibold text-orange-600">
                {displayUpcomingMeetings.filter(m => m.is_soon).length} meetings
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotList;