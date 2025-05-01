import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { follow } from '../../api/users';

export default function UserInfo({ user, isFollowing, setIsFollowing }) {
    const handleFollowToggle = async () => {
        try {
            const res = await follow(user?.username);
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.log(e)
        }
    };
    return (
        <div className="relative">
            {/* Profile header with Follow button */}
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Avatar className="border-2 border-black">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-gray-800 text-white">{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-32 overflow-hidden">
                        <h4 className="font-bold truncate">{user?.username.length > 15 ? `${user?.username.substring(0, 15)}...` : user?.username}</h4>
                        <p className="text-sm text-gray-400 truncate">@{user?.username.toLowerCase()}</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-full text-sm font-medium bg-white text-black hover:bg-gray-200 border-none" onClick={handleFollowToggle}>
                    {isFollowing ? "Following" : "Follow"}
                </Button>
            </div>

            <div className="px-3 pb-2">
                <p className="text-sm">{user?.bio ? user.bio : ""}</p>
            </div>

            <div className="px-3 pb-3 flex space-x-4 text-sm">
                <div>
                    <span className="font-bold">{user?.followers_count}</span>
                    <span className="text-gray-400 ml-1">Following</span>
                </div>
                <div>
                    <span className="font-bold">{user?.followed_count}</span>
                    <span className="text-gray-400 ml-1">Followers</span>
                </div>
            </div>
        </div>
    )
}