"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import Newideajson from '../assets/animations/New idea.json';
import { Plus } from 'lucide-react';

// Services
import profileService from '../services/profileService';
import ideaService from '../services/ideaService';

// Components
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import IdeasList from '../components/profile/IdeasList';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Fetch Profile and Ideas Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب البروفايل أولاً
      const profileResponse = await profileService.getProfile();

      // تنسيق بيانات البروفايل لتتناسب مع Sidebar
      const formattedProfile = {
        profile: {
          phone: profileResponse.idea_owner.phone || "",
          profile_image: profileResponse.idea_owner.profile_image,
          bio: profileResponse.idea_owner.bio || ""
        },
        name: profileResponse.idea_owner.name,
        email: profileResponse.idea_owner.email,
        user_type: profileResponse.idea_owner.role,
        idea: profileResponse.idea_owner.idea
      };

      setProfileData(formattedProfile);

      // محاولة جلب الأفكار (اختياري)
      try {
        const ideasResponse = await profileService.getMyIdeas();
        setIdeas(ideasResponse.ideas || []);

        const ideaList = ideasResponse.ideas || [];
        setStats({
          totalIdeas: ideaList.length,
          approvedIdeas: ideaList.filter(idea => 
            idea.status === 'approved' || idea.status === 'active'
          ).length,
          pendingIdeas: ideaList.filter(idea => idea.status === 'pending').length
        });
      } catch (ideasError) {
        console.log('Ideas not loaded:', ideasError.message);
        setIdeas([]);
        setStats({
          totalIdeas: 0,
          approvedIdeas: 0,
          pendingIdeas: 0
        });
      }

    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      setUpdatingProfile(true);

      const formData = new FormData();
      formData.append("phone", updatedData.phone);
      formData.append("bio", updatedData.bio);

      if (updatedData.profile_image) {
        formData.append("profile_image", updatedData.profile_image);
      }

      const response = await profileService.updateProfile(formData);

      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          phone: response.profile.phone,
          bio: response.profile.bio,
          profile_image: response.profile.profile_image
        }
      }));

      return response;
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Function to handle navigation to IdeaSubmissionForm
  const handleNavigateToIdeaSubmission = () => {
    navigate('/submit-idea');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto py-12">
          <div className="container mx-auto px-4">
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} onRetry={() => setError(null)} />
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              <ProfileSidebar
                profile={profileData}
                stats={stats}
                onEditProfile={handleUpdateProfile}
                updating={updatingProfile}
              />

              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">My Ideas & Projects</h2>
                    <div className="text-sm font-normal text-slate-500 mt-1">
                      {ideas.length > 0 
                        ? `You have ${ideas.length} idea${ideas.length > 1 ? 's' : ''}`
                        : "Start by adding your first idea"
                      }
                    </div>
                  </div>
                  <div className="w-48 h-48">
                    <Lottie animationData={Newideajson} loop={true} className="w-full h-full" />
                  </div>
                </div>

                {/* زر إضافة فكرة جديد */}
                <div 
                  onClick={handleNavigateToIdeaSubmission} 
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-6 mb-8 cursor-pointer hover:shadow-md transition-shadow hover:bg-blue-50 active:bg-blue-100"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-blue-300 flex items-center justify-center shadow-lg">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Start New Idea</h3>
                      <p className="text-slate-600">
                        Click here to add a new idea and start your journey towards innovation
                      </p>
                      <div className="mt-2 text-sm text-blue-600 font-medium">
                        Navigates to idea submission form →
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <IdeasList ideas={ideas} onIdeaClick={(idea) => {
                  // يمكنك إضافة تنقل إلى صفحة تفاصيل الفكرة هنا
                  console.log('Idea clicked:', idea);
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;