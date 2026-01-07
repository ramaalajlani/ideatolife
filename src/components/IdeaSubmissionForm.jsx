"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import CreativeIdea from '../assets/animations/Creative Idea.json';
import ideaService from "../services/ideaService";

const IdeaSubmissionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    targetAudience: "",
    additionalNotes: "",
    termsAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await ideaService.addIdea(formData);

      setSuccessMessage(result.message || "Idea submitted successfully!");

      // إعادة تعيين النموذج
      setFormData({
        title: "",
        description: "",
        problem: "",
        solution: "",
        targetAudience: "",
        additionalNotes: "",
        termsAccepted: false
      });

      // الانتقال مباشرةً إلى Roadmap للفكرة الجديدة
      if (result.idea && result.idea.id) {
        navigate(`/ideas/${result.idea.id}/roadmap`);
      }

    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || "Failed to submit idea");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const commonClasses = "w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-300 bg-white placeholder-gray-500 text-gray-800";
    if (field.type === "textarea") {
      return (
        <textarea
          id={field.id}
          name={field.id}
          rows={field.rows}
          value={formData[field.id]}
          onChange={handleInputChange}
          placeholder={field.placeholder}
          className={`${commonClasses} resize-none`}
          required
        />
      );
    }
    return (
      <input
        type={field.type}
        id={field.id}
        name={field.id}
        value={formData[field.id]}
        onChange={handleInputChange}
        placeholder={field.placeholder}
        className={commonClasses}
        required
      />
    );
  };

  const fields = [
    { id: "title", label: "Idea Title", type: "text", placeholder: "Enter your idea title" },
    { id: "description", label: "Idea Description", type: "textarea", placeholder: "Describe your idea in detail", rows: 4 },
    { id: "problem", label: "Problem Statement", type: "textarea", placeholder: "What problem does this idea solve?", rows: 3 },
    { id: "solution", label: "Proposed Solution", type: "textarea", placeholder: "How does your idea solve this problem?", rows: 3 },
    { id: "targetAudience", label: "Target Audience", type: "text", placeholder: "Who will benefit from this idea?" },
    { id: "additionalNotes", label: "Additional Notes", type: "textarea", placeholder: "Any additional info", rows: 3 }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 m-0 p-0">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* القسم الأيسر مع الأنيميشن والتعليمات */}
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#FFE2AF] p-8 space-y-8">
          <div className="w-80 h-80 lg:w-96 lg:h-96">
            <Lottie animationData={CreativeIdea} loop className="w-full h-full" />
          </div>
          <div className="text-center lg:text-left max-w-xs text-gray-700">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p className="mb-2">1. Be clear and concise about your idea.</p>
            <p className="mb-2">2. Explain the problem your idea solves.</p>
            <p className="mb-2">3. Describe your proposed solution.</p>
            <p className="mb-2">4. Indicate the target audience.</p>
            <p>5. Add any additional notes if necessary.</p>
          </div>
        </div>

        {/* القسم الأيمن للنموذج */}
        <div className="w-full h-full flex flex-col justify-center items-center p-10 lg:p-16 bg-[#FFF8F0]">
          <div className="w-full max-w-xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center lg:text-left">Submit Your Idea</h1>

            {successMessage && (
              <div className="mb-6 bg-green-50 text-green-800 px-6 py-4 rounded-xl shadow">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 bg-red-50 text-red-800 px-6 py-4 rounded-xl shadow">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(f => (
                <div key={f.id} className="space-y-2">
                  <label htmlFor={f.id} className="block text-gray-700 font-semibold">{f.label}</label>
                  {renderField(f)}
                </div>
              ))}

              <div className="flex items-start space-x-3 p-4">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 mt-1 flex-shrink-0"
                  required
                />
                <label htmlFor="termsAccepted" className="text-gray-700 leading-relaxed">
                  I agree to the terms and conditions.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative group bg-gradient-to-r from-orange-500 to-red-700 py-5 px-12 rounded-full text-white font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:scale-105 w-full text-center"
              >
                {loading ? "Submitting..." : "Send Your Idea"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
