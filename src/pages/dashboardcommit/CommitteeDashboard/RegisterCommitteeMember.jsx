// src/pages/dashboardcommit/RegisterCommitteeMember.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import workTeamAnimation from "./work team.json";

const RegisterCommitteeMember = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_in_committee: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const committeeRoles = [
    { value: "economist", label: "Economic Expert" },
    { value: "market", label: "Marketing Expert" },
    { value: "legal", label: "Legal Expert" },
    { value: "technical", label: "Technical Expert" },
    { value: "investor", label: "Investment Expert" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register/committee-member",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setSuccess("Committee member registered successfully!");
        localStorage.setItem("committee_token", response.data.token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));

        setTimeout(() => {
          navigate("/committee-dashboard");
        }, 1500);
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message || "Error occurred during registration");
      else if (err.request) setError("No connection to server");
      else setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center relative">

      {/* LEFT – FORM */}
      <div className="w-full h-full flex bg-white">

        <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold italic text-slate-800">
              Register Committee Member
            </h1>
            <p className="text-slate-600 italic">
              Add a new member to the committee
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded text-center italic">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded text-center italic">
              ✅ {success} <br /> Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 italic"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 italic"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
              disabled={loading}
              className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 italic"
            />

            <select
              name="role_in_committee"
              value={formData.role_in_committee}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-5 py-4 border rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 italic text-right"
            >
              <option value="">Select Committee Role</option>
              {committeeRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-800 text-white font-bold rounded-lg hover:scale-[1.02] transition disabled:opacity-70 italic"
            >
              {loading ? "Registering..." : "Register Committee Member"}
            </button>

            {/* LINK TO LOGIN */}
            <div className="text-center mt-4">
              <span className="text-slate-600 italic mr-2">Already have an account?</span>
              <button
                type="button"
                onClick={() => navigate("/login/committee-member")}
                className="text-orange-600 font-bold hover:underline italic"
              >
                sign in
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT – ANIMATION PANEL */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative p-10">
          <Lottie
            animationData={workTeamAnimation}
            loop={true}
            className="w-full h-[90%]"
          />
        </div>

      </div>
    </div>
  );
};

export default RegisterCommitteeMember;
