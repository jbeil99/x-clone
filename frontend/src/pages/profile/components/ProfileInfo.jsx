import { useState } from "react";
import { follow } from "../../../api/users";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileInfo({ userData, isProfile, setIsOpen, username }) {
    const [isFollowing, setIsFollowing] = useState(userData?.ifollow);
    const navigate = useNavigate();
    
    const handleFollowToggle = async () => {
        try {
            const res = await follow(userData.username);
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.log(e)
        }
    };
    
    const handleOpen = () => setIsOpen(true);
    
    // Open chat with the user
    const openChat = () => {
        // Store selected user information in localStorage to access it in messages page
        localStorage.setItem('selectedChatUser', JSON.stringify({
            id: userData.id,
            username: userData.username,
            avatar_url: userData.avatar_url || "/media/default_profile_400x400.png",
            display_name: userData.display_name
        }));
        
        // Navigate to messages page
        navigate('/messages');
    };

    return (
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
            <div className="flex justify-between items-start px-4 pt-3 pb-3">
                <div className="relative -mt-16">
                    <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-black overflow-hidden">
                        <img
                            src={userData.avatar_url || "/media/default_profile_400x400.png"}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex gap-2 mt-2">
                    {isProfile ? (
                        <button
                            className="px-4 py-1.5 rounded-full font-bold bg-transparent border border-gray-600 hover:border-gray-400 text-sm"
                            onClick={handleOpen}
                        >
                            Edit profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-1.5 rounded-full font-bold text-sm ${isFollowing
                                    ? "bg-transparent border border-gray-600 hover:border-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                    : "bg-white text-black border border-white hover:bg-gray-200"
                                    }`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                            
                            {/* Message button */}
                            <button
                                className="p-2 rounded-full bg-transparent border border-gray-600 hover:border-gray-400 text-sm flex items-center justify-center"
                                onClick={openChat}
                                title="Message"
                            >
                                <MessageCircle size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}