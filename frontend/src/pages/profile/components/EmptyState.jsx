import { Search } from 'lucide-react';


export default function EmptyState({ tabName }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-800 rounded-full p-6 mb-4">
                <Search className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No {tabName} yet</h3>
            <p className="text-gray-500 max-w-xs">
                {tabName === 'posts' && "When Tech Innovations posts, you'll see their posts here."}
                {tabName === 'replies' && "When Tech Innovations replies to someone, you'll see their replies here."}
                {tabName === 'media' && "When Tech Innovations posts photos or videos, they will show up here."}
                {tabName === 'likes' && "Tweets liked by Tech Innovations will show up here."}
            </p>
        </div>
    );
}