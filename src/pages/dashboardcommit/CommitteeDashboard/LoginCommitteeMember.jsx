import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import axios from 'axios';
import Lottie from 'lottie-react';
import workTeamAnimation from './work team.json'; // أو يمكن استبداله بـ Idea Bulb.json

const LoginCommitteeMember = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/committee-member',
        formData
      );

      if (response.data?.token) {
        localStorage.setItem('committee_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));

        navigate('/committee-dashboard');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response?.status === 401) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        setError('حدث خطأ، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center relative">

      <div className="w-full h-full flex bg-white">

        {/* LEFT SECTION – FORM */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-16">

          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 italic">
              Committee Member Login
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 italic">
              Enter your credentials to access the dashboard
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
                className={`w-full px-5 py-4 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic`}
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

<div className="relative">
  <label className="block text-slate-600 text-sm mb-2 italic">
    Password
  </label>
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    className={`w-full px-5 py-4 rounded-lg border pl-12 pr-12 ${errors.password ? 'border-red-500' : 'border-slate-300'} focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 italic`}
    placeholder="Type your password"
    required
  />
  {/* Lock icon على اليسار */}
  <Lock className="absolute left-4 top-[50px] text-slate-400" />
  {/* Eye icon على اليمين */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-[50px] text-slate-500 hover:text-slate-700"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

            {/* Link to register if no account */}
            <div className="text-center mt-4">
              <p className="text-slate-600 italic">
      don't have an account?    {' '}
                <button
                  type="button"
                  onClick={() => navigate("/committee/register")}
                  className="text-[#f87115] font-bold hover:underline"
                >
        create account
                </button>
              </p>
            </div>

          </form>
        </div>

        {/* RIGHT SECTION – ANIMATION */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative p-10">
          <Lottie
            animationData={workTeamAnimation} // أو استبدلها بـ Idea Bulb.json
            loop={true}
            className="w-full h-[90%]"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginCommitteeMember;
