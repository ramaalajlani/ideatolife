
import api from "./api";
const activeRequests = new Map();

const taskService = {

  updateTask: async (taskId, formData) => {
    const requestKey = `task-${taskId}-${Date.now()}`;

    if (activeRequests.has(requestKey)) {
      console.warn(`Duplicate request detected for task ${taskId}, skipping...`);
      return { message: "Request already in progress" };
    }

    try {
      activeRequests.set(requestKey, true);
      const response = await api.post(`/tasks/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        validateStatus: (status) => status >= 200 && status < 300,
      });

      return response.data;
    } catch (err) {
      console.error(`Task ${taskId} update failed (silent).`, err);
      return null;
    } finally {
      activeRequests.delete(requestKey);
    }
  },

  createTask: async (ganttId, taskData) => {
    try {
      const response = await api.post(`/gantt-charts/${ganttId}/tasks`, taskData);
      return response.data;
    } catch (err) {
      console.error("Error creating task:", err);
      return null;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (err) {
      console.error("Error deleting task:", err);
      return null;
    }
  },

  getTask: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (err) {
      console.error("Error getting task:", err);
      return null;
    }
  },
};

export default taskService;
