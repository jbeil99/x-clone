import { Heart, Repeat, MessageCircle, Share, BookmarkPlus, BarChart2 } from 'lucide-react';
import { useDispatch } from "react-redux"
import { postBookmark, postLikes, postRetweets } from '../../store/slices/tweets';
import { useState } from 'react';
import ShareButton from './ShareButton';

export default function TweetFooter({ tweet, setPost }) {
    const [liked, setLiked] = useState(tweet.iliked);
    const [likesCount, setLikesCount] = useState(tweet?.likes_count || 0);
    const [retweetsCount, setRetweetsCount] = useState(tweet?.retweets_count || 0);
    const [repliesCount, setRepliesCount] = useState(tweet?.replies_count || 0);
    const [viewsCount, setViewsCount] = useState(tweet?.replies_count || 0);
    const [retweeted, setRetweeted] = useState(tweet.iretweeted);
    const [bookmarked, setBookmarked] = useState(tweet.ibookmarked);
    const dispatch = useDispatch()
    const heartColor = liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500';

    const handleLikeClick = async (e) => {
        e.stopPropagation();
        try {
            const action = await dispatch(postLikes(tweet.id))
            setLiked(action.payload.iliked);
            setLikesCount(action.payload.iliked ? likesCount + 1 : likesCount - 1)
            if (setPost) (
                setPost(action.payload)
            )
        } catch (error) {
            console.log(error);
        }
    };
    const formatCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count;
    };

    const handleRetweetClick = async (e) => {
        e.stopPropagation();
        try {
            const action = await dispatch(postRetweets(tweet.id))
            console.log(action)
            setRetweeted(action.payload.iretweeted);
            setRetweetsCount(action.payload.iretweeted ? retweetsCount + 1 : retweetsCount - 1)
            if (setPost) (
                setPost(action.payload)
            )
        } catch (error) {
            console.log(error);
        }
    };
    const handleBookmarkClick = async (e) => {
        e.stopPropagation();
        try {
            const action = await dispatch(postBookmark(tweet.id))
            setBookmarked(action.payload.ibookmarked);
            if (setPost) (
                setPost(action.payload)
            )
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex justify-between text-gray-500 mt-3 max-w-md px-1">
            <div className="flex items-center group cursor-pointer hover:text-blue-500 transition-colors duration-200">
                <MessageCircle className="w-4 h-4" />
                <span className="text-[13px] ml-1">{formatCount(repliesCount)}</span>
            </div>

            <div
                className={`flex items-center group cursor-pointer transition-colors duration-200 ${retweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                onClick={handleRetweetClick}
            >
                <Repeat className="w-4 h-4" />
                <span className="text-[13px] ml-1">{formatCount(retweetsCount)}</span>
            </div>

            <div
                className={`flex items-center group cursor-pointer transition-colors duration-200 ${heartColor}`}
                onClick={handleLikeClick}
            >
                <Heart className={`w-4 h-4 ${tweet.iliked ? 'fill-current' : ''}`} />
                <span className="text-[13px] ml-1">{formatCount(likesCount)}</span>
            </div>
            <div
                className={`flex items-center group cursor-pointer transition-colors duration-200 ${bookmarked ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={handleBookmarkClick}
            >
                <BookmarkPlus className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </div>
            <div className="flex items-center group cursor-pointer hover:text-blue-400 transition-colors duration-200">
                <ShareButton />
            </div>

            <div className="flex items-center group cursor-pointer hover:text-blue-500 transition-colors duration-200">
                <BarChart2 className="w-4 h-4" />
                <span className="text-[13px] ml-1">{formatCount(viewsCount)}</span>
            </div>
        </div>
    )
}