import api from './api';

const postLaunchFollowupService = {
  getFollowupsByIdeaId: async (ideaId) => {
    const response = await api.get(`/ideas/${ideaId}/post-launch-followups`);
    return response.data;
  },

  updateFollowupByOwner: async (followupId, data) => {
    const response = await api.post(
      `/post-launch-followups/${followupId}/owner-update`,
      data
    );
    return response.data;
  },

  // تقييم المتابعة من قبل اللجنة
  submitFollowupByCommittee: async (followupId, data) => {
    const response = await api.post(
      `/post-launch-followups/${followupId}/submit`,
      data
    );
    return response.data;
  },

  // ✅ تأكيد صاحب الفكرة على ملاحظات اللجنة
  acknowledgePostLaunchFollowup: async (followupId, data) => {
    const response = await api.post(
      `/post-launch-followups/${followupId}/acknowledge`,
      data
    );
    return response.data;
  },

  // تحديث قرار اللجنة
  updateCommitteeDecision: async (followupId, data) => {
    const response = await api.post(
      `/post-launch-followups/${followupId}/committee-submit`,
      data
    );
    return response.data;
  },
};

export default postLaunchFollowupService;