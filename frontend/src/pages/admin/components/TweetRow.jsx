import React from 'react';
import { MoreHorizontal, Flag, Trash2 } from 'lucide-react';

export default function TweetRow({ tweet, onDelete, onMarkReviewed }) {
  return (
    <div className="p-3 border-b border-gray-800 hover:bg-gray-900">
      <div className="flex items-center mb-2">
        <img 
          src={tweet.user.profileImage || '/default-avatar.png'} 
          alt={tweet.user.username} 
          className="w-8 h-8 rounded-full mr-2" 
        />
        <div>
          <div className="font-semibold flex items-center">
            {tweet.user.name}
            {tweet.user.verified && (
              <span className="ml-1 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53-1.471-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm">@{tweet.user.username}</div>
        </div>
        <div className="ml-auto flex">
          <button 
            onClick={() => onMarkReviewed(tweet.id)} 
            className="p-2 text-green-500 hover:bg-green-900 hover:bg-opacity-20 rounded-full"
            title="Mark as Reviewed"
          >
            <Flag size={16} />
          </button>
          <button 
            onClick={() => onDelete(tweet.id)} 
            className="p-2 text-red-500 hover:bg-red-900 hover:bg-opacity-20 rounded-full"
            title="Delete Tweet"
          >
            <Trash2 size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-full">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="ml-10">
        <p className="mb-2">{tweet.content}</p>
        {tweet.image && (
          <img src={tweet.image} alt="Tweet media" className="rounded-lg max-h-60 mb-2" />
        )}
        <div className="text-gray-400 text-sm">{new Date(tweet.createdAt).toLocaleString()}</div>
        {tweet.reportCount > 0 && (
          <div className="mt-1 text-red-500 text-sm flex items-center">
            <Flag size={14} className="mr-1" /> Reported {tweet.reportCount} times
          </div>
        )}
      </div>
    </div>
  );
}
