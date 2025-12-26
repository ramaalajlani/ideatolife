// src/components/Timeline/Timeline.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TimelineItem from "./TimelineItem";
import roadmapService from "../../services/roadmapService";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import { ArrowLeft, RefreshCw, FileText, ClipboardCheck, DollarSign, Rocket, TrendingUp, Target, CheckCircle } from "lucide-react";

// استيراد الأنيميشنات
import ideaAnimation from '../../assets/animations/Worker have an Idea.json';
import evaluationAnimation from '../../assets/animations/Discussion.json';
import planningAnimation from '../../assets/animations/Planning Schedule (1).json';
import fundingAnimation from '../../assets/animations/funding ideas.json';
import webDev1Animation from '../../assets/animations/Web Development (1).json';
import webDevAnimation from '../../assets/animations/web development.json';
import lunchApp from '../../assets/animations/Forked Project (1).json';
import followUP from '../../assets/animations/Forked Project (1).json';

const timelineAnimations = {
  "تقديم الفكرة": ideaAnimation,
  "التقييم الأولي": evaluationAnimation,
  "التخطيط المنهجي": planningAnimation,
  "التقييم المتقدم قبل التمويل": evaluationAnimation,
  "التمويل": fundingAnimation,
  "التنفيذ والتطوير": webDevAnimation,
  "الإطلاق": webDev1Animation,
  "المتابعة بعد الإطلاق": followUP,
  "استقرار المشروع وانفصاله عن المنصة": lunchApp
};

const Timeline = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapInfo, setRoadmapInfo] = useState(null);

  useEffect(() => {
    if (ideaId) {
      fetchRoadmapData();
    } else {

      const fallbackData = createFallbackDataWithLinks(ideaId);
      setTimelineData(fallbackData);
      setLoading(false);
    }
  }, [ideaId]);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      setError(null);

      const roadmapData = await roadmapService.getIdeaRoadmap(ideaId);
      setRoadmapInfo(roadmapData);
  
      const transformedData = transformRoadmapDataWithLinks(roadmapData, ideaId);
      setTimelineData(transformedData);
      
    } catch (err) {
      console.error('خطأ في جلب خارطة الطريق:', err);
      setError(err.response?.data?.message || 'حدث خطأ في تحميل خارطة الطريق');
      
      // استخدام بيانات تجريبية مع الروابط والأنيميشنات
      const fallbackData = createFallbackDataWithLinks(ideaId);
      setTimelineData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // وظيفة لتحويل البيانات وإضافة الروابط والأنيميشنات المناسبة
  const transformRoadmapDataWithLinks = (roadmapData, ideaId) => {
    if (!roadmapData) return [];
    
    const stages = roadmapData.stages || [];
    const ROADMAP_STAGES = [
      "تقديم الفكرة",
      "التقييم الأولي",
      "التخطيط المنهجي",
      "التقييم المتقدم قبل التمويل",
      "التمويل",
      "التنفيذ والتطوير",
      "الإطلاق",
      "المتابعة بعد الإطلاق",
      "استقرار المشروع وانفصاله عن المنصة",
    ];

    return ROADMAP_STAGES.map((stage, idx) => {
      const stageData = stages.find(s => s.stage_name === stage) || {};
      const stageOrder = idx + 1;
      
      // تحديد الروابط حسب المرحلة
      let link = getStageLink(stage, ideaId, stageOrder);
      
      // تحديد الأنيميشن المناسب للمرحلة
      const animation = timelineAnimations[stage] || timelineAnimations["تقديم الفكرة"];
      
      return {
        id: idx + 1,
        stage_name: stage,
        status: stageData.status || 'pending',
        progress: stageData.progress || 0,
        colors: {
          main: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'][idx],
          light: ['#FECACA', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#ECFCCB', '#FFEDD5'][idx],
          dark: ['#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#65A30D', '#EA580C'][idx]
        },
        isCurrent: stageData.is_current || false,
        isCompleted: stageData.is_completed || false,
        description: stageData.description || getStageDescription(stage),
        link: link,
        animation: animation, // إضافة الأنيميشن
        category: {
          tag: stage,
          color: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'][idx],
          bgColor: ['#FECACA', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#ECFCCB', '#FFEDD5'][idx]
        },
        icon: getStageIcon(stage),
        stageData: stageData
      };
    });
  };


  const getStageDescription = (stage) => {
    const descriptions = {
      "تقديم الفكرة": "مرحلة تقديم الفكرة الأولية وتحديد المفهوم الأساسي",
      "التقييم الأولي": "تقييم الجدوى الأولية للفكرة من قبل اللجنة المختصة",
      "التخطيط المنهجي": "إعداد نموذج العمل وخطة التنفيذ التفصيلية",
      "التقييم المتقدم قبل التمويل": "مراجعة شاملة للخطة قبل البدء في التمويل",
      "التمويل": "تقديم طلبات التمويل وجمع المستلزمات المالية",
      "التنفيذ والتطوير": "بدء التنفيذ الفعلي وتطوير المنتج أو الخدمة",
      "الإطلاق": "إطلاق المنتج النهائي في السوق",
      "المتابعة بعد الإطلاق": "متابعة الأداء وجمع الملاحظات بعد الإطلاق",
      "استقرار المشروع وانفصاله عن المنصة": "تحقيق الاستقرار والاستقلالية الكاملة"
    };
    
    return descriptions[stage] || `مرحلة ${stage}`;
  };

  const getStageIcon = (stage) => {
    const icons = {
      "تقديم الفكرة": <FileText className="w-6 h-6" />,
      "التقييم الأولي": <ClipboardCheck className="w-6 h-6" />,
      "التخطيط المنهجي": <FileText className="w-6 h-6" />,
      "التقييم المتقدم قبل التمويل": <Target className="w-6 h-6" />,
      "التمويل": <DollarSign className="w-6 h-6" />,
      "التنفيذ والتطوير": <Rocket className="w-6 h-6" />,
      "الإطلاق": <TrendingUp className="w-6 h-6" />,
      "المتابعة بعد الإطلاق": <TrendingUp className="w-6 h-6" />,
      "استقرار المشروع وانفصاله عن المنصة": <CheckCircle className="w-6 h-6" />
    };
    
    return icons[stage];
  };

  const getStageLink = (stage, ideaId, stageOrder) => {
    if (!ideaId) {
      return { url: '#', label: 'التفاصيل' };
    }

    const links = {
      "تقديم الفكرة": {
        url: `/ideas/${ideaId}/edit`,
        label: 'تعديل الفكرة',
        description: 'تعديل تفاصيل الفكرة الأساسية'
      },
      "التقييم الأولي": {
        url: `/ideas/${ideaId}/reports`,
        label: 'عرض التقارير',
        description: 'عرض تقارير التقييم الأولي'
      },
      "التخطيط المنهجي": {
        url: `/ideas/${ideaId}/business-model`,
        label: 'نموذج العمل',
        description: 'إعداد نموذج العمل التجاري'
      },
      "التقييم المتقدم قبل التمويل": {
        url: `/ideas/${ideaId}/reports`,
        label: 'التقارير المتقدمة',
        description: 'عرض تقارير التقييم المتقدم'
      },
      "التمويل": {
        url: `/ideas/${ideaId}/funding`,
        label: 'طلبات التمويل',
        description: 'إدارة طلبات التمويل'
      },
    "التنفيذ والتطوير": {
      url: `/ideas/${ideaId}/gantt`,  
      label: 'مخطط التنفيذ',
      description: 'مخطط غانت التفصيلي للتنفيذ'
    },
      "الإطلاق": {
        url: `/ideas/${ideaId}/reports`,
        label: 'تقارير الإطلاق',
        description: 'عرض تقارير مرحلة الإطلاق'
      },
      "المتابعة بعد الإطلاق": {
        url: `/ideas/${ideaId}/reports`,
        label: 'تقارير المتابعة',
        description: 'عرض تقارير المتابعة بعد الإطلاق'
      },
      "استقرار المشروع وانفصاله عن المنصة": {
        url: `/ideas/${ideaId}/reports`,
        label: 'التقرير النهائي',
        description: 'عرض التقرير النهائي للمشروع'
      }
    };

    return links[stage] || { 
      url: `/ideas/${ideaId}/roadmap?stage=${encodeURIComponent(stage)}`, 
      label: 'تفاصيل المرحلة',
      description: 'عرض تفاصيل هذه المرحلة'
    };
  };

  const createFallbackDataWithLinks = (ideaId) => {
    const ROADMAP_STAGES = [
      "تقديم الفكرة",
      "التقييم الأولي",
      "التخطيط المنهجي",
      "التقييم المتقدم قبل التمويل",
      "التمويل",
      "التنفيذ والتطوير",
      "الإطلاق",
      "المتابعة بعد الإطلاق",
      "استقرار المشروع وانفصاله عن المنصة",
    ];

    return ROADMAP_STAGES.map((stage, idx) => {
      const link = getStageLink(stage, ideaId, idx + 1);
      const icon = getStageIcon(stage);
      const description = getStageDescription(stage);
      const animation = timelineAnimations[stage] || timelineAnimations["تقديم الفكرة"];
      
      return {
        id: idx + 1,
        stage_name: stage,
        status: idx === 0 ? 'current' : 'pending',
        progress: idx === 0 ? 50 : 0,
        colors: {
          main: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'][idx],
          light: ['#FECACA', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#ECFCCB', '#FFEDD5'][idx],
          dark: ['#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#65A30D', '#EA580C'][idx]
        },
        isCurrent: idx === 0,
        isCompleted: false,
        description: description,
        link: link,
        animation: animation, // إضافة الأنيميشن
        icon: icon,
        category: {
          tag: stage,
          color: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'][idx],
          bgColor: ['#FECACA', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#ECFCCB', '#FFEDD5'][idx]
        }
      };
    });
  };

  const handleStageClick = (stage) => {
    console.log('النقر على المرحلة:', stage.stage_name);
    console.log('الرابط:', stage.link.url);
    
    if (stage.link.url && stage.link.url !== '#') {
      navigate(stage.link.url);
    }
  };

  const handleRefresh = () => {
    fetchRoadmapData();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner message="جاري تحميل خارطة الطريق..." />
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error && timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage 
            message={error} 
            onRetry={handleRefresh}
          />
          <button
            onClick={handleBack}
            className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>back</span>
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span> Refresh</span>
              </button>
            </div>
          </div>

          {/* معلومات الفكرة */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
              MY Roadmap
                </h1>
                {roadmapInfo ? (
                  <>
                    <p className="text-gray-600 text-lg">{roadmapInfo.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">معرف الفكرة:</span>
                      <span className="font-medium">{roadmapInfo.idea_id || ideaId}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-lg">خارطة الطريق العامة</p>
                )}
              </div>
              
              {roadmapInfo?.roadmap && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {roadmapInfo.roadmap.progress_percentage}%
                    </div>
                    <div className="text-sm text-gray-600">التقدم الحالي</div>
                  </div>
                </div>
              )}
            </div>

            {/* معلومات إضافية */}
            {roadmapInfo?.roadmap && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">المرحلة الحالية</div>
                  <div className="font-semibold text-gray-800">{roadmapInfo.roadmap.current_stage}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">آخر تحديث</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(roadmapInfo.roadmap.last_update).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">الخطوة التالية</div>
                  <div className="font-semibold text-gray-800">{roadmapInfo.roadmap.next_step || 'لا توجد'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* شريط التقدم العام */}
        {roadmapInfo?.roadmap && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>بداية الفكرة</span>
              <span className="font-bold">{roadmapInfo.roadmap.progress_percentage}% مكتمل</span>
              <span>اكتمال الفكرة</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${roadmapInfo.roadmap.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        )}



        {/* الجدول الزمني */}
        <div className="relative my-16 flex flex-col">
          {/* السلم الرئيسي */}
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 flex flex-col items-center w-32">
            
            {/* الأعمدة الجانبية للسلم */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-l-xl shadow-2xl border-r-2 border-gray-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-xl shadow-2xl border-l-2 border-gray-600"></div>
            
            {/* درجات السلم بين الأعمدة */}
            <div className="absolute inset-0 flex flex-col items-center justify-between py-8">
              {timelineData.map((item, idx) => {
                const colors = item.colors;
                
                return (
                  <div key={item.id} className="relative w-full flex justify-center my-8">
                    {/* درجة السلم */}
                    <div 
                      className="w-20 h-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, ${colors.dark} 0%, ${colors.main} 50%, ${colors.dark} 100%)`,
                        boxShadow: `0 4px 8px ${colors.dark}80, inset 0 2px 4px ${colors.light}`
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
                      
                      {/* تأثير ثلاثي الأبعاد للدرجة */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-50"
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, ${colors.light}40 50%, transparent 100%)`
                        }}
                      ></div>
                    </div>

                    {/* رقم الدرجة */}
                    <div 
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-30"
                      style={{ backgroundColor: colors.main }}
                    >
                      <span className="text-white font-bold text-xs">
                        {idx + 1}
                      </span>
                    </div>

                    {/* مؤشر الحالة */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      {item.isCompleted ? (
                        <span className="text-xs text-green-600 font-bold" title="مكتمل">✓</span>
                      ) : item.isCurrent ? (
                        <span className="text-xs text-yellow-600 font-bold animate-pulse" title="جاري العمل">●</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* الحواف الجانبية للسلم */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-600 to-yellow-400 shadow-lg"></div>
            <div className="absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-600 to-yellow-400 shadow-lg"></div>
          </div>
          
          {/* عرض عناصر الجدول الزمني */}
          {timelineData.map((data, idx) => (
            <TimelineItem 
              data={data} 
              key={data.id} 
              index={idx} 
              roadmapInfo={roadmapInfo}
              ideaId={ideaId}
            />
          ))}

          {/* تأثيرات إضافية */}
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-32 opacity-10">
            <div className="w-full h-full bg-gradient-to-b from-blue-500 via-green-500 to-red-500 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;