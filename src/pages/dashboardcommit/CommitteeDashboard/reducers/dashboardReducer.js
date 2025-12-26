// src/pages/dashboardcommit/CommitteeDashboard/reducers/dashboardReducer.js
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_IDEAS':
      return { ...state, ideas: action.payload };
    
    case 'SET_BMCS':
      return { ...state, bmcs: action.payload };
    
    case 'SET_SELECTED_IDEA':
      return { ...state, selectedIdea: action.payload };
    
    case 'SET_SELECTED_MEETING':
      return { ...state, selectedMeeting: action.payload };
    
    case 'SET_SHOW_COMMITTEE_INFO':
      return { ...state, showCommitteeInfo: action.payload };
    
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.payload };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'SET_MEETING_DATA':
      return { ...state, meetingData: action.payload };
    
    case 'SET_COMMITTEE_INFO':
      return { ...state, committeeInfo: action.payload };
    
    case 'SET_SHOW_ADVANCED_MEETING_POPUP':
      return { ...state, showAdvancedMeetingPopup: action.payload };
    
    case 'SET_ADVANCED_MEETING_DATA':
      return { ...state, advancedMeetingData: action.payload };
    
    case 'SET_ADVANCED_IDEA_ID':
      return { ...state, advancedIdeaId: action.payload };
    
    case 'SET_SHOW_GANTT_CHART':
      return { ...state, showGanttChart: action.payload };
    
    case 'SET_SELECTED_IDEA_FOR_GANTT':
      return { ...state, selectedIdeaForGantt: action.payload };
    
    case 'SET_GANTT_DATA':
      return { ...state, ganttData: action.payload };
    
    case 'CLEAR_MESSAGES':
      return { 
        ...state, 
        successMessage: '', 
        errors: [] 
      };
    
    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea.idea_id === action.payload.ideaId
            ? { ...idea, ...action.payload.updates }
            : idea
        )
      };
    
    case 'ADD_MEETING_TO_IDEA':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea.idea_id === action.payload.ideaId
            ? {
                ...idea,
                meeting: idea.meeting
                  ? [...idea.meeting, { ...action.payload.meeting, meeting_id: action.payload.meeting.id }]
                  : [{ ...action.payload.meeting, meeting_id: action.payload.meeting.id }]
              }
            : idea
        )
      };
    
    case 'UPDATE_IDEA_MEETING':
      return {
        ...state,
        ideas: state.ideas.map(idea =>
          idea.idea_id === action.payload.ideaId
            ? {
                ...idea,
                meeting: idea.meeting.map(m =>
                  m.meeting_id === action.payload.meetingId
                    ? { ...m, ...action.payload.meetingData }
                    : m
                )
              }
            : idea
        )
      };
    
    case 'UPDATE_GANTT_PHASES':
      return {
        ...state,
        ganttData: state.ganttData.map(phase => ({
          ...phase,
          approval_status: action.payload
        }))
      };
    
    case 'UPDATE_GANTT_PHASE_EVALUATION':
      return {
        ...state,
        ganttData: state.ganttData.map(phase =>
          phase.id === action.payload.phaseId
            ? {
                ...phase,
                evaluation_score: action.payload.score,
                evaluation_comments: action.payload.comments
              }
            : phase
        )
      };
    
    default:
      return state;
  }
};

export default dashboardReducer;