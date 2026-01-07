// src/components/Timeline/TimelineItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, PlayCircle, MessageSquare, ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';

// تعريف Badges للأدوار في كل مرحلة (حسب الباك إند بالضبط)
const stageRoles = {
  "Idea Submission": { 
    role: "Idea Owner", 
    badgeColor: "bg-blue-100 text-blue-800 border border-blue-300"
  },
  "Initial Evaluation": { 
    role: "Committee", 
    badgeColor: "bg-purple-100 text-purple-800 border border-purple-300"
  },
  "Systematic Planning / Business Plan Preparation": { 
    role: "Idea Owner", 
    badgeColor: "bg-green-100 text-green-800 border border-green-300"
  },
  "Advanced Evaluation Before Funding": { 
    role: "Committee", 
    badgeColor: "bg-purple-100 text-purple-800 border border-purple-300"
  },
  "Funding": { 
    role: "Idea Owner (Funding Request) + Committee / Investor", 
    badgeColor: "bg-yellow-100 text-yellow-800 border border-yellow-300"
  },
  "Execution and Development": { 
    role: "Idea Owner (Implementation) + Committee (Stage Evaluation)", 
    badgeColor: "bg-indigo-100 text-indigo-800 border border-indigo-300"
  },
  "Launch": { 
    role: "Idea Owner + Committee", 
    badgeColor: "bg-pink-100 text-pink-800 border border-pink-300"
  },
  "Post-Launch Follow-up": { 
    role: "Idea Owner + Committee", 
    badgeColor: "bg-purple-100 text-purple-800 border border-purple-300"
  },
  "Project Stabilization / Platform Separation": { 
    role: "Idea Owner (Separation Request) + Committee (Approval of Stabilization)", 
    badgeColor: "bg-teal-100 text-teal-800 border border-teal-300"
  }
};

const TimelineItem = ({ data, index, roadmapInfo, ideaId, allStages }) => {
  const navigate = useNavigate();
  const {
    stage_name,
    colors,
    isCurrent,
    isCompleted,
    link,
    animation,
    message
  } = data;

  // الحصول على دور المرحلة
  const stageRole = stageRoles[stage_name] || { role: "Unknown", badgeColor: "bg-gray-100 text-gray-800" };

  // تحديد إذا كانت هذه المرحلة هي المرحلة التالية مباشرة للمرحلة الحالية
  const currentStageIndex = allStages?.findIndex(stage => stage.isCurrent);
  const isNextStage = currentStageIndex !== -1 && index === currentStageIndex + 1;

  const handleClick = () => {
    // يمكن النقر على: المرحلة المكتملة، الحالية، أو المرحلة التالية فقط
    if (!isCompleted && !isCurrent && !isNextStage) return;
    
    if (link?.url && link.url !== '#') {
      navigate(link.url);
    } else if (ideaId) {
      navigate(`/ideas/${ideaId}/roadmap?stage=${encodeURIComponent(stage_name)}`);
    }
  };

  // Determine stage status
  const getStatus = () => {
    if (isCompleted) {
      return {
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        text: 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        badge: '✓ Completed'
      };
    }
    if (isCurrent) {
      return {
        icon: <PlayCircle className="w-8 h-8 text-yellow-600 animate-pulse" />,
        text: 'In Progress',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        badge: 'Active'
      };
    }
    if (isNextStage) {
      return {
        icon: <ArrowRight className="w-8 h-8 text-blue-600 animate-pulse" />,
        text: 'Next Step',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        badge: 'Next Step'
      };
    }
    return {
      icon: <Lock className="w-8 h-8 text-gray-400" />,
      text: 'Locked',
      color: 'text-gray-400',
      bgColor: 'bg-gray-100',
      badge: ' Locked'
    };
  };

  const statusInfo = getStatus();

  return (
    <div className="group relative my-4 flex w-1/2 justify-end pr-16 odd:justify-start odd:self-end odd:pl-16 odd:pr-0">
      <div 
        className="absolute top-1/2 w-16 h-0.5 transform -translate-y-1/2"
        style={{ 
          backgroundColor: colors.main,
          right: index % 2 === 0 ? '-1rem' : 'auto',
          left: index % 2 !== 0 ? '-1rem' : 'auto'
        }}
      ></div>
      
      {/* Main Container */}
      <div 
        className={`relative w-[380px] max-w-[95%] transform transition-all duration-500 rounded-xl shadow-lg ${
          !isCompleted && !isCurrent && !isNextStage ? 'opacity-60 cursor-not-allowed' : 
          isCurrent ? 'hover:scale-105 hover:shadow-2xl cursor-pointer ring-4 ring-yellow-400 ring-opacity-50' : 
          isCompleted ? 'hover:scale-105 hover:shadow-2xl cursor-pointer ring-2 ring-green-400' : 
          isNextStage ? 'hover:scale-105 hover:shadow-2xl cursor-pointer ring-2 ring-blue-400 ring-opacity-50' : ''
        }`}
        onClick={handleClick}
        style={{
          background: `linear-gradient(145deg, ${colors.light} 0%, ${colors.main} 100%)`,
          border: `3px solid ${colors.dark}`,
        }}
      >
        {/* Role Badge - Fixed position outside container */}
        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold shadow-md z-40 ${stageRole.badgeColor}`}>
          {stageRole.role}
        </div>

        {/* Decorative Background Layer */}
        <div 
          className="absolute inset-0 rounded-xl opacity-30 blur-sm"
          style={{
            background: `linear-gradient(145deg, ${colors.dark} 0%, transparent 50%)`,
            transform: 'translateY(8px) scale(0.95)',
          }}
        ></div>

        {/* Bottom Shadow Layer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-4 rounded-b-xl z-0"
          style={{
            backgroundColor: colors.dark,
            transform: 'translateY(4px)',
            boxShadow: `0 4px 8px ${colors.dark}40`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-6 rounded-xl bg-white/95 backdrop-blur-sm m-2">
          
          {/* Lock Layer for Locked Stages (غير التالية) */}
          {!isCompleted && !isCurrent && !isNextStage && (
            <div className="absolute inset-0 rounded-xl bg-gray-800/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <Lock className="w-16 h-16 text-white mb-4" />
              <span className="text-white text-xl font-bold">Locked</span>
              <span className="text-white/80 text-sm mt-2">Will unlock after completing previous stages</span>
            </div>
          )}

          {/* Next Stage Preview Overlay */}
          {isNextStage && !isCurrent && !isCompleted && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-900/20 to-blue-900/10 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="text-center p-4 bg-white/90 rounded-lg shadow-lg">
                <ArrowRight className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <span className="text-blue-700 font-bold text-sm">Preview Next Step</span>
              </div>
            </div>
          )}

          {/* Large Completion Checkmark for Completed Stages */}
          {isCompleted && (
            <div className="absolute -top-6 -right-6 z-30">
              <div className="bg-green-500 rounded-full p-3 shadow-2xl animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          )}

          {/* Next Stage Indicator */}
          {isNextStage && !isCurrent && !isCompleted && (
            <div className="absolute -top-6 -right-6 z-30">
              <div className="bg-blue-500 rounded-full p-3 shadow-2xl animate-pulse">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          )}

          {/* Animation Container */}
          <div className={`h-48 mb-4 rounded-lg overflow-hidden border-2 border-white shadow-lg ${
            !isCompleted && !isCurrent && !isNextStage ? 'grayscale' : ''
          }`}>
            <Lottie
              animationData={animation}
              loop={isCurrent || isCompleted || isNextStage}
              autoplay={true}
              className="h-full w-full"
            />
            
            {/* Lock Overlay on Animation - فقط للمراحل المقفلة (غير التالية) */}
            {!isCompleted && !isCurrent && !isNextStage && (
              <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                <Lock className="w-12 h-12 text-white/90" />
              </div>
            )}
          </div>

          {/* Stage Name in Black */}
          <div 
            className="relative w-full p-3 text-center text-lg font-bold uppercase tracking-wider rounded-lg shadow-md mb-3"
            style={{ 
              backgroundColor: colors.main, 
              color: 'black',
              textShadow: '1px 1px 2px rgba(0,0,0,0.15)'
            }}
          >
            {stage_name}
            
            {/* Status Badge */}
            <span className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.badge}
            </span>
          </div>

          {/* Current Stage Guidance - تظهر فقط للمرحلة الحالية */}
          {isCurrent && message && (
            <div className="mb-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">Current Stage Guidance</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Stage Preview - تظهر للمرحلة التالية */}
          {isNextStage && !isCurrent && !isCompleted && message && (
            <div className="mb-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">Next Step Preview</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center justify-between text-sm">
            <div className={`px-3 py-1 rounded-full font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.text}
            </div>
            
            {/* Action Button - تظهر فقط للمراحل المكتملة، الحالية، والتالية */}
            {(isCurrent || isCompleted || isNextStage) && 
             link?.url && link.url !== '#' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(link.url);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                  isCurrent 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : isCompleted
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : isNextStage
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : ''
                }`}
              >
                {link.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;