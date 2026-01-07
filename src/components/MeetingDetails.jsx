import React from 'react';
import Lottie from "lottie-react";
import VideoCallAnimation from '../assets/animations/Video call.json';

const MeetingDetails = ({ meeting, onClose }) => {
  if (!meeting) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMeetingType = (type) => {
    const types = {
      'initial': 'Initial Meeting',
      'technical_review': 'Technical Review',
      'funding_review': 'Funding Review',
      'marketing_review': 'Marketing Review',
      'business_plan_review': 'Business Plan Review'
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        {/* Header with animation on the right */}
        <div className="bg-[#FFE2AF] text-gray-800 p-6 rounded-t-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Meeting Details</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>{formatDateTime(meeting.meeting_date)}</span>
                </div>
                {meeting.is_soon && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    In {meeting.hours_left} hours
                  </span>
                )}
              </div>
            </div>
            
            {/* Animation on the right in header */}
            <div className="w-24 h-24 ml-4 flex-shrink-0">
              <Lottie 
                animationData={VideoCallAnimation} 
                loop 
                autoplay 
                className="w-full h-full"
              />
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-800 hover:text-gray-600 text-2xl absolute top-4 right-4"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{meeting.idea_title}</h3>
            <div className="space-y-4">
              <DetailItem label="Committee" value={meeting.committee_name} />
              <DetailItem label="Meeting Type" value={getMeetingType(meeting.type)} />
              <DetailItem 
                label="Requested By" 
                value={meeting.requested_by === 'committee' ? 'Committee' : 'Idea Owner'} 
              />
              
              {meeting.notes && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{meeting.notes}</p>
                </div>
              )}
            </div>
          </div>

          {meeting.meeting_link && (
            <div className="text-center">
              <a
                href={meeting.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium text-lg"
              >
                Join Meeting Now
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default MeetingDetails;