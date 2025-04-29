import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Verified, ArrowLeft, Link, Cake } from "lucide-react";
import EditProfile from "./EditProfile";
import { getUserProfile } from "../../api/users";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await getUserProfile();
        setUserData(res);
      } catch (error) {
        console.error("Error fetching profile data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "tweets", label: "Tweets" },
    { id: "replies", label: "Replies" },
    { id: "media", label: "Media" },
    { id: "likes", label: "Likes" }
  ];

  return (
    <div className="max-w-xl mx-auto bg-black text-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md px-4 py-3 flex items-center">
        <button className="mr-6">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-lg">{userData.display_name || "Profile"}</h2>
          <p className="text-xs text-gray-500">{userData.tweets_count || 0} tweets</p>
        </div>
      </div>

      {/* Cover & Avatar */}
      <div className="relative">
        <div className="h-48 bg-gray-800">
          {userData.cover_url && (
            <img
              src={userData.cover_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-black overflow-hidden">
            <img
              src={userData.avatar_url || "/media/default_profile_400x400.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            className="px-4 py-1.5 rounded-full font-bold bg-transparent border border-gray-600 hover:border-gray-400 text-sm"
            onClick={handleOpen}
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-4">
        <div className="mb-3">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold">{userData.display_name || "User"}</h1>
            {userData.verified && <Verified className="w-5 h-5 text-blue-500" />}
          </div>
          <p className="text-gray-500">@{userData.username || "username"}</p>
        </div>

        {userData.bio && (
          <div className="mb-3">
            <p>{userData.bio}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-y-1 text-gray-500 text-sm mb-3">
          {userData.country && (
            <div className="flex items-center gap-1 mr-3">
              <MapPin className="w-4 h-4" />
              <span>{userData.country}</span>
            </div>
          )}
          {userData.website && (
            <div className="flex items-center gap-1 mr-3">
              <Link className="w-4 h-4" />
              <a href={userData.website} className="text-blue-500 hover:underline">
                {userData.website.replace(/(https?:\/\/)?(www\.)?/, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1 mr-3">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(userData.date_joined || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          {userData.date_of_birth && (
            <div className="flex items-center gap-1">
              <Cake className="w-4 h-4" />
              <span>Born {new Date(userData.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="flex gap-5 mb-4 text-sm">
          <div>
            <span className="font-bold">{userData.followed_count || 0}</span>{" "}
            <span className="text-gray-500">Following</span>
          </div>
          <div>
            <span className="font-bold">{userData.followers_count || 0}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 flex mt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-1 py-3 relative font-medium text-sm hover:bg-gray-900 ${activeTab === tab.id ? "text-white" : "text-gray-500"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area - Replace with actual tweet components later */}
        <div className="py-4">
          {activeTab === "tweets" && (
            <div className="text-center text-gray-500 py-8">
              No tweets yet
            </div>
          )}
        </div>
      </div>

      <EditProfile
        open={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}