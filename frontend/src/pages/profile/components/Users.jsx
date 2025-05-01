import { useState, useEffect } from 'react';
import UserInfo from '../../../components/tweet/UserInfo';
import {
    ArrowLeft,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { followers, followings, getUserByUsername } from '../../../api/users';


const Followers = ({ followers }) => (
    < div className="max-w-xl mx-auto" >
        {
            followers.map((user, i) => (
                <div className="w-full p-0 bg-black text-white border-t border-b border-gray-700" key={user.id + i}>
                    <UserInfo user={user} />
                </div>
            ))
        }
    </div >
);


const Following = ({ following }) => (
    <div className="max-w-xl mx-auto">
        {following.map((user, i) => (
            <div className="w-full p-0 bg-black text-white border-t border-b border-gray-700" key={user.id + i}>
                <UserInfo user={user} />
            </div>
        ))}
    </div>
);

export default function Users({ top, latest }) {
    const [activeTab, setActiveTab] = useState('Followers');
    const [userData, setUserData] = useState(null);
    const [followersData, setFollowers] = useState([]);
    const [followingsData, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();

    let content;
    if (activeTab === 'Followers') content = <Followers followers={followersData} />;
    else if (activeTab === 'Following') content = <Following following={followingsData} />;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userData = await getUserByUsername(username);
                setUserData(userData);
                if (userData && userData.id) {
                    const [followersRes, followingsRes] = await Promise.all([
                        followers(userData.username),
                        followings(userData.username),
                    ]);

                    setFollowers(followersRes.results);
                    setFollowings(followingsRes.results);
                }
            } catch (error) {
                console.error("Error fetching profile, tweets, likes, or replies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="sticky top-0 z-10 bg-black backdrop-blur-md border-b border-gray-800">
                <div className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md px-4 py-3 flex items-center">
                    <Link className="mr-6" to={`/profile/${userData?.username}`}>
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
                </div>
                <div className="flex border-b border-gray-800">
                    {['Followers', 'Following'].map(tab => (
                        <button
                            key={tab}
                            className={`flex-1 py-3 text-center font-bold focus:outline-none text-white border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500' : 'border-transparent hover:bg-gray-900'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4">
                {content}
            </div>
        </div>
    );
} 