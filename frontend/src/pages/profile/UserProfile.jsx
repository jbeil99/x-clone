import { useState, useEffect } from "react";
import axios from "axios"; // ✅ أضفنا import axios
import { Calendar, Link, MapPin, Verified } from "lucide-react";
import Tweet from "../../components/Tweet";
import TabButton from "./components/TabButton";
import Loader from "../../components/Loader";
import EmptyState from "./components/EmptyState";
import NewPopupPage from "./NewPopupPage";
import { authAxios } from "../../api/useAxios";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const contentMap = {
    posts: userData?.posts || [],
    replies: userData?.replies || [],
    media: userData?.media || [],
    likes: userData?.likes || [],
  };

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

  const getTabContent = () => {
    return contentMap[activeTab] || [];
  };

  const renderContentSection = () => {
    if (loading) {
      return <Loader />;
    }

    const content = getTabContent();

    if (content.length === 0) {
      return <EmptyState tabName={activeTab} />;
    }

    return (
      <div className="divide-y divide-gray-800">
        {content.map((item) => (
          <Tweet key={item.id} tweet={item} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Failed to load profile data</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-black text-white">
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
          {isLoggedIn ? (
            <button
              className="px-4 py-2 rounded-full font-bold bg-transparent border border-gray-600 hover:border-blue-500 hover:text-blue-500"
              onClick={() => setShowEditProfile(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className={`px-4 py-2 rounded-full font-bold ${
                following
                  ? "bg-transparent border border-gray-600 hover:border-red-500 hover:text-red-500"
                  : "bg-white text-black"
              }`}
              onClick={() => setFollowing(!following)}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
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

        <div className="flex border-b border-gray-800">
          <TabButton
            name="posts"
            label="Posts"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            name="replies"
            label="Replies"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            name="media"
            label="Media"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            name="likes"
            label="Likes"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {renderContentSection()}
      </div>

      {showEditProfile && (
        <NewPopupPage
          user={{
            name: userData.display_name,
            bio: userData.bio,
            location: userData.country,
            avatar: userData.avatar,
            cover_image: userData.cover_image,
          }}
          close={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
}
