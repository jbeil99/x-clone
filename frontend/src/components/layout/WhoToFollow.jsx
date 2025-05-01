import { useEffect, useState } from "react"
import { getWhoToFollow, follow } from "../../api/users"
import { Link } from "react-router";

export default function WhoToFollow() {
    const [users, setUsers] = useState([]);

    const handleFollowToggle = async (u) => {
        try {
            const res = await follow(u.username);
            setUsers(users.map(user => {
                if (user.username === u.username) {
                    // Create a new object with all existing properties but toggle ifollow
                    return {
                        ...user,
                        ifollow: !user.ifollow
                    };
                }
                return user;
            }));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await getWhoToFollow();
                setUsers(res);
            } catch (e) {
                console.log(e.response);
            }
        };
        getUsers();
    }, []);

    return (
        <div className="bg-black border border-gray-800 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Who to follow</h2>
            <div className="space-y-4">
                {users.map((u, i) => (
                    <div className="flex items-center justify-between" key={u.id + i}>
                        <Link to={`/profile/${u.username}`}>
                            <div className="flex items-center gap-3">
                                <img src={u.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <div className="font-bold text-white">{u.display_name}</div>
                                    <div className="text-gray-400 text-sm">@{u.username}</div>
                                </div>
                            </div>
                        </Link>
                        <button
                            className={`rounded-full px-4 py-1 font-bold ${u.ifollow
                                ? "bg-transparent text-white border border-gray-600 hover:border-red-500 hover:text-red-500"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                            onClick={() => handleFollowToggle(u)}
                        >
                            {u.ifollow ? "Following" : "Follow"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}