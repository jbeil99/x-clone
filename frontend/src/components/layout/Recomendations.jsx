import {
    Search
} from 'lucide-react';

export default function Recomendations() {
    return (
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
    )
}