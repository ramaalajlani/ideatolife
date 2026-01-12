// src/pages/dashboardcommit/CommitteeProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, MessageSquare, Upload, Save, X, Briefcase, Users, ChevronLeft } from "lucide-react";

function CommitteeProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [committeeData, setCommitteeData] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    profile_image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return `http://127.0.0.1:8000${imagePath}`;
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  const fetchData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("committee_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [profileRes, committeeRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/profile_member", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://127.0.0.1:8000/api/my-committee/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const userData = profileRes.data.committee_member;
      setProfileData(userData);
      setCommitteeData(committeeRes.data.data);
      
      setFormData({
        phone: userData.phone || "",
        bio: userData.bio || "",
        profile_image: null
      });
      
      if (userData.profile_image) {
        setImagePreview(getImageUrl(userData.profile_image));
      }
    } catch (error) {
      console.error("Data fetch error:", error);
      setError("Failed to load profile data");
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem("committee_token");
      const data = new FormData();
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      if (formData.profile_image) data.append('profile_image', formData.profile_image);
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/profile/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedProfile = response.data.profile;
      setProfileData(updatedProfile);
      if (updatedProfile.profile_image) setImagePreview(getImageUrl(updatedProfile.profile_image));
      
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }
      setFormData({ ...formData, profile_image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="ltr">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate("/committee-dashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2 group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Member Profile</h1>
            <p className="text-slate-500">Manage your personal information and committee details</p>
          </div>
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-16 w-16 text-slate-300" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                        <Upload className="h-4 w-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-transparent">
                        {profileData?.name}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-transparent">
                        {profileData?.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="+1 234 567 890"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-transparent">
                        {profileData?.phone || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Biography</label>
                    {isEditing ? (
                      <textarea
                        rows="4"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-transparent min-h-[100px] whitespace-pre-wrap">
                        {profileData?.bio || "No biography added yet."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-indigo-500" />
                Committee Info
              </h2>
              
              {committeeData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Committee Name</p>
                    <p className="font-bold text-slate-800">{committeeData.committee_name}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Your Role</p>
                    <p className="font-bold text-slate-800">{committeeData.my_role}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      committeeData.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {committeeData.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-4">No committee data available</p>
              )}
            </div>

            {/* Team Members List */}
            {committeeData?.members && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Committee Members</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {committeeData.members.map((member) => (
                    <div key={member.id} className={`flex items-center gap-3 p-2 rounded-lg ${member.is_me ? 'bg-blue-50' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {member.name} {member.is_me && "(You)"}
                        </p>
                        <p className="text-xs text-slate-500">{member.role_in_committee}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.3s ease-out fill-mode: forwards; }
      `}</style>
    </div>
  );
}

export default CommitteeProfile;