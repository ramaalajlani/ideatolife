// src/components/Timeline/Timeline.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TimelineItem from "./TimelineItem";
import roadmapService from "../../services/roadmapService";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import { 
  ArrowLeft, 
  RefreshCw, 
  FileText, 
  ClipboardCheck, 
  DollarSign, 
  Rocket, 
  TrendingUp, 
  Target, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";

// استيراد الأنيميشنات
import ideaAnimation from '../../assets/animations/Worker have an Idea.json';
import evaluationAnimation from '../../assets/animations/Discussion.json';
import planningAnimation from '../../assets/animations/Planning Schedule (1).json';
import fundingAnimation from '../../assets/animations/funding ideas.json';
import webDev1Animation from '../../assets/animations/Web Development (1).json';
import webDevAnimation from '../../assets/animations/web development.json';
import lunchApp from '../../assets/animations/Forked Project (1).json';
import followUP from '../../assets/animations/Forked Project (1).json';

// تعريف الأنيميشنات لكل مرحلة (بالإنجليزية)
const timelineAnimations = {
  "Idea Submission": ideaAnimation,
  "Initial Evaluation": evaluationAnimation,
  "Systematic Planning / Business Plan Preparation": planningAnimation,
  "Advanced Evaluation Before Funding": evaluationAnimation,
  "Funding": fundingAnimation,
  "Execution and Development": webDevAnimation,
  "Launch": webDev1Animation,
  "Post-Launch Follow-up": followUP,
  "Project Stabilization / Platform Separation": lunchApp
};

// تعريف الأيقونات لكل مرحلة
const stageIcons = {
  "Idea Submission": <FileText className="w-6 h-6" />,
  "Initial Evaluation": <ClipboardCheck className="w-6 h-6" />,
  "Systematic Planning / Business Plan Preparation": <FileText className="w-6 h-6" />,
  "Advanced Evaluation Before Funding": <Target className="w-6 h-6" />,
  "Funding": <DollarSign className="w-6 h-6" />,
  "Execution and Development": <Rocket className="w-6 h-6" />,
  "Launch": <TrendingUp className="w-6 h-6" />,
  "Post-Launch Follow-up": <TrendingUp className="w-6 h-6" />,
  "Project Stabilization / Platform Separation": <CheckCircle className="w-6 h-6" />
};

// ألوان المراحل
const STEP_COLORS = [
  { main: '#FFD6BA', light: '#FFE8D6', dark: '#E0B89B' },
  { main: '#FFF9BD', light: '#FFFCE6', dark: '#E6DF9F' },
  { main: '#A3DC9A', light: '#D4F1C5', dark: '#8CC084' },
  { main: '#FFD6BA', light: '#FFE8D6', dark: '#E0B89B' },
  { main: '#FFF9BD', light: '#FFFCE6', dark: '#E6DF9F' },
  { main: '#A3DC9A', light: '#D4F1C5', dark: '#8CC084' },
  { main: '#FFD6BA', light: '#FFE8D6', dark: '#E0B89B' },
  { main: '#FFF9BD', light: '#FFFCE6', dark: '#E6DF9F' },
  { main: '#A3DC9A', light: '#D4F1C5', dark: '#8CC084' },
];

const Timeline = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapInfo, setRoadmapInfo] = useState(null);
  const [platformStages, setPlatformStages] = useState([]);

  useEffect(() => {
    if (ideaId) {
      fetchRoadmapData();
    } else {
      fetchPlatformStagesOnly();
    }
  }, [ideaId]);

  const fetchPlatformStagesOnly = async () => {
    try {
      setLoading(true);
      const stages = await roadmapService.getPlatformStages();
      setPlatformStages(stages);
      
      // إنشاء بيانات للعرض العام (بدون فكرة محددة)
      const fallbackData = createFallbackDataFromStages(stages);
      setTimelineData(fallbackData);
    } catch (err) {
      console.error('Error fetching platform stages:', err);
      setError('Error loading platform stages');
      // استخدام بيانات افتراضية
      const defaultStages = roadmapService.getDefaultStages();
      const fallbackData = createFallbackDataFromStages(defaultStages);
      setTimelineData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب مراحل المنصة أولاً
      const stages = await roadmapService.getPlatformStages();
      setPlatformStages(stages);

      // جلب خارطة الطريق للفكرة
      const roadmapData = await roadmapService.getIdeaRoadmap(ideaId);
      setRoadmapInfo(roadmapData);

      // تحويل البيانات للعرض
      const transformedData = transformRoadmapDataWithStages(roadmapData, stages);
      setTimelineData(transformedData);
      
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError(err.response?.data?.message || 'Error loading roadmap');
      
      // استخدام بيانات تجريبية من مراحل المنصة
      const stages = platformStages.length > 0 ? platformStages : await roadmapService.getDefaultStages();
      const fallbackData = createFallbackDataFromStages(stages);
      setTimelineData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // وظيفة لتحويل البيانات مع المراحل
  const transformRoadmapDataWithStages = (roadmapData, stages) => {
    if (!stages || stages.length === 0) {
      stages = roadmapService.getDefaultStages();
    }

    // البحث عن المرحلة الحالية
    const currentStage = roadmapData.roadmap?.current_stage || "Idea Submission";
    const currentStageIndex = stages.findIndex(stage => stage.name === currentStage);
    
    // إنشاء مصفوفة المراحل للعرض
    return stages.map((stage, idx) => {
      const isCurrent = stage.name === currentStage;
      const isCompleted = idx < (currentStageIndex !== -1 ? currentStageIndex : 0);
      
      // تحديد حالة المرحلة
      let status = 'pending';
      let progress = 0;
      
      if (isCompleted) {
        status = 'completed';
        progress = 100;
      } else if (isCurrent) {
        status = 'current';
        progress = roadmapData.roadmap?.progress_percentage || 0;
      }

      const colors = STEP_COLORS[idx];
      const link = getStageLink(stage.name, ideaId, idx + 1);

      return {
        id: idx + 1,
        stage_name: stage.name, // الإنجليزية
        status: status,
        progress: progress,
        description: stage.message_for_owner, // الرسالة بالإنجليزية
        colors: colors,
        isCurrent: isCurrent,
        isCompleted: isCompleted,
        message: stage.message_for_owner,
        link: link,
        animation: timelineAnimations[stage.name] || timelineAnimations["Idea Submission"],
        icon: stageIcons[stage.name] || <FileText className="w-6 h-6" />,
        category: {
          tag: stage.name,
          color: colors.main,
          bgColor: colors.light
        }
      };
    });
  };

  const createFallbackDataFromStages = (stages) => {
    if (!stages || stages.length === 0) {
      stages = roadmapService.getDefaultStages();
    }

    return stages.map((stage, idx) => {
      const colors = STEP_COLORS[idx];
      const link = getStageLink(stage.name, ideaId, idx + 1);

      return {
        id: idx + 1,
        stage_name: stage.name,
        status: idx === 0 ? 'current' : 'pending',
        progress: idx === 0 ? 50 : 0,
        description: stage.message_for_owner,
        colors: colors,
        isCurrent: idx === 0,
        isCompleted: false,
        message: stage.message_for_owner,
        link: link,
        animation: timelineAnimations[stage.name] || timelineAnimations["Idea Submission"],
        icon: stageIcons[stage.name] || <FileText className="w-6 h-6" />,
        category: {
          tag: stage.name,
          color: colors.main,
          bgColor: colors.light
        }
      };
    });
  };

  const getStageLink = (stage, ideaId, stageOrder) => {
    if (!ideaId) {
      return { url: '#', label: 'Details', description: 'Stage details' };
    }

  
  const links = {
    "Idea Submission": {
      url: `/ideas/${ideaId}/edit`,
      label: 'Edit Idea',
      description: 'Edit basic idea details'
    },
    "Initial Evaluation": {
      url: `/ideas/${ideaId}/reports?type=initial`,
      label: 'Initial Reports',
      description: 'View initial evaluation reports'
    },
    "Systematic Planning / Business Plan Preparation": {
      url: `/ideas/${ideaId}/welcome`,
      label: 'Business Model',
      description: 'Prepare business model'
    },
    "Advanced Evaluation Before Funding": {
      url: `/ideas/${ideaId}/reports?type=advanced`,
      label: 'Advanced Reports',
      description: 'View advanced evaluation reports'
    },
    "Funding": {
      url: `/ideas/${ideaId}/funding`,
      label: 'Funding Requests',
      description: 'Manage funding requests'
    },
    "Execution and Development": {
      url: `/ideas/${ideaId}/gantt`,
      label: 'Implementation Plan',
      description: 'Detailed Gantt chart for implementation'
    },
    "Launch": {
      url: `/ideas/${ideaId}/launch`,
      label: 'Launch Idea',
      description: 'Launch idea in the market'
    },
    "Post-Launch Follow-up": {
      url: `/ideas/${ideaId}/reports?type=post_launch_followup`,
      label: 'Follow-up Reports',
      description: 'View post-launch follow-up reports'
    },
    "Project Stabilization / Platform Separation": {
      url: `/ideas/${ideaId}/reports?type=launch_evaluation`,
      label: 'Final Report',
      description: 'View final project report'
    }
  };
    return links[stage] || {
      url: `/ideas/${ideaId}/roadmap?stage=${encodeURIComponent(stage)}`,
      label: 'Stage Details',
      description: 'View stage details'
    };
  };

  const handleStageClick = (stage) => {
    console.log('Clicked stage:', stage.stage_name);
    console.log('Link:', stage.link.url);
    
    if (stage.link.url && stage.link.url !== '#') {
      navigate(stage.link.url);
    }
  };

  const handleRefresh = () => {
    if (ideaId) {
      fetchRoadmapData();
    } else {
      fetchPlatformStagesOnly();
    }
  };

  const handleBack = () => {
    if (ideaId) {
      navigate(`/profile`);
    } else {
      navigate(-1);
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner message="Loading roadmap..." />
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage 
            message={error}
            onRetry={handleRefresh}
          />
          <button
            onClick={handleBack}
            className="w-full mt-4 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-[#A3DC9A] hover:bg-[#8CC084] text-gray-800 rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* معلومات الفكرة */}
          <div className="bg-[#FFD586] rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Project Roadmap
                </h1>
                {roadmapInfo ? (
                  <>
                    <p className="text-gray-600 text-lg">{roadmapInfo.title}</p>
                  </>
                ) : (
                  <p className="text-gray-600 text-lg">Platform Roadmap Stages</p>
                )}
              </div>
              
              {roadmapInfo?.roadmap && (
                <div className="bg-gradient-to-r from-[#FFE8D6] to-[#D4F1C5] rounded-xl p-4 border border-[#FFD6BA]">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {roadmapInfo.roadmap.progress_percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Current Progress</div>
                  </div>
                </div>
              )}
            </div>

            {/* معلومات إضافية */}
            {roadmapInfo?.roadmap && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#FFFCE6] p-4 rounded-lg border border-[#FFF9BD]">
                  <div className="text-sm text-gray-500 mb-1">Current Stage</div>
                  <div className="font-semibold text-gray-800">{roadmapInfo.roadmap.current_stage}</div>
                </div>
                
                <div className="bg-[#FFE8D6] p-4 rounded-lg border border-[#FFD6BA]">
                  <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(roadmapInfo.roadmap.last_update).toLocaleDateString('en-US')}
                  </div>
                </div>
                
                <div className="bg-[#D4F1C5] p-4 rounded-lg border border-[#A3DC9A]">
                  <div className="text-sm text-gray-500 mb-1">Next Step</div>
                  <div className="font-semibold text-gray-800">{roadmapInfo.roadmap.next_step || 'None'}</div>
                </div>
              </div>
            )}

            {/* عرض مراحل المنصة إذا لم يكن هناك فكرة محددة */}
            {!roadmapInfo && (
              <div className="mt-6">
                <div className="text-sm text-gray-500 mb-2">Platform Stages:</div>
                <div className="flex flex-wrap gap-2">
                  {timelineData.slice(0, 3).map(stage => (
                    <span key={stage.id} className="px-3 py-1 bg-white rounded-full text-sm border">
                      {stage.stage_name}
                    </span>
                  ))}
                  {timelineData.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      +{timelineData.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

   
        {/* الجدول الزمني */}
        <div className="relative my-16 flex flex-col">
          {/* السلم الرئيسي */}
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 flex flex-col items-center w-32">
            
            {/* الأعمدة الجانبية للسلم */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-xl shadow-2xl border-r-2 border-gray-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-r-xl shadow-2xl border-l-2 border-gray-600"></div>
            
            {/* درجات السلم بين الأعمدة */}
            <div className="absolute inset-0 flex flex-col items-center justify-between py-8">
     
{timelineData.map((item, idx) => {
  const colors = item.colors;
  
  return (
    <div key={item.id} className="relative w-full flex justify-center my-8">
      {/* درجة السلم - لون الطريق الحقيقي */}
      <div 
        className="w-20 h-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
        style={{
          background: `linear-gradient(90deg, #8c8c8c 0%, #b0b0b0 50%, #8c8c8c 100%)`,
          boxShadow: `0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)`
        }}
        onClick={() => handleStageClick(item)}
        title={`${item.stage_name} - ${item.progress}%`}
      >
        {/* شريط التقدم داخل الدرجة */}
        {item.progress > 0 && (
          <div 
            className="h-full rounded-lg bg-white/30 transition-all duration-1000"
            style={{ width: `${item.progress}%` }}
          ></div>
        )}
        
        {/* خطوط الطريق البيضاء */}
        <div 
          className="absolute inset-0 rounded-lg flex items-center justify-center"
          style={{
            background: `repeating-linear-gradient(90deg, transparent, transparent 4px, white 4px, white 8px)`
          }}
        ></div>
      </div>

      {/* رقم الدرجة - تم تكبيره */}
      <div 
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-3 border-white shadow-xl flex items-center justify-center z-30"
        style={{ backgroundColor: colors.main }}
      >
        <span className="text-gray-800 font-bold text-base">
          {idx + 1}
        </span>
      </div>

      {/* مؤشر الحالة */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        {item.isCompleted ? (
          <span className="text-xs text-[#8CC084] font-bold" title="Completed">✓</span>
        ) : item.isCurrent ? (
          <span className="text-xs text-[#E0B89B] font-bold animate-pulse" title="In Progress">●</span>
        ) : null}
      </div>
    </div>
  );
})}
            </div>

            {/* الحواف الجانبية للسلم - لون المعدن */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-gray-600 shadow-lg"></div>
            <div className="absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-gray-600 shadow-lg"></div>
            
            {/* حماية جانبية للطريق */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 opacity-80"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-500 opacity-80"></div>
          </div>
          
          {/* عرض عناصر الجدول الزمني */}
          {timelineData.map((data, idx) => (
            <TimelineItem 
              data={data} 
              key={data.id} 
              index={idx} 
              roadmapInfo={roadmapInfo}
              ideaId={ideaId}
              language="en"
              allStages={timelineData} // تم إضافة هذا السطر
            />
          ))}

          {/* تأثيرات إضافية - ظل الطريق */}
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-32 opacity-5">
            <div className="w-full h-full bg-gradient-to-b from-gray-800 via-gray-600 to-gray-800 rounded-xl"></div>
          </div>
        </div>

        {/* تذييل الصفحة */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Navigate:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold">●</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Current Stage</h4>
                <p className="text-sm text-gray-600 mt-1">The highlighted stage is currently active</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Completed Stages</h4>
                <p className="text-sm text-gray-600 mt-1">Green check marks indicate completed stages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Next Step</h4>
                <p className="text-sm text-gray-600 mt-1">Blue arrow indicates the next stage in your roadmap</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-bold">🔒</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Locked Stages</h4>
                <p className="text-sm text-gray-600 mt-1">Locked stages will unlock after completing previous stages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;