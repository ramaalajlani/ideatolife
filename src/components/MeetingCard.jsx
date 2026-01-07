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
          : 'border-orange-500 bg-gray-50'
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
      <InfoItem label="Committee" value={meeting.committee_name} />
      <InfoItem 
        label="Date & Time" 
        value={`${dateUtils.formatMeetingDate(meeting.meeting_date)} - ${dateUtils.formatMeetingTime(meeting.meeting_date)}`} 
      />
      <InfoItem label="Type" value={meeting.type} />
      {meeting.notes && <InfoItem label="Notes" value={meeting.notes} />}
      <InfoItem label="Requested By" value={meeting.requested_by} />
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
    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm whitespace-nowrap"
  >
    Join Meeting
  </button>
);

const SoonBadge = ({ hoursLeft }) => (
  <div className="mt-2 inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
    Soon ({hoursLeft} hours)
  </div>
);

export default MeetingCard;