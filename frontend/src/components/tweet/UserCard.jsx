import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function UserCard({ username, match }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                    {match[1]}
                </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 p-0 bg-black text-white border border-gray-700">
                <div className="relative">
                    {/* Profile header with Follow button */}
                    <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar className="border-2 border-black">
                                <AvatarImage src={`https://avatar.vercel.sh/${username}`} />
                                <AvatarFallback className="bg-gray-800 text-white">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="max-w-32 overflow-hidden">
                                <h4 className="font-bold truncate">{username.length > 15 ? `${username.substring(0, 15)}...` : username}</h4>
                                <p className="text-sm text-gray-400 truncate">@{username.toLowerCase()}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="rounded-full text-sm font-medium bg-white text-black hover:bg-gray-200 border-none">
                            Follow
                        </Button>
                    </div>

                    <div className="px-3 pb-2">
                        <p className="text-sm">I hunt down time travelers</p>
                        <a href="#" className="text-sm text-blue-500 hover:underline">youtube.com/@LiteraRealm</a>
                    </div>

                    <div className="px-3 pb-3 flex space-x-4 text-sm">
                        <div>
                            <span className="font-bold">167</span>
                            <span className="text-gray-400 ml-1">Following</span>
                        </div>
                        <div>
                            <span className="font-bold">15</span>
                            <span className="text-gray-400 ml-1">Followers</span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}