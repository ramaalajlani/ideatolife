"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router
import Lottie from "lottie-react";
import CreativeIdea from '../assets/animations/Creative Idea.json';
import ideaService from "../services/ideaService"; // تأكد من اسم الملف الصحيح

const IdeaSubmissionForm = () => {
  const navigate = useNavigate(); // ✅ استخدام navigate

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

      // إعادة تهيئة الفورم
      setFormData({
        title: "",
        description: "",
        problem: "",
        solution: "",
        targetAudience: "",
        additionalNotes: "",
        termsAccepted: false
      });

      // ✅ بعد نجاح الإرسال، التوجيه لصفحة /timeline
      navigate("/timeline");

    } catch (err) {
      setErrorMessage(err.message || "Failed to submit idea");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const commonClasses = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300 bg-white/80";
    if (field.type === "textarea") {
      return <textarea
        id={field.id}
        name={field.id}
        rows={field.rows}
        value={formData[field.id]}
        onChange={handleInputChange}
        placeholder={field.placeholder}
        className={`${commonClasses} resize-none`}
        required
      />;
    }
    return <input
      type={field.type}
      id={field.id}
      name={field.id}
      value={formData[field.id]}
      onChange={handleInputChange}
      placeholder={field.placeholder}
      className={commonClasses}
      required
    />;
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white/95 rounded-3xl shadow-xl overflow-hidden border border-white/50 grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        <div className="bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300 text-gray-800 p-10 lg:p-16 flex flex-col justify-start relative overflow-hidden">
          <div className="absolute inset-0 bg-white/30"></div>
          <div className="relative z-10 text-center lg:text-left">
            <div className="mb-4 lg:mb-6 flex justify-center lg:justify-start">
              <div className="w-80 h-80 lg:w-96 lg:h-96">
                <Lottie animationData={CreativeIdea} loop className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 lg:p-16 bg-white">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Submit Your Idea</h1>

          {successMessage && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">{successMessage}</div>}
          {errorMessage && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(f => (
              <div key={f.id} className="space-y-2">
                <label htmlFor={f.id} className="block text-gray-700 font-semibold">{f.label}</label>
                {renderField(f)}
              </div>
            ))}

            <div className="flex items-start space-x-3 bg-orange-50 rounded-xl p-4 border border-orange-100">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 mt-1 flex-shrink-0"
                required
              />
              <label htmlFor="termsAccepted" className="text-gray-700">I agree to the terms and conditions.</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-orange-400 to-purple-500 text-white py-3 rounded-xl font-semibold ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 transition-transform"}`}
            >
              {loading ? "Submitting..." : "Submit Idea"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
