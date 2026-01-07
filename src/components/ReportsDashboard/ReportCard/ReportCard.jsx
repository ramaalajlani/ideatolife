import React from 'react';
import ReportHeader from './ReportHeader';
import IdeaInfo from './IdeaInfo';
import CommitteeScore from './CommitteeScore';
import ReportDescription from './ReportDescription';
import ReportLists from './ReportLists';
import ReportFooter from './ReportFooter';

const ReportCard = ({ report, ideaInfo }) => {
  // التأكد من وجود البيانات
  if (!report) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No report data</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF2C6] rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      {/* تصميم ReportHeader الجديد - مستطيل كامل فوق الكارد */}
      <ReportHeader 
        type={report.report_type} 
        id={report.report_id} 
        status={report.status}
        meetingDate={report.meeting?.meeting_date}
      />
      
      <div className="p-5 md:p-6 relative z-10 pt-16"> {/* إضافة pt-16 لتعويض ارتفاع الهيدر */}
        {/* تمرير ideaInfo مع قيمة افتراضية إذا كانت null */}
        <IdeaInfo idea={ideaInfo || {}} />
        
        <CommitteeScore 
          score={report.evaluation_score} 
          meeting={report.meeting}
        />
        
        <ReportDescription description={report.description} />
        
        {/* ReportLists الجديد - بدون أيقونات وتحت بعض */}
        <div className="mt-6">
          <ReportLists 
            strengths={report.strengths}
            weaknesses={report.weaknesses}
            recommendations={report.recommendations}
          />
        </div>
        
        <ReportFooter createdAt={report.created_at} />
      </div>
    </div>
  );
};

export default ReportCard;