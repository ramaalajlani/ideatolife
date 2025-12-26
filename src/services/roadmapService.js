// src/services/roadmapService.js
import api from '../api/api';

const roadmapService = {
  // جلب خارطة الطريق لفكرة
  getIdeaRoadmap: async (ideaId) => {
    try {
      const response = await api.get(`/ideas/${ideaId}/roadmap`);
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب خارطة الطريق:', error);
      throw error;
    }
  },

  // تحويل بيانات الباكند إلى تنسيق الجدول الزمني
  transformRoadmapData: (roadmapData) => {
    // مراحل الـ roadmap كما في الكود PHP
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

    const currentStage = roadmapData.roadmap?.current_stage || ROADMAP_STAGES[0];
    const currentStageIndex = ROADMAP_STAGES.indexOf(currentStage);
    const progressPercentage = roadmapData.roadmap?.progress_percentage || 0;

    // وصف كل مرحلة
    const stageDescriptions = {
      "تقديم الفكرة": "مرحلة تقديم الفكرة وتسجيلها في النظام",
      "التقييم الأولي": "تقييم أولي للفكرة من قبل اللجنة المختصة",
      "التخطيط المنهجي": "وضع خطة منهجية مفصلة للتنفيذ",
      "التقييم المتقدم قبل التمويل": "تقييم متعمق للفكرة قبل منح التمويل",
      "التمويل": "حصول الفكرة على التمويل اللازم للتنفيذ",
      "التنفيذ والتطوير": "مرحلة التنفيذ الفعلي وتطوير المشروع",
      "الإطلاق": "إطلاق المشروع للجمهور المستهدف",
      "المتابعة بعد الإطلاق": "متابعة أداء المشروع بعد الإطلاق",
      "استقرار المشروع وانفصاله عن المنصة": "وصول المشروع للاستقرار والاستقلالية"
    };

    // ألوان المراحل
    const STEP_COLORS = [
      { main: '#EF4444', light: '#FECACA', dark: '#DC2626' },
      { main: '#3B82F6', light: '#DBEAFE', dark: '#2563EB' },
      { main: '#10B981', light: '#D1FAE5', dark: '#059669' },
      { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
      { main: '#8B5CF6', light: '#EDE9FE', dark: '#7C3AED' },
      { main: '#EC4899', light: '#FCE7F3', dark: '#DB2777' },
      { main: '#06B6D4', light: '#CFFAFE', dark: '#0891B2' },
      { main: '#84CC16', light: '#ECFCCB', dark: '#65A30D' },
      { main: '#F97316', light: '#FFEDD5', dark: '#EA580C' },
    ];

    // إنشاء مراحل الجدول الزمني
    return ROADMAP_STAGES.map((stage, idx) => {
      // تحديد حالة المرحلة
      let status = 'pending';
      let progress = 0;
      
      if (idx < currentStageIndex) {
        status = 'completed';
        progress = 100;
      } else if (idx === currentStageIndex) {
        status = 'current';
        progress = progressPercentage;
      }

      const colors = STEP_COLORS[idx % STEP_COLORS.length];

      return {
        id: idx + 1,
        stage_name: stage,
        status: status,
        progress: progress,
        description: stageDescriptions[stage] || stage,
        colors: colors,
        isCurrent: status === 'current',
        isCompleted: status === 'completed',
        link: {
          url: `/ideas/${roadmapData.idea_id}/stage/${idx + 1}`,
          label: 'عرض تفاصيل المرحلة'
        },
        category: {
          tag: stage,
          color: colors.main,
          bgColor: colors.light
        }
      };
    });
  }
};

export default roadmapService;