"use client";

import { Mail, Phone, Edit, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const serverUrl = "http://127.0.0.1:8000";

const ProfileSidebar = ({ profile, onEditProfile, updating }) => {
  const ideaOwner = profile?.profile || {};
  const name = profile?.name || "User";
  const email = profile?.email || "";

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: ideaOwner.phone || "",
    bio: ideaOwner.bio || "",
    profile_image: null
  });

  const [imagePreview, setImagePreview] = useState(
    ideaOwner.profile_image ? `${serverUrl}${ideaOwner.profile_image}` : ""
  );

  const fileInputRef = useRef(null);

  const getDefaultAvatar = (name) => {
    const initials = name ? name.charAt(0).toUpperCase() : "U";
    return `https://ui-avatars.com/api/?name=${initials}&background=007bff&color=fff&size=150`;
  };

  useEffect(() => {
    const owner = profile?.profile || {};
    setEditData({
      phone: owner.phone || "",
      bio: owner.bio || "",
      profile_image: null
    });

    setImagePreview(
      owner.profile_image ? `${serverUrl}${owner.profile_image}` : getDefaultAvatar(profile?.name)
    );
  }, [profile]);

  const handleSave = async () => {
    try {
      const response = await onEditProfile(editData);

      if (!response?.profile) return;

      setImagePreview(
        response.profile.profile_image
          ? `${serverUrl}${response.profile.profile_image}`
          : getDefaultAvatar(name)
      );

      setEditData({
        phone: response.profile.phone,
        bio: response.profile.bio,
        profile_image: null
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditData({ ...editData, profile_image: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="lg:w-1/3 bg-white border rounded-xl shadow p-6">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <img
            src={imagePreview || getDefaultAvatar(name)}
            alt="avatar"
            className="w-full h-full object-cover"
          />

          {isEditing && (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        <h2 className="text-xl font-bold">{name}</h2>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-blue-600 border px-3 py-1 rounded-lg"
        >
          <Edit size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* BIO */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Bio</h3>
        {isEditing ? (
          <textarea
            className="w-full border rounded-lg p-2"
            rows={4}
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
          />
        ) : (
          <p className="p-3 bg-slate-50 rounded-lg">{ideaOwner.bio || "No bio added"}</p>
        )}
      </div>

      {/* CONTACT */}
      <div>
        <h3 className="font-semibold mb-2">Contact</h3>
        <div className="p-4 bg-slate-50 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p>{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <p>{ideaOwner.phone || "No phone added"}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <button
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg"
          disabled={updating}
          onClick={handleSave}
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      )}
    </div>
  );
};

export default ProfileSidebar;
