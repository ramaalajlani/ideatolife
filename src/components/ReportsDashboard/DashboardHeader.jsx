import React from 'react';
import Lottie from "lottie-react";
import reportingAnimation from "./reporting.json";

const DashboardHeader = ({ ideaInfo, ideaId, totalReports, reports }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-6 bg-[#FFD586] p-4 md:p-6 rounded-xl">
      <div className="text-center lg:text-left flex-1 w-full">
        <div className="mb-4">
          <IdeaTitleSection ideaInfo={ideaInfo} ideaId={ideaId} />
        </div>
      </div>
      <AnimationSection />
    </div>
  );
};

const IdeaTitleSection = ({ ideaInfo, ideaId }) => (
  <div className="text-center lg:text-left">
    <h1 className="text-black text-xl md:text-2xl font-bold">
      {ideaInfo?.title || `Idea #${ideaId}`}
    </h1>
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-2">
      <IdeaStatusBadge status={ideaInfo?.status} />
    </div>
  </div>
);

const IdeaStatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved': return { text: 'Approved', color: 'bg-black/10 text-black border-black/20' };
      case 'rejected': return { text: 'Rejected', color: 'bg-black/10 text-black border-black/20' };
      case 'pending': return { text: 'Under Review', color: 'bg-black/10 text-black border-black/20' };
      default: return null;
    }
  };
  
  const statusInfo = getStatusInfo(status);
  
  if (!statusInfo) return null;
  
  const { text, color } = statusInfo;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {text}
    </span>
  );
};

const AnimationSection = () => (
  <div className="flex-1 flex justify-center lg:justify-end">
    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
      <Lottie 
        animationData={reportingAnimation} 
        loop 
        autoplay 
        className="drop-shadow-lg"
      />
    </div>
  </div>
);

export default DashboardHeader;