import { useState, useEffect } from 'react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import Tweet from '../../../components/Tweet';
import { getTweetByID, getTweetReplies } from '../../../api/tweets';
import { useNavigate, useParams } from 'react-router';
import TweetForm from './TweetForm';
export default function TweetDetail() {
    const { id } = useParams()
    const [post, setPost] = useState([]);
    const [replies, setReplies] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="bg-black text-white font-sans w-full mx-auto">
            {/* Header with back button and "Post" */}
            <div className="flex items-center p-4 border-b border-gray-800">
                <FaLongArrowAltLeft className="mr-8 cursor-pointer" onClick={() => navigate("/")} />
                <div className="text-xl font-bold">Post</div>
            </div>

            {!isLoading ? <Tweet tweet={post} setPost={setPost} /> : ""}

            <TweetForm parent={id} isReply={true} author={post?.author} setReplies={setReplies} replies={replies} />
            {!isLoading ? replies.map((reply, index) => <Tweet tweet={reply} key={reply.id} id={id} />) : ""}

        </div>
    );
}