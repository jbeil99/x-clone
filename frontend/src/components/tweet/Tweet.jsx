import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router';
import { TweetActions } from './TweetActions';
import TweetFooter from './TweetFooter';
import TweetContent from './TweetContnet';
import { Repeat } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Tweet({ tweet, setPost }) {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [showMutedTweet, setShowMutedTweet] = useState(false);
    const isMuted = tweet?.author?.imuted;

    const handleClickTweet = () => {
        if (!isMuted || showMutedTweet) {
            window.location.href = `/status/${tweet.id}`;
        }
    };

    const handleUsernameClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${tweet?.author?.username}`);
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleSeeAnyway = (e) => {
        e.stopPropagation();
        setShowMutedTweet(true);
    };

    const getMediaType = (url) => {
        if (!url) return null;

        const extension = url.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoExtensions = ['mp4', 'mov', 'webm', 'avi'];

        if (imageExtensions.includes(extension)) return 'image';
        if (videoExtensions.includes(extension)) return 'video';

        return null;
    };

    const media = tweet?.media && tweet.media.length > 0 ? tweet.media[0] : null;
    const mediaUrl = media?.file_url || null;
    const mediaType = mediaUrl ? getMediaType(mediaUrl) : null;

    if (isMuted && !showMutedTweet) {
        return (
            <div className="py-4 border-b border-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-950 w-full">
                <div className="px-8">
                    <div className="ml-12 text-gray-500">You have muted this user.</div>
                    <button onClick={handleSeeAnyway} className="ml-12 mt-2 px-4 py-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        See anyway
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="py-4 border-b border-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-950 w-full"
            onClick={handleClickTweet}
        >
            <div className="px-8">
                {tweet?.is_retweet && (
                    <div className="mb-1 ml-12 text-gray-500 flex items-center gap-1">
                        <Repeat size={15} />
                        <span>{tweet.retweeted_by.username === user.username ? "You" : tweet.retweeted_by.display_name} Reposted</span>
                    </div>
                )}
                <div className="flex items-start gap-3 w-full">
                    <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage
                            src={tweet?.author?.avatar_url || "/api/placeholder/40/40"}
                            alt={tweet?.author?.username}
                            onClick={handleUsernameClick}
                        />
                        <AvatarFallback
                            className="bg-gray-800 text-gray-400"
                            onClick={handleUsernameClick}
                        >
                            {tweet?.author?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between w-full">
                            <div className="min-w-0 w-full pr-2">
                                <div className="flex items-center gap-1 flex-wrap">
                                    <span
                                        className="font-bold text-[15px] leading-5 truncate max-w-[150px] sm:max-w-[200px]"
                                        onClick={handleUsernameClick}
                                    >
                                        {tweet?.author?.display_name}
                                    </span>
                                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                    </svg>
                                    <span className="text-gray-500 text-[13px] leading-4 truncate max-w-full">@{tweet?.author?.username} · {tweet?.time}</span>
                                </div>

                                {tweet?.content && (
                                    <div
                                        className="my-2 whitespace-pre-wrap break-words cursor-text text-[15px] leading-5"
                                        onClick={handleContentClick}
                                    >
                                        <TweetContent tweet={tweet} />
                                    </div>
                                )}

                                {mediaUrl && (
                                    <div className="rounded-xl overflow-hidden mb-3 w-full" onClick={handleContentClick}>
                                        {mediaType === 'image' && (
                                            <img
                                                src={mediaUrl}
                                                alt="Tweet Image"
                                                className="w-full object-cover rounded-xl"
                                                style={{ maxHeight: '500px' }}
                                            />
                                        )}
                                        {mediaType === 'video' && (
                                            <video
                                                src={mediaUrl}
                                                className="w-full rounded-xl"
                                                controls
                                                style={{ maxHeight: '500px' }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            <TweetActions tweet={tweet} />
                        </div>

                        <TweetFooter tweet={tweet} setPost={setPost} />
                    </div>
                </div>
            </div>
        </div>
    );
}