import React from 'react';

const MeetingsList = ({ meetings, onMeetingSelect }) => {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">📅</div>
        <p className="text-gray-500">لا توجد اجتماعات</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <MeetingCard 
          key={meeting.id} 
          meeting={meeting} 
          onSelect={onMeetingSelect}
        />
      ))}
    </div>
  );
};

const MeetingCard = ({ meeting, onSelect }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getMeetingType = (type) => {
    const types = {
      'initial': 'اجتماع مبدئي',
      'technical_review': 'مراجعة فنية',
      'funding_review': 'مراجعة تمويل',
      'marketing_review': 'مراجعة تسويقية',
      'business_plan_review': 'مراجعة خطة عمل'
    };
    return types[type] || type;
  };

  return (
    <div
      onClick={() => onSelect(meeting)}
      className={`
        bg-white border-l-4 p-4 rounded-lg shadow-sm cursor-pointer 
        hover:shadow-md transition-shadow ${meeting.is_soon ? 'border-red-500' : 'border-blue-500'}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg mb-1">{meeting.idea_title}</h4>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="bg-gray-100 px-2 py-1 rounded">{getMeetingType(meeting.type)}</span>
            <span>👥 {meeting.committee_name}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              📅 {formatDate(meeting.meeting_date)}
            </div>
            <div className="flex items-center gap-1">
              🕒 {formatTime(meeting.meeting_date)}
            </div>
            {meeting.is_soon && (
              <div className="flex items-center gap-1 text-red-600 font-medium">
                ⚡ خلال {meeting.hours_left} ساعة
              </div>
            )}
          </div>
          
          {meeting.notes && (
            <p className="mt-2 text-gray-700 text-sm line-clamp-2">{meeting.notes}</p>
          )}
        </div>
        
        {meeting.meeting_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(meeting.meeting_link, '_blank');
            }}
            className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            انضم
          </button>
        )}
      </div>
    </div>
  );
};

export default MeetingsList;