import { useState, useEffect } from "react";
import { Calendar, Link, MapPin, Verified } from "lucide-react";
import Tweet from "../../components/Tweet";
import TabButton from "./components/TabButton";
import Loader from "../../components/Loader";
import EmptyState from "./components/EmptyState";
import EditProfile from "./EditProfile"; // Import EditProfile component
import axios from "axios";

export default function TwitterProfile() {
  const [showEditProfile, setShowEditProfile] = useState(false); // State to control modal visibility
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [contentMap, setContentMap] = useState({
    posts: [],
    replies: [],
    media: [],
    likes: [],
  });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchProfileData = async () => {
      setLoading(true);

      try {
        const response = await axios.get("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newContentMap = {
          posts: response.data.posts || [],
          replies: response.data.replies || [],
          media: response.data.media || [],
          likes: response.data.likes || [],
        };

        setContentMap(newContentMap);
        setFollowersCount(response.data.followers_count);
        setFollowingCount(response.data.following_count);
      } catch (error) {
        console.error("Failed to fetch profile data:", error.response || error);
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

  return (
    <div className="max-w-xl mx-auto bg-black text-white">
      <div className="relative">
        <div className="h-48 bg-blue-600"></div>
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-black"></div>
        </div>
      </div>

      <div className="pt-20 px-4">
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
            <h1 className="text-xl font-bold">Tech Innovations</h1>
            <Verified className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-500">@techinnovate</p>
        </div>

        <div className="mb-4">
          <p>
            Building the future of technology. Official account for Tech
            Innovations - where ideas become reality.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-1">
            <Link className="w-4 h-4" />
            <span className="text-blue-500">techinnovations.com</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined March 2018</span>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div>
            <span className="font-bold">{followingCount}</span>{" "}
            <span className="text-gray-500">Following</span>
          </div>
          <div>
            <span className="font-bold">{followersCount}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </div>
        </div>

        {/* Navigation Tabs */}
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

      {/* Render EditProfile as a modal */}
      {showEditProfile && (
        <EditProfile
          user={{
            name: "Tech Innovations",
            bio: "Building the future of technology.",
            avatar: null,
            cover_image: null,
          }}
          close={() => setShowEditProfile(false)} // Close the modal
        />
      )}
    </div>
  );
}
