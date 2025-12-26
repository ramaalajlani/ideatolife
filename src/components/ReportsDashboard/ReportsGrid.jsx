import React from 'react';
import ReportCard from './ReportCard/ReportCard';

const ReportsGrid = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-min h-full">
        {reports.map((report) => (
          <div key={report.id} className="h-full">
            <ReportCard report={report} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsGrid;