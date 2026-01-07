import api from './api';

const roadmapService = {
  // جلب خارطة الطريق لفكرة
  getIdeaRoadmap: async (ideaId) => {
    try {
      const response = await api.get(`/ideas/${ideaId}/roadmap`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      throw error;
    }
  },

  // جلب مراحل المنصة من الباك إند
  getPlatformStages: async () => {
    try {
      const response = await api.get('/platform/roadmap-stages');
      return response.data.platform_roadmap_stages;
    } catch (error) {
      console.error('Error fetching platform stages:', error);
      // استخدام بيانات افتراضية (نفس الباك إند بالضبط)
      return this.getDefaultStages();
    }
  },

  // البيانات الافتراضية (نفس الباك إند تماماً)
  getDefaultStages() {
    return [
      {
        name: "Idea Submission",
        message_for_owner: "You need to submit your idea with all required details, wait for committee evaluation."
      },
      {
        name: "Initial Evaluation",
        message_for_owner: "The committee will evaluate your idea and provide initial feedback. You don't need to do anything at this stage except follow up."
      },
      {
        name: "Systematic Planning / Business Plan Preparation",
        message_for_owner: "You need to prepare a systematic business plan and send it to the committee for review."
      },
      {
        name: "Advanced Evaluation Before Funding",
        message_for_owner: "The committee will assess your project's readiness for funding. Respond to any feedback if requested."
      },
      {
        name: "Funding",
        message_for_owner: "You need to submit a funding request specifying needs, the committee or investor will approve or request modifications."
      },
      {
        name: "Execution and Development",
        message_for_owner: "Implement the project and submit reports, the committee will review progress and provide recommendations."
      },
      {
        name: "Launch",
        message_for_owner: "Prepare the project for launch and review readiness, the committee will approve launch and provide recommendations."
      },
      {
        name: "Post-Launch Follow-up",
        message_for_owner: "The committee will submit follow-up reports, you monitor and address any feedback or issues."
      },
      {
        name: "Project Stabilization / Platform Separation",
        message_for_owner: "If necessary, submit a request for project separation from the platform and complete required documents, the committee will approve stabilization and separation."
      }
    ];
  },

  // تحويل البيانات للعرض في التايم لاين
  transformRoadmapData: (roadmapData, platformStages) => {
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

    // البحث عن المرحلة الحالية
    const currentStage = roadmapData.roadmap?.current_stage || "Idea Submission";
    
    // إنشاء مصفوفة المراحل للعرض
    return platformStages.map((stage, idx) => {
      const isCurrent = stage.name === currentStage;
      const stageIndex = platformStages.findIndex(s => s.name === currentStage);
      const isCompleted = idx < (stageIndex !== -1 ? stageIndex : 0);
      
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

      return {
        id: idx + 1,
        stage_name: stage.name, // الإنجليزية مباشرة
        status: status,
        progress: progress,
        description: stage.message_for_owner, // الرسالة بالإنجليزية
        colors: colors,
        isCurrent: isCurrent,
        isCompleted: isCompleted,
        message: stage.message_for_owner,
        category: {
          tag: stage.name,
          color: colors.main,
          bgColor: colors.light
        }
      };
    });
  }
};

export default roadmapService;