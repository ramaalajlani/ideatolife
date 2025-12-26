import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { getScoreColor } from '../utils';

// src/components/ReportsDashboard/CommitteeScore.jsx
const CommitteeScore = ({ committee, score }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Users size={16} className="text-gray-600" />
        <p className="text-sm text-gray-600">اللجنة المسؤولة</p>
      </div>
      <p className="font-medium text-gray-900 text-sm bg-gray-50 p-2 rounded border text-right">
        {committee || "غير محدد"}
      </p>
    </div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={16} className="text-gray-600" />
        <p className="text-sm text-gray-600">درجة التقييم</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-4 py-2 rounded-lg font-bold text-white shadow-sm ${getScoreColor(score)}`}>
          {score}%
        </span>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CommitteeScore;