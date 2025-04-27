
import { Verified } from 'lucide-react';

export default function Reply({ reply }) {
    return (
        <>
            <div className="flex items-center gap-1">
                <span className="font-bold">Tech Innovations</span>
                <Verified className="w-4 h-4 text-blue-500" />
                <span className="text-gray-500">@techinnovate · {reply.time}</span>
            </div>
            <span className="text-gray-500 text-sm">Replying to <span className="text-blue-500">{reply.replyingTo}</span></span>
            <p className="my-2">{reply.content}</p>
        </>
    );
};