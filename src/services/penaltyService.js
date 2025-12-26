// src/services/penaltyService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const penaltyService = {
  getPenaltyStatus: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/ideas/${ideaId}/penalty`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching penalty status:', error);
      throw error.response?.data || { message: 'Failed to load penalty status' };
    }
  },

  payPenalty: async (ideaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/gantt/${ideaId}/pay-penalty`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error paying penalty:', error);
      throw error.response?.data || { message: 'Failed to pay penalty' };
    }
  },

  getWallet: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/my_wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error.response?.data || { message: 'Failed to load wallet' };
    }
  }
};

export default penaltyService;