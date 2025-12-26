import axios from "axios";
const API_URL = "http://127.0.0.1:8000/api";
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
});
const profileService = {
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`, authHeaders());
    return response.data;
  },
  updateProfile: async (formData) => {
    const response = await axios.post(
      `${API_URL}/profile/update`,
      formData,
      authHeaders()
    );
    return response.data;
  },
  getMyIdeas: async () => {
    const response = await axios.get(
      `${API_URL}/my_ideas`,
      authHeaders()
    );
    return response.data;
  },
};
export default profileService;
