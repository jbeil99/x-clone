import { Link } from 'react-router-dom';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, MoreHorizontal } from 'lucide-react';

export default function Layout({ children }) {
    const sidebarItems = [
        { icon: Home, text: 'Home', path: '/' },
        { icon: Search, text: 'Explore', path: '/explore' },
        { icon: Bell, text: 'Notifications', path: '/notifications' },
        { icon: Mail, text: 'Messages', path: '/messages' },
        { icon: Bookmark, text: 'Bookmarks', path: '/bookmarks' },
        { icon: User, text: 'Profile', path: '/profile' }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex justify-center">
            <div className="flex w-full max-w-[1200px]">
                <div className="flex flex-col w-[275px] px-4 py-4 border-r border-gray-200 dark:border-gray-800">
                    <div className="text-xl font-bold mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                            <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
                        </svg>
                    </div>
                    
                    <nav className="space-y-4">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.text}
                                to={item.path}
                                className="flex items-center gap-4 text-xl hover:bg-gray-100 dark:hover:bg-gray-900 px-4 py-2 rounded-full"
                            >
                                <item.icon className="h-6 w-6" />
                                <span>{item.text}</span>
                            </Link>
                        ))}
                    </nav>

                    <button className="mt-4 w-full bg-blue-500 text-white rounded-full py-3 font-bold">
                        Post
                    </button>
                </div>

                <main className="flex-1 min-w-0 border-r border-gray-200 dark:border-gray-800 flex justify-center">
                    <div className="w-full max-w-[650px] px-4">
                        {children}
                    </div>
                </main>

                <div className="w-[350px] px-4 py-4">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
                        <div className="flex items-center px-4 py-2">
                            <Search className="h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent ml-2 outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 mb-4">
                        <h2 className="text-xl font-bold mb-4">Subscribe to Premium</h2>
                        <p className="mb-4">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                        <button className="bg-blue-500 text-white rounded-full py-2 px-4 font-bold">
                            Subscribe
                        </button>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4">
                        <h2 className="text-xl font-bold mb-4">What's happening</h2>
                        <div className="space-y-4">

                            <div>
                                <div className="text-sm text-gray-500">Trending in Egypt</div>
                                <div className="font-bold">#TrendingTopic</div>
                                <div className="text-sm text-gray-500">50.4K posts</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 