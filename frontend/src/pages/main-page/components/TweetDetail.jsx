import { useState, useEffect } from 'react';
import { MessageCircle, BarChart2, Heart, Bookmark, RefreshCw, Share2, MoreHorizontal, Reply } from 'lucide-react';
import Tweet from '../../../components/Tweet';
import { getTweetByID, getTweetReplies } from '../../../api/tweets';
import { useParams } from 'react-router';
import TweetForm from './TweetForm';
export default function TweetDetail() {
    const { id } = useParams()
    const [post, setPost] = useState([])
    const [replies, setReplies] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await getTweetByID(id);
                console.log(res)
                setIsLoading(false)
                setPost(res)
            } catch (error) {
                console.log(error)
            }
        }
        const getReplies = async () => {
            try {
                const res = await getTweetReplies(id);
                console.log(res)
                setIsLoading(false)
                setReplies(res.results)
            } catch (error) {
                console.log(error)
            }
        }
        getPosts()
        getReplies()
    }, [])

    return (
        <div className="bg-black text-white font-sans w-full max-w-lg mx-auto">
            {/* Header with back button and "Post" */}
            <div className="flex items-center p-4 border-b border-gray-800">
                <div className="mr-8 cursor-pointer">←</div>
                <div className="text-xl font-bold">Post</div>
            </div>

            {/* Main post */}
            {!isLoading ? <Tweet tweet={post} /> : ""}

            {/* Reply input */}
            {/* <div className="p-4 border-b border-gray-800 flex">
                <div className="mr-3">
                    <div className="w-10 h-10 rounded-full bg-red-700" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                    <div className="text-gray-500">Post your reply</div>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-full opacity-50">Reply</button>
                </div>
            </div> */}

            <TweetForm parent={id} />
            {!isLoading ? replies.map((reply, index) => <Tweet tweet={reply} key={reply.id} id={id} />) : ""}

        </div>
    );
}