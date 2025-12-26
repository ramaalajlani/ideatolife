import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import waitingForIdeasAnimation from "../assets/animations/Waiting For Ideas.json";
import { registerIdeaOwner } from "../api/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const res = await registerIdeaOwner(formData);
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        setSuccessMessage(res.data.message || "Account created successfully!");
        
        setTimeout(() => {
          navigate("/Profile");
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = loading || successMessage;

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="w-full h-full flex bg-white">
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 italic">Create Account</h1>
            <p className="text-lg lg:text-xl text-slate-600 italic">Join our creative community today</p>
          </div>

          {successMessage && (
            <div className="max-w-md mx-auto w-full mb-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg italic text-center">
                ✅ {successMessage}
                <p className="text-sm mt-1 text-green-600">
                  Redirecting to homepage in 2 seconds...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto w-full mb-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg italic text-center">
                ❌ {error}
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6 max-w-md mx-auto w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-5 py-4 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic"
              required
              disabled={isFormDisabled}
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic"
              required
              disabled={isFormDisabled}
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-5 py-4 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic"
              required
              minLength="6"
              disabled={isFormDisabled}
            />

            <button
              type="submit"
              disabled={isFormDisabled}
              className={`w-full py-4 bg-gradient-to-r from-orange-500 to-orange-800 text-white text-lg font-bold rounded-lg hover:scale-105 transition-all italic shadow-lg ${
                isFormDisabled ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : successMessage ? (
                "Account Created ✓"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="max-w-md mx-auto w-full mt-6 text-center">
            <p className="text-slate-600 italic">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-600 font-semibold hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>

          <p className="text-xs lg:text-sm text-slate-600 text-center mt-10 italic">
            By creating an account, you agree to our
            <a href="#" className="text-orange-600 mx-1 font-semibold hover:underline">Terms of Service</a>
            and
            <a href="#" className="text-orange-600 mx-1 font-semibold hover:underline">Privacy Policy</a>
          </p>
        </div>

        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-10">
          <Lottie animationData={waitingForIdeasAnimation} loop autoplay />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;