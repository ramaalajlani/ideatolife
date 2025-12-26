import React from 'react';
import Lottie from "lottie-react";
import reportingAnimation from "./reporting.json";

const DashboardHeader = ({ ideaInfo, ideaId, totalReports, reports }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mb-8 md:mb-12 gap-6 md:gap-8">
      <div className="text-center lg:text-left flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
          <IdeaIcon />
          <IdeaTitleSection ideaInfo={ideaInfo} ideaId={ideaId} reports={reports} />
        </div>
        <StatsCard totalReports={totalReports} ideaTitle={ideaInfo?.title} ideaId={ideaId} />
      </div>
      <AnimationSection />
    </div>
  );
};

const IdeaIcon = () => (
  <div className="relative group">
    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-orange-800/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
    <div className="relative bg-gradient-to-br from-orange-500 to-orange-800 p-3 md:p-4 rounded-xl shadow-2xl">
      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>
  </div>
);

const IdeaTitleSection = ({ ideaInfo, ideaId, reports }) => (
  <div className="text-center sm:text-left">
    <h1 className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-2xl md:text-3xl lg:text-4xl font-bold">
      {ideaInfo?.title || `الفكرة #${ideaId}`}
    </h1>
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3 mt-2">
      <IdeaStatusBadge status={ideaInfo?.status} />
      <span className="text-gray-500 text-sm">المعرف: {ideaId}</span>
      {reports.length > 0 && (
        <span className="text-gray-500 text-sm">• آخر تحديث: {reports[0].createdAt}</span>
      )}
    </div>
  </div>
);

const IdeaStatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved': return { text: 'مقبولة', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case 'rejected': return { text: 'مرفوضة', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'pending': return { text: 'قيد المراجعة', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      default: return { text: 'غير محدد', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };
  
  const { text, color } = getStatusInfo(status);
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {text}
    </span>
  );
};

const StatsCard = ({ totalReports, ideaTitle, ideaId }) => (
  <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-800 p-4 md:p-6 w-full">
    <div className="relative">
      <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl md:text-3xl font-bold w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg">
        {totalReports}
      </div>
    </div>
    <div className="text-center sm:text-right">
      <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
        إجمالي التقارير
      </p>
      <p className="text-white font-bold text-lg md:text-xl mb-2">
        {ideaTitle ? `"${ideaTitle}"` : `الفكرة #${ideaId}`}
      </p>
      <p className="text-gray-500 text-xs md:text-sm">
        جميع تقارير التقييم في مكان واحد
      </p>
    </div>
  </div>
);

const AnimationSection = () => (
  <div className="flex-1 flex justify-center lg:justify-end">
    <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
      <Lottie 
        animationData={reportingAnimation} 
        loop 
        autoplay 
        className="drop-shadow-2xl"
      />
    </div>
  </div>
);

export default DashboardHeader;