// src/store/slices/roadmapSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roadmapService from "../../services/roadmapService";

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

// تعريف الأيقونات لكل مرحلة
const stageIcons = {
  "Idea Submission": "📝",
  "Initial Evaluation": "📋",
  "Systematic Planning / Business Plan Preparation": "📊",
  "Advanced Evaluation Before Funding": "🎯",
  "Funding": "💰",
  "Execution and Development": "🚀",
  "Launch": "📈",
  "Post-Launch Follow-up": "🔍",
  "Project Stabilization / Platform Separation": "🏆"
};

// دالة مساعدة للحصول على روابط المراحل
const getStageLink = (stage, ideaId) => {
  if (!ideaId) return { url: '#', label: 'Details', description: 'Stage details' };
  
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
      url: `/ideas/${ideaId}/post-launch-followups`, 
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

// جلب roadmap لفكرة محددة
export const fetchIdeaRoadmap = createAsyncThunk(
  "roadmap/fetchIdeaRoadmap",
  async (ideaId, thunkAPI) => {
    try {
      // جلب البيانات من الخدمة
      const roadmapData = await roadmapService.getIdeaRoadmap(ideaId);
      const platformStages = await roadmapService.getPlatformStages();
      
      // تحويل البيانات
      const currentStage = roadmapData.roadmap?.current_stage || "Idea Submission";
      const currentStageIndex = platformStages.findIndex(stage => stage.name === currentStage);
      
      const timelineData = platformStages.map((stage, idx) => {
        const isCurrent = stage.name === currentStage;
        const isCompleted = idx < (currentStageIndex !== -1 ? currentStageIndex : 0);
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
        const link = getStageLink(stage.name, ideaId);

        return {
          id: idx + 1,
          stage_name: stage.name,
          status,
          progress,
          description: stage.message_for_owner,
          colors,
          isCurrent,
          isCompleted,
          message: stage.message_for_owner,
          link,
          icon: stageIcons[stage.name] || "📝",
          category: { tag: stage.name, color: colors.main, bgColor: colors.light }
        };
      });

      return { 
        roadmapInfo: roadmapData,
        platformStages,
        timelineData 
      };
    } catch (err) {
      console.error('Error fetching idea roadmap:', err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || "Error fetching roadmap");
    }
  }
);

// جلب مراحل المنصة بدون فكرة محددة
export const fetchPlatformStages = createAsyncThunk(
  "roadmap/fetchPlatformStages",
  async (_, thunkAPI) => {
    try {
      // جلب البيانات من الخدمة
      const platformStages = await roadmapService.getPlatformStages();
      
      // تحويل البيانات للعرض العام
      const timelineData = platformStages.map((stage, idx) => {
        const colors = STEP_COLORS[idx];
        const link = getStageLink(stage.name, null);
        
        return {
          id: idx + 1,
          stage_name: stage.name,
          status: idx === 0 ? 'current' : 'pending',
          progress: idx === 0 ? 50 : 0,
          description: stage.message_for_owner,
          colors,
          isCurrent: idx === 0,
          isCompleted: false,

          message: stage.message_for_owner,
          link,
          icon: stageIcons[stage.name] || "📝",
          category: { tag: stage.name, color: colors.main, bgColor: colors.light }
        };
      });

      return { 
        timelineData, 
        platformStages 
      };
    } catch (err) {
      console.error('Error fetching platform stages:', err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || "Error fetching platform stages");
    }
  }
);

const initialState = {
  roadmapInfo: null,
  platformStages: [],
  timelineData: [],
  loading: false,
  error: null,
  activeTab: "dashboard",
  autoRefreshEnabled: false,
  lastUpdated: null
};

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setTimelineData: (state, action) => {
      state.timelineData = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    resetRoadmap: (state) => {
      state.roadmapInfo = null;
      state.timelineData = [];
      state.error = null;
      state.lastUpdated = null;
    },
    toggleAutoRefresh: (state) => {
      state.autoRefreshEnabled = !state.autoRefreshEnabled;
    },
    setLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    updateTimelineData: (state, action) => {
      const { stageId, updates } = action.payload;
      state.timelineData = state.timelineData.map(item => 
        item.id === stageId ? { ...item, ...updates } : item
      );
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchIdeaRoadmap - pending
      .addCase(fetchIdeaRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      // fetchIdeaRoadmap - fulfilled
      .addCase(fetchIdeaRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmapInfo = action.payload.roadmapInfo;
        state.platformStages = action.payload.platformStages;
        state.timelineData = action.payload.timelineData;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      
      // fetchIdeaRoadmap - rejected
      .addCase(fetchIdeaRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastUpdated = new Date().toISOString();
        
        // استخدام البيانات الافتراضية في حالة الخطأ
        const defaultStages = roadmapService.getDefaultStages();
        state.platformStages = defaultStages;
        state.timelineData = defaultStages.map((stage, idx) => ({
          id: idx + 1,
          stage_name: stage.name,
          status: idx === 0 ? 'current' : 'pending',
          progress: idx === 0 ? 50 : 0,
          description: stage.message_for_owner,
          colors: STEP_COLORS[idx],
          isCurrent: idx === 0,
          isCompleted: false,
          message: stage.message_for_owner,
          link: getStageLink(stage.name, null),
          icon: stageIcons[stage.name] || "📝",
          category: { 
            tag: stage.name, 
            color: STEP_COLORS[idx].main, 
            bgColor: STEP_COLORS[idx].light 
          }
        }));
      })

      // fetchPlatformStages - pending
      .addCase(fetchPlatformStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      // fetchPlatformStages - fulfilled
      .addCase(fetchPlatformStages.fulfilled, (state, action) => {
        state.loading = false;
        state.platformStages = action.payload.platformStages;
        state.timelineData = action.payload.timelineData;
        state.roadmapInfo = null;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      
      // fetchPlatformStages - rejected
      .addCase(fetchPlatformStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastUpdated = new Date().toISOString();
        
        // استخدام البيانات الافتراضية في حالة الخطأ
        const defaultStages = roadmapService.getDefaultStages();
        state.platformStages = defaultStages;
        state.timelineData = defaultStages.map((stage, idx) => ({
          id: idx + 1,
          stage_name: stage.name,
          status: idx === 0 ? 'current' : 'pending',
          progress: idx === 0 ? 50 : 0,
          description: stage.message_for_owner,
          colors: STEP_COLORS[idx],
          isCurrent: idx === 0,
          isCompleted: false,
          message: stage.message_for_owner,
          link: getStageLink(stage.name, null),
          icon: stageIcons[stage.name] || "📝",
          category: { 
            tag: stage.name, 
            color: STEP_COLORS[idx].main, 
            bgColor: STEP_COLORS[idx].light 
          }
        }));
      });
  }
});

export const { 
  setActiveTab, 
  clearError, 
  setTimelineData, 
  resetRoadmap,
  toggleAutoRefresh,
  setLastUpdated,
  updateTimelineData
} = roadmapSlice.actions;

export default roadmapSlice.reducer;