import React from 'react';
import { MoreHorizontal, UserCheck, UserX } from 'lucide-react';

export default function UserRow({ user, onVerify, onBan }) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-800 hover:bg-gray-900">
      <div className="flex items-center">
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-semibold flex items-center">
            {user.display_name}
            {user.verified && (
              <span className="ml-1 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53-1.471-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="text-gray-400">@{user.username}</div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => onVerify(user.id)}
          className="p-2 text-blue-500 hover:bg-blue-900 hover:bg-opacity-20 rounded-full"
          title="Verify User"
        >
          <UserCheck size={18} />
        </button>
        <button
          onClick={() => onBan(user.id)}
          className="p-2 text-red-500 hover:bg-red-900 hover:bg-opacity-20 rounded-full"
          title="Ban User"
        >
          <UserX size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-full">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
