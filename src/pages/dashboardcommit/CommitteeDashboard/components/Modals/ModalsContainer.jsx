// src/pages/dashboardcommit/CommitteeDashboard/components/Modals/ModalsContainer.jsx
import React from "react";
import CommitteeInfoPopup from "./CommitteeInfoPopup";
import EvaluationModal from "./EvaluationModal";
import GanttChartModal from "./GanttChartModal";
import EditMeetingModal from "./EditMeetingModal";
import AdvancedMeetingModal from "./AdvancedMeetingModal";

const ModalsContainer = ({ state, dispatch }) => {
  const {
    showCommitteeInfo,
    committeeInfo,
    showGanttChart,
    selectedIdeaForGantt,
    ganttData,
    selectedIdea,
    selectedMeeting,
    meetingData,
    showAdvancedMeetingPopup,
    advancedMeetingData,
    advancedIdeaId
  } = state;

  const handleCloseGanttChart = () => {
    dispatch({ type: 'SET_SHOW_GANTT_CHART', payload: false });
    dispatch({ type: 'SET_SELECTED_IDEA_FOR_GANTT', payload: null });
    dispatch({ type: 'SET_GANTT_DATA', payload: [] });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: "ideas" });
  };

  const handleApproveRejectAllPhases = async (approvalStatus) => {
    // Implementation from original code
  };

  if (showGanttChart) {
    return (
      <GanttChartModal
        idea={selectedIdeaForGantt}
        ganttData={ganttData}
        onClose={handleCloseGanttChart}
        onApproveRejectAll={handleApproveRejectAllPhases}
        token={localStorage.getItem("token")}
      />
    );
  }

  return (
    <>
      <CommitteeInfoPopup
        show={showCommitteeInfo}
        onClose={() => dispatch({ type: 'SET_SHOW_COMMITTEE_INFO', payload: false })}
        {...committeeInfo}
      />

      {selectedIdea && (
        <EvaluationModal
          idea={selectedIdea}
          token={localStorage.getItem("token")}
          onClose={() => dispatch({ type: 'SET_SELECTED_IDEA', payload: null })}
          onSuccess={(msg) => {
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: msg });
            dispatch({ type: 'SET_SELECTED_IDEA', payload: null });
          }}
        />
      )}

      {selectedMeeting && (
        <EditMeetingModal
          meeting={selectedMeeting}
          meetingData={meetingData}
          onClose={() => dispatch({ type: 'SET_SELECTED_MEETING', payload: null })}
          onUpdate={(data) => {
            // Update logic
            dispatch({ type: 'SET_SELECTED_MEETING', payload: null });
          }}
        />
      )}

      {showAdvancedMeetingPopup && (
        <AdvancedMeetingModal
          advancedMeetingData={advancedMeetingData}
          advancedIdeaId={advancedIdeaId}
          onClose={() => dispatch({ type: 'SET_SHOW_ADVANCED_MEETING_POPUP', payload: false })}
          onSubmit={(data) => {
            // Submit logic
            dispatch({ type: 'SET_SHOW_ADVANCED_MEETING_POPUP', payload: false });
          }}
        />
      )}
    </>
  );
};

export default ModalsContainer;