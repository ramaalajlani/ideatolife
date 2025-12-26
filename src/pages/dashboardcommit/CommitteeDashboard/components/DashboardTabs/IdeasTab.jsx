import React, { useState, useEffect } from "react";
import axios from "axios";

const IdeasTab = ({ onViewGanttChart }) => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الأفكار مع كل التفاصيل من API واحد
  const fetchCommitteeIdeas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("committee_token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/committee/ideas-full-clean",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.ideas) {
        setIdeas(response.data.ideas);
      } else {
        setIdeas([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching committee ideas:", err);
      setError(err.response?.data?.message || "Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeIdeas();
  }, []);

  const getStatusBadge = (status) => {
    const base =
      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ";
    const config = {
      pending: "bg-orange-50 text-orange-700 border-orange-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      "in progress": "bg-blue-50 text-blue-700 border-blue-200",
    };
    return base + (config[status] || "bg-gray-50 text-gray-700 border-gray-200");
  };

  const ProgressBar = ({ percentage }) => (
    <div className="relative pt-6">
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-orange-600 to-red-800 transition-all duration-1000 ease-out"
          style={{ width: `${percentage || 0}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          PROGRESS
        </span>
        <span className="text-sm font-bold text-orange-700">
          {percentage || 0}%
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">
          LOADING DATABASE
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-bold py-20">
        {error}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-12">
      {ideas.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 py-32 text-center">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-400">
            QUEUE IS EMPTY
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ideas.map((idea) => {
            const ideaId = idea.id;
            const roadmap = idea.roadmap;
            const owner = idea.owner;

            return (
              <div
                key={ideaId}
                className="group relative flex bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Side Bar */}
                <div className="w-3 bg-gray-200 group-hover:bg-gradient-to-b group-hover:from-orange-600 group-hover:to-red-800 transition-all duration-500"></div>

                <div className="flex-1 p-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-3">
                      <span className={getStatusBadge(idea.status)}>
                        {idea.status?.replace("_", " ")}
                      </span>
                      <span className="text-sm font-bold text-gray-500 uppercase">
                        ID: {ideaId}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        Owner: {owner?.name} ({owner?.email})
                      </span>
                    </div>

                    {onViewGanttChart && (
                      <button
                        onClick={() => onViewGanttChart(idea)}
                        className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300"
                      >
                        →
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {idea.title}
                    </h3>

                    <p className="text-gray-500 text-base leading-relaxed">
                      {idea.description}
                    </p>
                    <p><strong>Problem:</strong> {idea.problem}</p>
                    <p><strong>Solution:</strong> {idea.solution}</p>
                    <p><strong>Target Audience:</strong> {idea.target_audience}</p>
                    <p><strong>Additional Notes:</strong> {idea.additional_notes}</p>

                    {/* Roadmap */}
                    {roadmap ? (
                      <div className="pt-4 border-t-2 border-gray-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold uppercase">
                            CURRENT STAGE
                          </span>
                          <span className="text-sm font-bold text-orange-700 bg-orange-100 px-4 py-2 rounded-full">
                            {roadmap.current_stage}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {roadmap.stage_description}
                        </p>
                        <ProgressBar percentage={roadmap.progress_percentage} />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">No roadmap available</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t-2 border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        PHASE
                      </span>
                      <div className="text-sm font-bold text-gray-900 uppercase">
                        {roadmap?.current_stage || "N/A"}
                      </div>
                    </div>

                    {onViewGanttChart && (
                      <button
                        onClick={() => onViewGanttChart(idea)}
                        className="text-xs font-bold uppercase border-b-2 border-gray-900 pb-2 group-hover:text-orange-600 group-hover:border-orange-600 transition-all"
                      >
                        VIEW DETAILED TIMELINE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IdeasTab;
