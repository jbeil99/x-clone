import React from 'react';
import { MoreHorizontal, Flag, Trash2 } from 'lucide-react';

export default function TweetRow({ report, onDelete, onMarkReviewed }) {
  const tweet = report.tweet;
  const reportedBy = report.user;
  console.log(report)
  return (
    <div className="p-3 border-b border-gray-800 hover:bg-gray-900">
      <div className="flex items-center mb-2">
        <img
          src={tweet.author.avatar_url || '/default-avatar.png'}
          alt={tweet.author.username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <div className="font-semibold flex items-center">
            {tweet.author.display_name}
          </div>
          <div className="text-gray-400 text-sm">@{tweet.author.username}</div>
        </div>
        <div className="ml-auto flex">
          {/* <button
            onClick={() => onMarkReviewed(report.id)}
            className="p-2 text-green-500 hover:bg-green-900 hover:bg-opacity-20 rounded-full"
            title="Mark as Reviewed"
          >
            <Flag size={16} />
          </button> */}
          <button
            onClick={() => onDelete(report.id)}
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
        {tweet.media && tweet.media.length > 0 && (
          <img src={tweet.media[0]} alt="Tweet media" className="rounded-lg max-h-60 mb-2" />
        )}
        <div className="text-gray-400 text-sm">{new Date(tweet.created_at).toLocaleString()}</div>
        <div className="mt-1 text-red-500 text-sm flex items-center">
          <Flag size={14} className="mr-1" />
          Reported by @{reportedBy.username} • {new Date(report.created_at).toLocaleString()}
        </div>
        <div className="mt-1 text-red-500 text-sm flex items-center">
          <Flag size={14} className="mr-1" />
          Total reports: {report.reported_count}
        </div>
      </div>
    </div>
  );
}
