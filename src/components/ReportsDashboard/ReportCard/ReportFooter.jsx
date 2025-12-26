import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const ReportFooter = ({ createdAt }) => (
  <div className="border-t border-gray-100 pt-4 mt-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Calendar size={14} />
        <span>Created: {createdAt}</span>
      </div>
      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors">
        View Details
        <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

export default ReportFooter;