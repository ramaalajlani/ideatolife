import React from 'react';
import { FileText } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

const ReportHeader = ({ type, id, status }) => {
  const statusColor = getStatusColor(status);
  
  return (
    <div className="relative">

      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800 px-6 py-2 rounded-t-lg text-sm font-medium z-10 flex items-center justify-center gap-2 shadow-md min-w-[140px] whitespace-nowrap">
        <FileText size={16} className="flex-shrink-0" />
        <span className="font-medium">Report {id}</span>
      </div>
      
      <div className="border-b-2 border-gray-200/30 px-6 pt-8 pb-4 bg-gradient-to-r from-slate-50 to-gray-100 rounded-t-lg mt-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-sm" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight break-words">
                {type}
              </h3>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColor} shadow-sm whitespace-nowrap`}>
            {status === 'completed' ? 'Completed' : 
             status === 'in_progress' ? 'In Progress' : 
             status === 'pending' ? 'Pending' : status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;