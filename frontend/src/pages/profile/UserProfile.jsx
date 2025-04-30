import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Verified,
  ArrowLeft,
  Link,
  Cake,
} from "lucide-react";
import EditProfile from "./EditProfile";
import { getUserProfile } from "../../api/users";
import { authAxios } from "../../api/useAxios";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [replies, setReplies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");

  const { userId } = useParams();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await getUserProfile(userId);
        setUserData(res);
        console.log("User data:", res);

        if (res && res.id) {
          const tweetRes = await authAxios.get(
            `http://127.0.0.1:8000/profile/tweets/${res.id}/`
          );
          setTweets(tweetRes.data);
          console.log("Fetched tweets:", tweetRes.data);

          const likesRes = await authAxios.get(
            `http://127.0.0.1:8000/profile/tweets/likes/${res.id}/`
          );
          setLikedTweets(likesRes.data);

          const repliesRes = await authAxios.get(
            `http://127.0.0.1:8000/profile/tweets/replies/${res.id}/`
          );
          setReplies(repliesRes.data);
        }
      } catch (error) {
        console.error("Error fetching profile, tweets, likes, or replies:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileData();
  }, [userId]);

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
    { id: "likes", label: "Likes" },
  ];

  return (
    <div className="max-w-xl mx-auto bg-black text-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md px-4 py-3 flex items-center">
        <button className="mr-6">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-lg">
            {userData.display_name || "Profile"}
          </h2>
          <p className="text-xs text-gray-500">
            {userData.tweets_count || 0} tweets
          </p>
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
              src={
                userData.avatar_url || "/media/default_profile_400x400.png"
              }
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
            <h1 className="text-xl font-bold">
              {userData.display_name || "User"}
            </h1>
            {userData.verified && (
              <Verified className="w-5 h-5 text-blue-500" />
            )}
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
              <a
                href={userData.website}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {userData.website.replace(/(https?:\/\/)?(www\.)?/, "")}
              </a>
            </div>
          )}
          {userData.date_joined && (
            <div className="flex items-center gap-1 mr-3">
              <Calendar className="w-4 h-4" />
              <span>
                Joined{" "}
                {new Date(userData.date_joined).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
          {userData.date_of_birth && (
            <div className="flex items-center gap-1">
              <Cake className="w-4 h-4" />
              <span>
                Born{" "}
                {new Date(userData.date_of_birth).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-3 relative font-medium text-sm hover:bg-gray-900 ${
                activeTab === tab.id ? "text-white" : "text-gray-500"
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

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === "tweets" && (
            <>
              {tweets.length > 0 ? (
                tweets.map((tweet) => (
                  <div key={tweet.id} className="py-2 border-b border-gray-800">
                    <p>{tweet.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No tweets yet</div>
              )}
            </>
          )}

          {activeTab === "replies" && (
            <>
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <div key={reply.id} className="py-2 border-b border-gray-800">
                    <p>{reply.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No replies yet</div>
              )}
            </>
          )}

          {activeTab === "media" && (
            <>
              {tweets.filter((tweet) => tweet.media_url).length > 0 ? (
                tweets
                  .filter((tweet) => tweet.media_url)
                  .map((tweet) => (
                    <div key={tweet.id} className="py-2 border-b border-gray-800">
                      <p>{tweet.content}</p>
                      <img
                        src={tweet.media_url}
                        alt="Tweet Media"
                        className="mt-2 rounded-lg max-w-full"
                      />
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500 py-8">No media content</div>
              )}
            </>
          )}

          {activeTab === "likes" && (
            <>
              {likedTweets.length > 0 ? (
                likedTweets.map((tweet) => (
                  <div key={tweet.id} className="py-2 border-b border-gray-800">
                    <p>{tweet.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No liked tweets
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile open={isOpen} onClose={handleClose} />
    </div>
  );
}
