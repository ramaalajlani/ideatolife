import api from "./api";

const profileService = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },
  updateProfile: async (formData) => {
    const response = await api.post("/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  getMyIdeas: async () => {
    const response = await api.get("/my_ideas");
    return response.data;
  },
};

export default profileService;
