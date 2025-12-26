// src/components/ReportsDashboard/IdeaInfo.jsx
import React from 'react';
import { Lightbulb } from 'lucide-react';

const IdeaInfo = ({ idea }) => (
  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <Lightbulb size={18} className="text-blue-600" />
      <h4 className="font-semibold text-blue-900 text-sm">معلومات الفكرة</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div>
        <span className="text-gray-600 block text-xs mb-1">العنوان:</span>
        <p className="font-medium text-gray-900 text-sm">{idea.title}</p>
      </div>
      <div>
        <span className="text-gray-600 block text-xs mb-1">الحالة:</span>
        <p className="font-medium text-gray-900 text-sm">
          {idea.status === 'approved' ? 'مقبولة' :
           idea.status === 'rejected' ? 'مرفوضة' :
           idea.status === 'needs_revision' ? 'تحتاج مراجعة' :
           idea.status === 'pending' ? 'قيد المراجعة' : idea.status}
        </p>
      </div>
    </div>
  </div>
);

export default IdeaInfo;