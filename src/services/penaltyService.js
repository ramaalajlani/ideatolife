import api from "./api";

const penaltyService = {
  getPenaltyStatus: async (ideaId) => {
    try {
      const response = await api.get(`/ideas/${ideaId}/penalty`);
      return response.data;
    } catch (error) {
      console.error("Error fetching penalty status:", error);
      throw error.response?.data || { message: "Failed to load penalty status" };
    }
  },

  payPenalty: async (ideaId) => {
    try {
      const response = await api.post(`/gantt/${ideaId}/pay-penalty`);
      return response.data;
    } catch (error) {
      console.error("Error paying penalty:", error);
      throw error.response?.data || { message: "Failed to pay penalty" };
    }
  },

  getWallet: async () => {
    try {
      const response = await api.get("/my_wallet");
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet:", error);
      throw error.response?.data || { message: "Failed to load wallet" };
    }
  },
};

export default penaltyService;
