import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import axios from 'axios';
import Lottie from 'lottie-react';
import bulbAnimation from './Idea Bulb.json';

const LoginRoute = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // ========================
  // Handle input
  // ========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  // ========================
  // Submit login (BACKEND MATCHED)
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/idea-owner',
        formData
      );

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/profile'); // نفس المنطق المطلوب
      }

    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } 
      else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } 
      else {
        setError('Something went wrong, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center relative">

      {/* Logo */}
      <div 
        className="absolute top-8 right-8 md:top-12 md:right-12 z-20 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <div className="flex flex-col items-end transform hover:scale-105 transition-transform duration-300">
          <span className="text-5xl md:text-6xl lg:text-7xl font-black text-[#f87115] tracking-[-0.08em] leading-[0.8] drop-shadow-lg">
            Idea
          </span>
          <div className="bg-[#f87115] px-4 py-3 rounded-[5px] mt-2 shadow-xl">
            <span className="text-white text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-none">
              2Life
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex bg-white">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-16">

          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 italic">
              Welcome Back
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 italic">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="max-w-md mx-auto w-full mb-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg italic text-center">
                ❌ {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">

            {/* Email */}
            <div className="relative">
              <label className="block text-slate-600 text-sm mb-2 italic">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic`}
                placeholder="Type your email"
                required
              />
              <User className="absolute right-4 top-[50px] text-slate-400" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 italic">
                  {errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-slate-600 text-sm mb-2 italic">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic`}
                placeholder="Type your password"
                required
              />
              <Lock className="absolute right-4 top-[50px] text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-[50px] text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 italic">
                  {errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-orange-800 text-white text-lg font-bold rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-70 italic"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Link to register */}
            <div className="text-center mt-4">
              <p className="text-slate-600 italic">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[#f87115] font-bold hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>

          </form>
        </div>

        {/* RIGHT SECTION with Animation */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-10 relative">
          {/* تصميم المثلث المائل الفاصل */}
          <div className="absolute top-0 left-0 h-full w-24 bg-white -translate-x-12 -skew-x-12 origin-top"></div>

          <div className="text-center z-10">
            <div className="w-full max-w-sm mx-auto mb-6">
              <Lottie
                animationData={bulbAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '300px' }}
              />
            </div>
            <h1 className="text-5xl font-black mb-6 italic">WELCOME BACK!</h1>
            <p className="text-slate-600 max-w-sm italic">
              We're happy to see you again. Sign in to continue your journey with Idea2Life.
            </p>
          </div>

          {/* دوائر ديكورية في الخلفية */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-orange-100/30 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  );
};

export default LoginRoute;