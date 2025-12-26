import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token");

const addIdea = async (ideaData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/ideas`, {
      title: ideaData.title,
      description: ideaData.description,
      problem: ideaData.problem,
      solution: ideaData.solution,
      target_audience: ideaData.targetAudience,
      additional_notes: ideaData.additionalNotes,
      terms_accepted: ideaData.termsAccepted,
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // توكن المستخدم
      }
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to submit idea" };
  }
};

export default { addIdea };
