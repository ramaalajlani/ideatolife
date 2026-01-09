import React from 'react';
import ReportCard from './ReportCard/ReportCard';

/**
 * ReportsGrid Component
 * ---------------------
 * يعرض قائمة من التقارير في شبكة (Grid) مرنة.
 *
 * Props:
 * - reports: مصفوفة التقارير التي سيتم عرضها.
 * - ideaInfo: معلومات الفكرة المرتبطة بهذه التقارير.
 */
const ReportsGrid = ({ reports, ideaInfo }) => {
  // إذا لم توجد تقارير، لا تعرض شيئًا
  if (!reports || reports.length === 0) return null;

  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-full">
        {reports.map((report) => {
          // استخدام مفتاح فريد لكل تقرير لتجنب تحذيرات React
          const key = report.report_id || report.id;

          return (
            <div key={key} className="h-auto">
              {/* تمرير ideaInfo بشكل آمن */}
              <ReportCard report={report} ideaInfo={ideaInfo || {}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsGrid;
