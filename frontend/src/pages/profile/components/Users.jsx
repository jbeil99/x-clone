import { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import UserInfo from '../../../components/tweet/UserInfo';
import { followers, followings, getUserByUsername } from '../../../api/users';

/**
 * Component to display a user's followers
 * @param {Object} props - Component props
 * @param {Array} props.followers - Array of follower user objects
 */
const Followers = ({ followers }) => {
    return (
        <div className="max-w-xl mx-auto">
            {followers.length > 0 ? (
                followers.map((user) => (
                    // Using user.id as unique key
                    <div className="w-full p-0 bg-black text-white border-t border-b border-gray-700" key={user.id}>
                        <UserInfo user={user} />
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">No followers yet</div>
            )}
        </div>
    );
};

/**
 * Component to display users that a user is following
 * @param {Object} props - Component props
 * @param {Array} props.following - Array of following user objects
 */
const Following = ({ following }) => {
    return (
        <div className="max-w-xl mx-auto">
            {following.length > 0 ? (
                following.map((user) => (
                    // Using user.id as unique key
                    <div className="w-full p-0 bg-black text-white border-t border-b border-gray-700" key={user.id}>
                        <UserInfo user={user} />
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">Not following anyone yet</div>
            )}
        </div>
    );
};

/**
 * Users component displays followers or following users for a specific profile
 */
export default function Users() {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = useParams();

    // Get the active tab from URL or default to 'followers'
    const [activeTab, setActiveTab] = useState(
        location.pathname.split('/')[3] || 'followers'
    );

    const [userData, setUserData] = useState(null);
    const [followersData, setFollowers] = useState([]);
    const [followingsData, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Update URL when tab changes
        navigate(`/profile/${username}/${tab}`);
    };

    // Determine which content to show based on active tab
    let content;
    if (loading) {
        content = <div className="text-center py-8">Loading...</div>;
    } else if (error) {
        content = <div className="text-center py-8 text-red-500">{error}</div>;
    } else if (activeTab === 'followers') {
        content = <Followers followers={followersData} />;
    } else if (activeTab === 'following') {
        content = <Following following={followingsData} />;
    }

    // Fetch user data and followers/following lists
    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Get user data first
                const userData = await getUserByUsername(username);

                if (!userData) {
                    setError("User not found");
                    return;
                }

                setUserData(userData);

                // Then fetch followers and following lists
                if (userData && userData.username) {
                    const [followersRes, followingsRes] = await Promise.all([
                        followers(userData.username),
                        followings(userData.username),
                    ]);

                    setFollowers(followersRes?.results || []);
                    setFollowings(followingsRes?.results || []);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header with back button and user info */}
            <div className="sticky top-0 z-10 bg-black backdrop-blur-md border-b border-gray-800">
                <div className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md px-4 py-3 flex items-center">
                    <Link className="mr-6" to={`/profile/${username}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="font-bold text-lg">
                            {userData?.display_name || username}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {userData?.tweets_count || 0} tweets
                        </p>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="flex border-b border-gray-800">
                    {['followers', 'following'].map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 py-3 text-center font-bold focus:outline-none text-white border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500' : 'border-transparent hover:bg-gray-900'
                                }`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content area */}
            <div className="p-4">
                {content}
            </div>
        </div>
    );
}