// services/walletService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const walletService = {
  getMyWallet: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/my_wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      
      // إذا كان الخطأ 404 (لا توجد محفظة)، يمكنك إنشاء واحدة افتراضية
      if (error.response?.status === 404) {
        return {
          message: 'Wallet not found',
          wallet: { balance: 0.00 }
        };
      }
      
      throw error.response?.data || error.message;
    }
  },

  updateWalletBalance: async (newBalance) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(`${API_URL}/wallet/update`, 
        { balance: newBalance },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error.response?.data || error.message;
    }
  },

  getWalletTransactions: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/wallet/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default walletService;