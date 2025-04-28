import { useState, useEffect } from "react";
import { Calendar, Link, MapPin, Verified } from "lucide-react";
import Tweet from "../../components/Tweet";
import TabButton from "./components/TabButton"; // Use the imported TabButton
import Loader from "../../components/Loader";
import EmptyState from "./components/EmptyState";
import NewPopupPage from "./NewPopupPage"; // Import NewPopupPage component

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditProfile, setShowEditProfile] = useState(false); // Modal state
  const [following, setFollowing] = useState(false); // Following state
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate logged-in state

  const contentMap = {
    posts: userData?.posts || [],
    replies: userData?.replies || [],
    media: userData?.media || [],
    likes: userData?.likes || [],
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = sessionStorage.getItem("access");
      if (!token) {
        console.error("Access token is missing");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Profile data fetched successfully:", response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error.response || error);
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
        {/* Add Edit Profile or Follow Button */}
        <div className="flex justify-end mb-4">
          {isLoggedIn ? (
            <button
              className="px-4 py-2 rounded-full font-bold bg-transparent border border-gray-600 hover:border-blue-500 hover:text-blue-500"
              onClick={() => setShowEditProfile(true)} // Open the modal
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

        {/* Tabs Section */}
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

        {/* Content based on active tab */}
        {renderContentSection()}
      </div>

      {/* Render NewPopupPage as a modal */}
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
