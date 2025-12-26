import React from 'react';

const SummaryStats = ({ reports }) => {
  const stats = {
    completed: reports.filter(r => r.status === 'completed').length,
    highScore: reports.filter(r => r.score >= 70).length,
    averageScore: reports.length > 0 
      ? (reports.reduce((sum, r) => sum + r.score, 0) / reports.length).toFixed(1)
      : 0,
    reportTypes: [...new Set(reports.map(r => r.type))],
    committees: [...new Set(reports.filter(r => r.committee).map(r => r.committee))]
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-4 md:p-6 mb-8">
      <h3 className="text-white font-bold text-lg md:text-xl mb-4 md:mb-6 text-center">ملخص التقارير</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          value={stats.completed} 
          label="تقارير مكتملة" 
          color="text-green-400" 
        />
        <StatCard 
          value={stats.highScore} 
          label="تقارير عالية الدرجة (70%+)" 
          color="text-blue-400" 
        />
        <StatCard 
          value={`${stats.averageScore}%`} 
          label="متوسط الدرجات" 
          color="text-orange-400" 
        />
      </div>
      
      <AdditionalStats stats={stats} />
    </div>
  );
};

const StatCard = ({ value, label, color }) => (
  <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
    <div className={`text-2xl md:text-3xl font-bold ${color} mb-2`}>
      {value}
    </div>
    <p className="text-gray-400 text-sm">{label}</p>
  </div>
);

const AdditionalStats = ({ stats }) => (
  <div className="mt-6 pt-6 border-t border-gray-800">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatList 
        title="أنواع التقارير" 
        items={stats.reportTypes} 
        color="bg-gray-800 text-gray-300" 
      />
      <StatList 
        title="اللجان المشاركة" 
        items={stats.committees} 
        color="bg-blue-900/30 text-blue-300"
        maxItems={3}
      />
    </div>
  </div>
);

const StatList = ({ title, items, color, maxItems = 5 }) => (
  <div className="p-4 bg-gray-900/30 rounded-lg">
    <p className="text-gray-400 text-sm mb-2">{title}:</p>
    <div className="flex flex-wrap gap-2">
      {items.slice(0, maxItems).map((item, index) => (
        <span key={index} className={`px-3 py-1 rounded-full text-xs ${color}`}>
          {item}
        </span>
      ))}
      {items.length > maxItems && (
        <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
          +{items.length - maxItems} أخرى
        </span>
      )}
    </div>
  </div>
);

export default SummaryStats;