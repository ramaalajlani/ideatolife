import React from 'react';
import { FileText } from 'lucide-react';

const ReportDescription = ({ description }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-2">
      <FileText size={16} className="text-gray-600" />
      <p className="text-sm text-gray-600">Report Description</p>
    </div>
    <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded border">{description}</p>
  </div>
);

export default ReportDescription;