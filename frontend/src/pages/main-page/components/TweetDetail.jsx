import { useState, useEffect } from 'react';
import { MessageCircle, BarChart2, Heart, Bookmark, RefreshCw, Share2, MoreHorizontal } from 'lucide-react';
import Tweet from '../../../components/Tweet';
import { getTweetByID } from '../../../api/tweets';
import { useParams } from 'react-router';
export default function TweetDetail() {
    const { id } = useParams()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await getTweetByID(id);
                console.log(res)
                setIsLoading(false)
                setPosts(res)
            } catch (error) {
                console.log(error)
            }
        }
        getPosts()
    }, [])

    return (
        <div className="bg-black text-white font-sans w-full max-w-lg mx-auto">
            {/* Header with back button and "Post" */}
            <div className="flex items-center p-4 border-b border-gray-800">
                <div className="mr-8 cursor-pointer">←</div>
                <div className="text-xl font-bold">Post</div>
            </div>

            {/* Main post */}
            {!isLoading ? <Tweet tweet={posts} /> : ""}

            {/* Reply input */}
            <div className="p-4 border-b border-gray-800 flex">
                <div className="mr-3">
                    <div className="w-10 h-10 rounded-full bg-red-700" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                    <div className="text-gray-500">Post your reply</div>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-full opacity-50">Reply</button>
                </div>
            </div>

            {/* First reply */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex">
                    <div className="mr-3">
                        <div className="w-10 h-10 rounded-full bg-red-700" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center">
                            <span className="font-bold mr-1">كنبين</span>
                            <span className="text-gray-500 ml-1">@btnganm2ley · Feb 11</span>
                            <div className="ml-auto">
                                <MoreHorizontal size={18} className="text-gray-500" />
                            </div>
                        </div>
                        <div className="mt-1">
                            ???????????
                        </div>
                        <div className="flex mt-3 justify-between">
                            <div className="flex items-center text-gray-500">
                                <MessageCircle size={16} />
                            </div>
                            <div className="flex items-center text-gray-500">
                                <RefreshCw size={16} />
                            </div>
                            <div className="flex items-center text-gray-500">
                                <Heart size={16} />
                            </div>
                            <div className="flex items-center text-gray-500">
                                <BarChart2 size={16} />
                                <span className="ml-1 text-xs">412</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <Bookmark size={16} />
                            </div>
                            <div className="flex items-center text-gray-500">
                                <Share2 size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second reply */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex">
                    <div className="mr-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center">
                            <span className="font-bold mr-1">2024=2023+1 (e/acc)</span>
                            <span className="text-blue-400">✓</span>
                            <span className="text-gray-500 ml-1">@commondoubts · Feb 11</span>
                            <div className="ml-auto">
                                <MoreHorizontal size={18} className="text-gray-500" />
                            </div>
                        </div>
                        <div className="mt-1">
                            One of the great challenges in this world is knowing enough about a subject to think you're right, but not enough about the subject to know you're wrong.
                            <div className="mt-2">—Neil deGrasse Tyson</div>
                        </div>
                        <div className="flex mt-3 justify-between">
                            <div className="flex items-center text-gray-500">
                                <MessageCircle size={16} />
                                <span className="ml-1 text-xs">1</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <RefreshCw size={16} />
                            </div>
                            <div className="flex items-center text-gray-500">
                                <Heart size={16} />
                                <span className="ml-1 text-xs">32</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <BarChart2 size={16} />
                                <span className="ml-1 text-xs">2.2K</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <Bookmark size={16} />
                            </div>
                            <div className="flex items-center text-gray-500">
                                <Share2 size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}