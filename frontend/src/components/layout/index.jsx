import { Link } from 'react-router-dom';
import {
    Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Briefcase, Users, Zap, CheckCircle2, MessageCircle, Image, MapPin, Calendar, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
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
        { icon: User, text: 'Profile', path: '/profile' },
        { icon: MoreHorizontal, text: 'More', path: '/more' },
    ];

    const user = {
        name: 'mahmoud essa',
        username: '@mahmoudess61320',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    };

    const [pollQuestion, setPollQuestion] = useState("");

    return (
        <div className="min-h-screen bg-black text-white flex justify-center">
            <div className="flex w-full max-w-[1280px]">
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
                            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{user.name}</div>
                                <div className="text-gray-500 text-sm truncate">{user.username}</div>
                            </div>
                            <MoreHorizontal className="text-gray-500" />
                        </div>
                    </div>
                </div>

                <main className="flex-1 min-w-0 border-r border-gray-800 flex justify-center">
                    <div className="w-full max-w-[750px] px-4">

                        {children}
                    </div>
                </main>

                <div className="w-[350px] px-4 py-4">
                    <div className="bg-black border border-gray-800 rounded-2xl mb-4">
                        <div className="flex items-center px-4 py-2">
                            <Search className="h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent ml-2 outline-none w-full text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                    <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
                        <h2 className="text-xl font-bold mb-4 text-white">Subscribe to Premium</h2>
                        <p className="mb-4 text-white">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                        <button className="bg-blue-500 text-white rounded-full py-2 px-4 font-bold">
                            Subscribe
                        </button>
                    </div>
                    <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
                        <h2 className="text-xl font-bold mb-4 text-white">What's happening</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-400">Trending in Egypt</div>
                                <div className="font-bold text-white">#TrendingTopic</div>
                                <div className="text-sm text-gray-400">1,431 posts</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Trending in Egypt</div>
                                <div className="font-bold text-white">The Tripartite Aggression</div>
                                <div className="text-sm text-gray-400">2,715 posts</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Trending in Egypt</div>
                                <div className="font-bold text-white">American Prisons</div>
                                <div className="text-sm text-gray-400">1,428 posts</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Trending in Egypt</div>
                                <div className="font-bold text-white">#End_American_Presence_Demand</div>
                                <div className="text-sm text-gray-400">50.4K posts</div>
                            </div>
                        </div>
                        <button className="text-blue-500 hover:underline mt-2">Show more</button>
                    </div>

                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <h2 className="text-xl font-bold mb-4 text-white">Who to follow</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="font-bold text-white">hussien</div>
                                        <div className="text-gray-400 text-sm">@Al Doctor</div>
                                    </div>
                                </div>
                                <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="font-bold text-white">ON Sport</div>
                                        <div className="text-gray-400 text-sm">@ONTimeSports</div>
                                    </div>
                                </div>
                                <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="font-bold text-white">Ahmed Shobier</div>
                                        <div className="text-gray-400 text-sm">@ShobierOfficial</div>
                                    </div>
                                </div>
                                <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                            </div>
                        </div>
                        <button className="text-blue-500 hover:underline mt-4">Show more</button>
                    </div>
                </div>
            </div>
        </div>
    );
} 