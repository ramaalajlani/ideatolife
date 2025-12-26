import React from 'react';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
const ListSection = ({ title, items, type }) => {
  if (!items?.length) return null;

  const IconComponent = {
    strengths: CheckCircle,
    weaknesses: AlertCircle,
    recommendations: Lightbulb
  }[type] || CheckCircle;

  const colorClass = {
    strengths: 'text-emerald-700',
    weaknesses: 'text-amber-700',
    recommendations: 'text-blue-700'
  }[type] || 'text-gray-700';

  const arabicTitles = {
    strengths: 'النقاط القوية',
    weaknesses: 'مجالات التحسين',
    recommendations: 'التوصيات'
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <IconComponent size={18} className={colorClass} />
        <h6 className={`font-semibold text-sm ${colorClass}`}>
          {arabicTitles[type] || title}
        </h6>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
            <span className="text-right">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListSection;