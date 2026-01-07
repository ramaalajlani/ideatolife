"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import GetAnIdea from '../assets/animations/Get an Idea.json';

const IdeaEditForm = () => {
  const navigate = useNavigate();
  const { ideaId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    target_audience: "",
    additional_notes: "",
    termsAccepted: false
  });

  const [ideaStatus, setIdeaStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const checkIdeaStatus = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Please login to continue");
        }

        const response = await fetch(`http://127.0.0.1:8000/api/my_ideas`, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to verify idea status");
        }

        const result = await response.json();
        const targetIdea = result.ideas?.find(idea => 
          idea.id.toString() === ideaId.toString()
        );

        if (!targetIdea) {
          throw new Error("Idea not found or you don't have permission to edit it");
        }

        if (targetIdea.status !== 'needs_revision') {
          setErrorMessage(`You can only edit ideas that need revision. Current status: ${targetIdea.status}`);
          setIdeaStatus(targetIdea.status);
        } else {
          setIdeaStatus('needs_revision');
          setFormData({
            title: "",
            description: "",
            problem: "",
            solution: "",
            target_audience: "",
            additional_notes: "",
            termsAccepted: false
          });
        }

      } catch (err) {
        console.error("Error checking idea status:", err);
        setErrorMessage(err.message);
      } finally {
        setFetching(false);
      }
    };

    checkIdeaStatus();
  }, [ideaId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      setErrorMessage("Please accept the terms and conditions");
      return;
    }
    
    // Check only required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMessage("Title and description are required");
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue");
      }

      const apiData = {
        title: formData.title,
        description: formData.description,
        problem: formData.problem || "",
        solution: formData.solution || "",
        target_audience: formData.target_audience || "",
        additional_notes: formData.additional_notes || ""
      };

      const response = await fetch(`http://127.0.0.1:8000/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = { message: "Idea updated successfully" };
      }
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to update idea");
      }
      
      setSuccessMessage("✓ Idea has been successfully revised and updated!");
      
      setTimeout(() => {
        navigate(`/ideas/${ideaId}/roadmap`);
      }, 2000);
      
    } catch (err) {
      setErrorMessage(err.message || "Failed to update idea. Please try again.");
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
      />
    );
  };

  const fields = [
    { id: "title", label: "Revised Idea Title", type: "text", placeholder: "Enter the revised title of your idea" },
    { id: "description", label: "Revised Idea Description", type: "textarea", placeholder: "Describe your revised idea in detail", rows: 4 },
    { id: "problem", label: "Revised Problem Statement", type: "textarea", placeholder: "What problem does your revised idea solve?", rows: 3 },
    { id: "solution", label: "Revised Proposed Solution", type: "textarea", placeholder: "How does your revised idea solve this problem?", rows: 3 },
    { id: "target_audience", label: "Revised Target Audience", type: "text", placeholder: "Who will benefit from your revised idea?" },
    { id: "additional_notes", label: "Additional Notes", type: "textarea", placeholder: "Any additional notes about the revisions you made", rows: 3 }
  ];

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100">
        <p className="text-gray-500 text-lg">Verifying idea status...</p>
      </div>
    );
  }

  if (ideaStatus && ideaStatus !== 'needs_revision') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Cannot Edit Idea</h2>
          <p className="text-gray-700 mb-4">
            You can only edit ideas that need revision. Current status: <span className="font-bold">{ideaStatus}</span>
          </p>
          <button
            onClick={() => navigate(`/ideas/${ideaId}/roadmap`)}
            className="bg-gradient-to-r from-orange-500 to-red-700 py-3 px-6 rounded-full text-white font-bold hover:shadow-lg transition-all"
          >
            Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100 m-0 p-0">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Lottie Animation at the top */}
        <div className="w-full h-full flex flex-col items-center bg-[#FFE2AF] p-8">
          {/* Animation container */}
          <div className="w-80 h-80 lg:w-96 lg:h-96">
            <Lottie animationData={GetAnIdea} loop className="w-full h-full" />
          </div>
          
          {/* Guidelines - below animation */}
          <div className="text-center lg:text-left max-w-xs text-gray-700 mt-8">
            <h2 className="text-2xl font-bold mb-4">Revision Guidelines</h2>
            <p className="mb-2">1. Start fresh - Rewrite your idea completely</p>
            <p className="mb-2">2. Address all feedback received</p>
            <p className="mb-2">3. Be specific and detailed</p>
            <p>4. Focus on improvements and clarity</p>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full h-full flex flex-col justify-center items-center p-10 lg:p-16 bg-[#FFF8F0]">
          <div className="w-full max-w-xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center lg:text-left">Edit Idea</h1>
            
            {ideaStatus === 'needs_revision' && (
              <div className="mb-6 bg-yellow-50 text-yellow-800 px-6 py-4 rounded-xl shadow">
                <p className="font-bold">Important: Complete Rewrite Required</p>
                <p>Based on the feedback received, please rewrite your idea from scratch. All fields must be filled with new, improved content.</p>
              </div>
            )}

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
                  <label htmlFor={f.id} className="block text-gray-700 font-semibold">
                    {f.label}
                  </label>
                  {renderField(f)}
                </div>
              ))}

              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 mt-1 flex-shrink-0"
                />
                <label htmlFor="termsAccepted" className="text-gray-700 leading-relaxed">
                  <span className="font-bold">I confirm that:</span>
                  <br />
                  1. I have completely rewritten my idea based on the feedback received
                  <br />
                  2. All information entered is new and improved
                  <br />
                  3. I understand this will replace the previous version of my idea
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/ideas/${ideaId}/roadmap`)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 py-5 px-12 rounded-full text-gray-800 font-bold text-lg transition-all duration-500 text-center"
                >
                  Cancel Revision
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 relative group bg-gradient-to-r from-orange-500 to-red-700 py-5 px-12 rounded-full text-white font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 transform hover:scale-105 text-center disabled:opacity-50"
                >
                  {loading ? "Submitting Revision..." : "Submit Revised Idea"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaEditForm;