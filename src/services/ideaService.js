
import api from "./api";
const addIdea = async (ideaData) => {
  try {
    const response = await api.post("/ideas", {
      title: ideaData.title,
      description: ideaData.description,
      problem: ideaData.problem,
      solution: ideaData.solution,
      target_audience: ideaData.targetAudience,
      additional_notes: ideaData.additionalNotes,
      terms_accepted: ideaData.termsAccepted,
    });
    return response.data;
  } catch (err) {
    console.error("Error adding idea:", err);
    throw err.response?.data || { message: "Failed to submit idea" };
  }
};

// تعديل فكرة موجودة
const updateIdea = async (ideaId, ideaData) => {
  try {
    const response = await api.put(`/ideas/${ideaId}`, {
      title: ideaData.title,
      description: ideaData.description,
      problem: ideaData.problem,
      solution: ideaData.solution,
      target_audience: ideaData.targetAudience,
      additional_notes: ideaData.additionalNotes,
    });
    return response.data;
  } catch (err) {
    console.error("Error updating idea:", err);
    throw err.response?.data || { message: "Failed to update idea" };
  }
};

export default { addIdea, updateIdea };
