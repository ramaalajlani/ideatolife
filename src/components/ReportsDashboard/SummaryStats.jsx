import React from 'react';

const SummaryStats = ({ reports }) => {
  const stats = {
    completed: reports.filter(r => r.status === 'completed').length,
    highScore: reports.filter(r => r.score >= 70).length,
    averageScore: reports.length > 0 
      ? (reports.reduce((sum, r) => sum + r.score, 0) / reports.length).toFixed(1)
      : 0,
    reportTypes: [...new Set(reports.map(r => r.type))],
  };

  return (
    <div className="bg-[#FDFFB8] border border-amber-200 rounded-2xl p-4 md:p-6 mb-8 shadow-sm">
      <h3 className="text-gray-900 font-bold text-lg md:text-xl mb-4 md:mb-6 text-center">Report Summary</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          value={stats.completed} 
          label="Completed Reports" 
          color="text-green-600" 
        />
        <StatCard 
          value={stats.highScore} 
          label="High Score Reports (70%+)" 
          color="text-blue-600" 
        />
        <StatCard 
          value={`${stats.averageScore}%`} 
          label="Average Score" 
          color="text-amber-600" 
        />
      </div>
      
      <AdditionalStats stats={stats} />
    </div>
  );
};

const StatCard = ({ value, label, color }) => (
  <div className="text-center p-4 bg-white/80 rounded-xl border border-amber-100 shadow-sm">
    <div className={`text-2xl md:text-3xl font-bold ${color} mb-2`}>
      {value}
    </div>
    <p className="text-gray-700 text-sm font-medium">{label}</p>
  </div>
);

const AdditionalStats = ({ stats }) => (
  <div className="mt-6 pt-6 border-t border-amber-200">
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <StatList 
        title="Report Types" 
        items={stats.reportTypes} 
        color="bg-amber-100 text-amber-800 border border-amber-200" 
      />
    </div>
  </div>
);

const StatList = ({ title, items, color, maxItems = 5 }) => (
  <div className="p-4 bg-white/80 rounded-lg border border-amber-100 shadow-sm">
    <p className="text-gray-700 text-sm font-medium mb-2">{title}:</p>
    <div className="flex flex-wrap gap-2">
      {items.slice(0, maxItems).map((item, index) => (
        <span key={index} className={`px-3 py-1.5 rounded-full text-sm font-medium ${color}`}>
          {item}
        </span>
      ))}
      {items.length > maxItems && (
        <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
          +{items.length - maxItems} more
        </span>
      )}
    </div>
  </div>
);

export default SummaryStats