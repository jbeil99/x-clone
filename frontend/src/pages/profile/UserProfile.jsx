import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { Calendar, MapPin, Verified } from "lucide-react";
import NewPopupPage from "./NewPopupPage"; // Adjust the path if necessary

export default function UserProfile() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access");
        console.log("Access Token:", accessToken); // ✅ للتأكد أن التوكن موجود

        const response = await axios.get("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error.response?.data || error.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-black text-white">
      {/* Profile content */}
      <div className="relative">
        <div className="h-48 bg-blue-600"></div>
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-black overflow-hidden">
            <img
              src={userData.avatar || "/media/default_profile_400x400.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-20 px-4">
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 rounded-full font-bold bg-transparent border border-gray-600 hover:border-blue-500 hover:text-blue-500"
            onClick={() => setShowEditProfile(true)}
          >
            Edit Profile
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold">{userData.display_name || "N/A"}</h1>
            {userData.verified && <Verified className="w-5 h-5 text-blue-500" />}
          </div>
          <p className="text-gray-500">@{userData.username || "N/A"}</p>
        </div>

        <div className="mb-4">
          <p>{userData.bio || "No bio available."}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
          {userData.country && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{userData.country}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {userData.date_of_birth || "N/A"}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div>
            <span className="font-bold">{userData.followed_count}</span>{" "}
            <span className="text-gray-500">Following</span>
          </div>
          <div>
            <span className="font-bold">{userData.followers_count}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </div>
        </div>

        {showEditProfile && (
          <NewPopupPage
            user={userData}
            close={(updatedData) => {
              if (updatedData) {
                setUserData((prevData) => ({
                  ...prevData,
                  ...updatedData,
                }));
              }
              setShowEditProfile(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
