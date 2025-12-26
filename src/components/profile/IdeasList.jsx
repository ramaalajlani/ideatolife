import { Calendar, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "text-yellow-600 bg-yellow-100",
  approved: "text-green-700 bg-green-100",
  rejected: "text-red-700 bg-red-100",
};

const IdeasList = ({ ideas }) => {
  const navigate = useNavigate();

  if (!ideas || ideas.length === 0) {
    return (
      <div className="p-6 bg-white border rounded-xl text-center text-slate-500">
        No ideas yet — start by submitting your first idea ✨
      </div>
    );
  }

  // المشكلة هنا! يجب تغيير هذا الحدث
  const handleIdeaClick = (idea) => {
    // إذا كنت تريد الذهاب إلى خارطة الطريق، غير المسار:
    navigate(`/ideas/${idea.id}/roadmap`);
    // إذا كنت تريد عرض التفاصيل، غير المسار:
    // navigate(`/ideas/${idea.id}/details`);
  };

  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          onClick={() => handleIdeaClick(idea)}
          className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-slate-900">{idea.title}</h3>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                statusColors[idea.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {idea.status === "pending" && "Pending"}
              {idea.status === "approved" && "Approved"}
              {idea.status === "rejected" && "Rejected"}
            </span>
          </div>

          <p className="text-slate-600 mb-4">{idea.description}</p>

          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            {/* Created At */}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {idea.created_at}
            </div>

            {/* Roadmap Stage */}
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              Stage: {idea.roadmap_stage || "Not specified"}
            </div>

            {/* Committee */}
            {idea.committee && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                Committee: {idea.committee.name}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IdeasList;