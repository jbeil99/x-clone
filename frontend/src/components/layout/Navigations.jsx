import {
    Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Briefcase, Users, Zap, CheckCircle2, MessageCircle, Image, MapPin, Calendar, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function Navigations() {
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    const sidebarItems = [
        { icon: Home, text: 'Home', path: '/' },
        { icon: Search, text: 'Explore', path: '/explore' },
        { icon: Bell, text: 'Notifications', path: '/notifications' },
        { icon: Mail, text: 'Messages', path: '/messages' },
        { icon: Sparkles, text: 'Grok', path: '/grok' },
        { icon: Bookmark, text: 'Bookmarks', path: '/bookmarks' },
        { icon: Briefcase, text: 'Jobs', path: '/jobs' },
        { icon: Users, text: 'Communities', path: '/communities' },
        { icon: Zap, text: 'Premium', path: '/premium' },
        { icon: CheckCircle2, text: 'Verified Orgs', path: '/verified-orgs' },
        { icon: User, text: 'Profile', path: `/profile/${user?.username}` },
        { icon: MoreHorizontal, text: 'More', path: '/more' },
    ];

    return (
        <div className="flex flex-col w-[275px] px-4 py-4 border-r border-gray-800">
            <div>
                <div className="text-xl font-bold mb-8 ml-3">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                        <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
                    </svg>
                </div>
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.text}
                            to={item.path}
                            className="flex items-center gap-4 text-lg font-medium hover:bg-gray-900 px-4 py-3 rounded-full transition-colors"
                        >
                            <item.icon className="h-6 w-6" />
                            <span>{item.text}</span>
                        </Link>
                    ))}
                </nav>
                <button className="mt-6 w-full bg-white text-black rounded-full py-3 text-lg font-bold shadow hover:bg-gray-200 transition-colors">
                    Post
                </button>

                <div className="flex items-center gap-3 px-2 py-3 hover:bg-gray-900 rounded-full cursor-pointer mt-3">
                    <img src={user?.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{user?.name}</div>
                        <div className="text-gray-500 text-sm truncate">@{user?.username}</div>
                    </div>
                    <MoreHorizontal className="text-gray-500" />
                </div>
            </div>
        </div>
    )
}