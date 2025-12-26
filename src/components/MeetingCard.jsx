import React from 'react';
import { dateUtils } from './utils/dateUtils';

const MeetingCard = ({ meeting, onSelect }) => {
  const handleClick = () => {
    onSelect(meeting);
  };

  const handleJoinMeeting = (e) => {
    e.stopPropagation();
    window.open(meeting.meeting_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
        meeting.is_soon 
          ? 'border-red-500 bg-red-50' 
          : 'border-cyan-500 bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <MeetingInfo meeting={meeting} />
        <JoinButton onClick={handleJoinMeeting} />
      </div>
      
      {meeting.is_soon && <SoonBadge hoursLeft={meeting.hours_left} />}
    </div>
  );
};

const MeetingInfo = ({ meeting }) => (
  <div className="flex-1">
    <h4 className="font-bold text-gray-800 text-lg">{meeting.idea_title}</h4>
    
    <div className="mt-2 space-y-1">
      <InfoItem label="اللجنة" value={meeting.committee_name} />
      <InfoItem 
        label="الموعد" 
        value={`${dateUtils.formatMeetingDate(meeting.meeting_date)} - ${dateUtils.formatMeetingTime(meeting.meeting_date)}`} 
      />
      <InfoItem label="النوع" value={meeting.type} />
      {meeting.notes && <InfoItem label="ملاحظات" value={meeting.notes} />}
      <InfoItem label="طلب بواسطة" value={meeting.requested_by} />
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <p className="text-sm text-gray-600">
    <span className="font-medium">{label}:</span> {value}
  </p>
);

const JoinButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm whitespace-nowrap"
  >
    انضم للاجتماع
  </button>
);

const SoonBadge = ({ hoursLeft }) => (
  <div className="mt-2 inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
    ⚡ اجتماع قريب ({hoursLeft} ساعة)
  </div>
);

export default MeetingCard;