
import { Heart, Repeat, MessageCircle, Share, MoreHorizontal, Calendar, Link, MapPin, Verified, Image, Search, Loader } from 'lucide-react';

export default function Tab({ data }) {
    const renderContent = () => {
        if (data.type === 'replies') {
            return (
                <>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">Tech Innovations</span>
                        <Verified className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-500">@techinnovate · {data.time}</span>
                    </div>
                    <span className="text-gray-500 text-sm">Replying to <span className="text-blue-500">{data.replyingTo}</span></span>
                    <p className="my-2">{data.content}</p>
                </>
            );
        } else if (data.type === 'likes') {
            return (
                <>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{data.author}</span>
                        <Verified className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-500">{data.handle} · {data.time}</span>
                    </div>
                    <p className="my-2">{data.content}</p>
                </>
            );
        } else {
            return (
                <>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">Tech Innovations</span>
                        <Verified className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-500">@techinnovate · {data.time}</span>
                    </div>
                    <p className="my-2">{data.content}</p>
                    {data.hasMedia && (
                        <div className="bg-gray-800 h-48 rounded-xl mb-3 flex items-center justify-center">
                            <Image className="w-10 h-10 text-gray-600" />
                        </div>
                    )}
                </>
            );
        }
    }

    return (
        <div className="py-4">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>{renderContent()}</div>
                        <MoreHorizontal className="text-gray-500" />
                    </div>
                    <div className="flex justify-between text-gray-500 mt-2 max-w-md">
                        <div className="flex items-center gap-1 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4" />
                            <span>{tweet.replies}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-green-500">
                            <Repeat className="w-4 h-4" />
                            <span>{tweet.retweets}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                            <span>{tweet.likes}</span>
                        </div>
                        <div className="hover:text-blue-500">
                            <Share className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};