import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Verified,
  ArrowLeft,
  Link as LinkIcon,
  Cake,
  BellOff,
  Bell,
  MoreHorizontal,
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
import { toast } from "react-toastify";
import { authAxios } from "../../api/useAxios";

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);
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
  const dispatch = useDispatch();
  const isProfile = user?.username === username || username === 'profile';
  const [isMuted, setIsMuted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await getUserByUsername(!username || username == 'profile' ? user?.username : username);
        setUserData(userData);
        setIsMuted(userData?.imuted || false); // Initialize mute state

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
          setMedia(mediaRes.results);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    dispatch(fetchCurrentUser());
  }, [username, dispatch]);

  const handleMute = async () => {
    if (userData?.id) {
      try {
        await authAxios.post(`/mute/${userData.id}/`);
        setIsMuted(true);
        toast.success(`Muted @${userData.username}`);
        setIsDropdownOpen(false);
      } catch (error) {
        console.error("Error muting user:", error);
        toast.error("Could not mute user.");
      }
    }
  };

  const handleUnmute = async () => {
    if (userData?.id) {
      try {
        await authAxios.delete(`/mute/${userData.id}/`);
        setIsMuted(false);
        toast.success(`Unmuted @${userData.username}`);
        setIsDropdownOpen(false);
      } catch (error) {
        console.error("Error unmuting user:", error);
        toast.error("Could not unmute user.");
      }
    }
  };

  const handleReportUser = () => {
    if (userData?.username) {
      toast.info(`Reporting user @${userData.username}`);
      setIsDropdownOpen(false);
      // Implement your report user logic here
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return <Loader />;
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
      <div className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link className="mr-6" to="/">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-bold text-lg">
            {userData?.display_name || "Profile"}
          </h2>
          <p className="text-xs text-gray-500">
            {userData?.tweets_count || 0} tweets
          </p>
        </div>
        {!isProfile && userData && (
          <div className="relative">
            <button onClick={toggleDropdown} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-md shadow-md z-20">
                <button
                  onClick={isMuted ? handleUnmute : handleMute}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${isMuted ? 'text-blue-500' : 'text-white'}`}
                >
                  {isMuted ? <><Bell className="w-4 h-4 inline mr-2" /> Unmute</> : <><BellOff className="w-4 h-4 inline mr-2" /> Mute</>}
                </button>
                <button
                  onClick={handleReportUser}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  Report User
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ProfileInfo userData={userData} isProfile={isProfile} setIsOpen={setIsOpen} />

      <div className=" px-4">
        <div className="mb-3 flex items-center">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold">
              {userData?.display_name || "User"}
            </h1>
            {userData?.verified && (
              <Verified className="w-5 h-5 text-blue-500" />
            )}
          </div>
          {!isProfile && userData && isMuted && (
            <button onClick={handleUnmute} className="bg-transparent border border-blue-500 text-blue-500 font-semibold rounded-full w-8 h-8 flex items-center justify-center ml-2">
              <BellOff className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-gray-500">@{userData?.username || "username"}</p>

        {userData?.bio && (
          <div className="mb-3">
            <p>{userData.bio}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-y-1 text-gray-500 text-sm mb-3">
          {userData?.country && (
            <div className="flex items-center gap-1 mr-3">
              <MapPin className="w-4 h-4" />
              <span>{userData.country}</span>
            </div>
          )}
          {userData?.website && (
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
          {userData?.date_joined && (
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
          {userData?.date_of_birth && (
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
          <Link to={`/profile/${userData?.username}/following`}>
            <div>
              <span className="font-bold">{userData?.following_count || 0}</span>{" "}
              <span className="text-gray-500">Following</span>
            </div>
          </Link>
          <Link to={`/profile/${userData?.username}/followers`}>
            <div>
              <span className="font-bold">{userData?.followers_count || 0}</span>{" "}
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
                tweets.map((tweet) => (
                  <Tweet key={tweet.id} tweet={tweet} user={isProfile ? undefined : userData} />
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
                  <Tweet key={reply.id} tweet={reply} />
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
                  {media.map((mediaItem) => (
                    <Link key={mediaItem.id} to={`/status/${mediaItem.tweet}`}>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        {mediaItem.file_url.endsWith('.mp4') || mediaItem.file_url.endsWith('.mov') ? (
                          <video
                            src={mediaItem.file_url}
                            alt="User Media"
                            className="w-full h-40 object-cover aspect-video"
                          />
                        ) : (
                          <img
                            src={mediaItem.file_url}
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
                  <Tweet key={tweet.id} tweet={tweet} />
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