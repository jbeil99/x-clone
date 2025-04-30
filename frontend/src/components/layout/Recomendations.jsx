import {
    Search
} from 'lucide-react';
import TrendingHashtags from './TendingHashtags';
import WhoToFollow from './WhoToFollow';

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
            {/* <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
                <h2 className="text-xl font-bold mb-4 text-white">Subscribe to Premium</h2>
                <p className="mb-4 text-white">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                <button className="bg-blue-500 text-white rounded-full py-2 px-4 font-bold">
                    Subscribe
                </button>
            </div> */}
            <TrendingHashtags />
            <WhoToFollow />
        </div>
    )
}