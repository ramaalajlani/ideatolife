// src/components/ReportsDashboard/IdeaInfo.jsx
import React from 'react';
import { Lightbulb } from 'lucide-react';

const IdeaInfo = ({ idea }) => {
  // Check for idea to prevent error
  if (!idea) {
    return (
      <div className="mb-6 p-4 bg-[#FFC785]/20 rounded-lg border border-[#FFC785] shadow-sm animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-[#FFC785]" />
          <h4 className="font-semibold text-gray-800 text-sm">Idea Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Translate idea status to English
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'needs_revision': return 'Needs Revision';
      case 'pending': return 'Under Review';
      default: return status || 'Unknown';
    }
  };

  return (
    <div className="mb-6 p-4 bg-[#FFC785]/20 rounded-lg border border-[#FFC785] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-[#FFC785]" />
        <h4 className="font-semibold text-gray-800 text-sm">Idea Information</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600 block text-xs mb-1">Title:</span>
          <p className="font-medium text-gray-900 text-sm">
            {idea.title || 'No title available'}
          </p>
        </div>
        <div>
          <span className="text-gray-600 block text-xs mb-1">Status:</span>
          <p className="font-medium text-gray-900 text-sm">
            {getStatusText(idea.status)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdeaInfo;