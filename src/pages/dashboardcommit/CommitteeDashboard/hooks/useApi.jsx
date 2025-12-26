// src/pages/dashboardcommit/CommitteeDashboard/hooks/useApi.js
import { useState, useCallback } from "react";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message || 'حدث خطأ غير متوقع');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, callApi, setError };
};

export default useApi;