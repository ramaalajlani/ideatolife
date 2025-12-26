import React from 'react';
import ReportHeader from './ReportHeader';
import IdeaInfo from './IdeaInfo';
import CommitteeScore from './CommitteeScore';
import ReportDescription from './ReportDescription';
import ReportLists from './ReportLists';
import ReportFooter from './ReportFooter';

const ReportCard = ({ report }) => {
  // تأكد من وجود البيانات
  if (!report) return null;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-12 translate-x-12 opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-blue-200 rounded-full translate-y-16 -translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
      
      <ReportHeader 
        type={report.type || 'تقرير'} 
        id={report.id} 
        status={report.status || 'completed'} 
      />
      
      <div className="p-5 md:p-6 relative z-10">
        <IdeaInfo idea={report.idea || {}} />
        <CommitteeScore 
          committee={report.committee || 'غير محدد'} 
          score={report.score || 0} 
        />
        <ReportDescription description={report.description || 'لا يوجد وصف'} />
        <ReportLists 
          strengths={report.strengths || []}
          weaknesses={report.weaknesses || []}
          recommendations={report.recommendations || []}
        />
        <ReportFooter createdAt={report.createdAt || 'غير محدد'} />
      </div>
    </div>
  );
};

export default ReportCard;