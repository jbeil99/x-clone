import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Verified,
  ArrowLeft,
  Link as LinkIcon,
  Cake,
} from "lucide-react";
import { Link } from "react-router-dom";

import EditProfile from "./components/EditProfile";
import { getUserByUsername } from "../../api/users";
import { useParams } from "react-router-dom";
import { getUserLikes, getUserReplies, getUserTweets, getUserMedia } from "../../api/tweets";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/auth";
import Tweet from "../../components/tweet/Tweet";
import ProfileInfo from "./components/ProfileInfo";
import Loader from "../../components/Loader";

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [replies, setReplies] = useState([]);
  const [media, setMedia] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");
  const { username } = useParams();
  const handleClose = () => setIsOpen(false);
  const dispatch = useDispatch()
  const isProfile = user?.username === username || username === 'profile'

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await getUserByUsername(!username || username == 'profile' ? user?.username : username);
        setUserData(userData);
        if (userData && userData.id) {
          const [tweetRes, likesRes, repliesRes, mediaRes] = await Promise.all([
            getUserTweets(userData.id),
            getUserLikes(userData.id),
            getUserReplies(userData.id),
            getUserMedia(userData?.username)
          ]);

          setTweets(tweetRes);
          setLikedTweets(likesRes);
          setReplies(repliesRes);
          setMedia(mediaRes.results)
        }
      } catch (error) {
        console.error("Error fetching profile, tweets, likes, or replies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    dispatch(fetchCurrentUser())
  }, [username]);



  if (loading) {
    return <Loader />
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
        <Link className="mr-6" to="/">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-bold text-lg">
            {userData.display_name || "Profile"}
          </h2>
          <p className="text-xs text-gray-500">
            {userData.tweets_count || 0} tweets
          </p>
        </div>
      </div>

      <ProfileInfo userData={userData} isProfile={isProfile} setIsOpen={setIsOpen} />

      <div className=" px-4">
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
              <LinkIcon className="w-4 h-4" />
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
          <Link to={`/profile/${user.username}/followers`}>
            <div>
              <span className="font-bold">{userData.following_count || 0}</span>{" "}
              <span className="text-gray-500">Following</span>
            </div>
          </Link>
          <Link to={`/profile/${user.username}/followers`}>
            <div>
              <span className="font-bold">{userData.followers_count || 0}</span>{" "}
              <span className="text-gray-500">Followers</span>
            </div>
          </Link>

        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 flex mt-4">
          {tabs.map((tab) => (
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

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === "tweets" && (
            <>
              {tweets.length > 0 ? (
                tweets.map((tweet) => {
                  if (isProfile) {
                    return <Tweet tweet={tweet} />
                  }
                  return <Tweet tweet={tweet} user={userData} />
                })
              ) : (
                <div className="text-center text-gray-500 py-8">No tweets yet</div>
              )}
            </>
          )}

          {activeTab === "replies" && (
            <>
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <Tweet tweet={reply} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No replies yet</div>
              )}
            </>
          )}

          {activeTab === "media" && (
            <>
              {media && media.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((media) => (
                    <Link to={`/status/${media.tweet}`}>
                      <div key={media.id} className="rounded-lg overflow-hidden shadow-md">
                        {media.file_url.endsWith('.mp4') || media.file_url.endsWith('.mov') ? (
                          <video
                            src={media.file_url}
                            alt="User Media"
                            className="w-full h-40 object-cover aspect-video"
                          />
                        ) : (
                          <img
                            src={media.file_url}
                            alt="User Media"
                            className="w-full h-40 object-cover aspect-square"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">No media content available</div>
              )}
            </>
          )}

          {activeTab === "likes" && (
            <>
              {likedTweets.length > 0 ? (
                likedTweets.map((tweet) => (
                  <Tweet tweet={tweet} />
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

      <EditProfile open={isOpen} onClose={handleClose} setUserData={setUserData} />
    </div>
  );
}
