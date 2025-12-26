// src/pages/dashboardcommit/CommitteeDashboard/services/committeeService.js
import { apiService } from './apiService';

export const committeeService = {
  async fetchAllIdeas() {
    try {
      const data = await apiService.get('/committee/ideas');
      return data.ideas?.map(idea => ({
        ...idea,
        idea_id: idea.id || idea.idea_id
      })) || [];
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  },

  async fetchSingleIdea(ideaId) {
    try {
      const data = await apiService.get(`/committee/ideas/${ideaId}`);
      return data.idea ? [{
        ...data.idea,
        idea_id: data.idea.id || data.idea.idea_id
      }] : [];
    } catch (error) {
      console.error('Error fetching single idea:', error);
      throw error;
    }
  },

  async fetchBMCs(ideaId) {
    try {
      const params = ideaId ? { idea_id: ideaId } : {};
      const data = await apiService.get('/committee/bmcs', params);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching BMCs:', error);
      throw error;
    }
  },

  async fetchCommitteeInfo() {
    try {
      const data = await apiService.get('/my-committee/dashboard');
      
      if (data.status === "success" && data.data) {
        const c = data.data;
        return {
          name: c.committee_name || "اسم اللجنة",
          description: c.description || "",
          status: c.status || "",
          role: c.my_role || "",
          members: c.members || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching committee info:', error);
      throw error;
    }
  }
};