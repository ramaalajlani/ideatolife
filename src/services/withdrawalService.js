import api from './api';

const withdrawalService = {
  // إرسال طلب انسحاب من قبل صاحب الفكرة
  requestWithdrawal: async (ideaId, reason) => {
    try {
      const response = await api.post(`/ideas/${ideaId}/withdraw`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  },

  // جلب كل طلبات الانسحاب للفكرة (إذا أردت عرضها في صفحة Admin أو Timeline)
  getIdeaWithdrawals: async (ideaId) => {
    try {
      const response = await api.get(`/ideas/${ideaId}/withdrawals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  }
};

export default withdrawalService;
