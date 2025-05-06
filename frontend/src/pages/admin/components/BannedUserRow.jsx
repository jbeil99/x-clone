import { User } from 'lucide-react';

export default function BannedUserRow({ user, onUnban }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-md bg-gray-800 border border-gray-700">
            <div className="flex items-center gap-4">
                <User size={20} className="text-gray-400" />
                <div>
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-500">Banned</span>
                <button
                    onClick={() => onUnban(user.id)}
                    className="bg-green-600/20 text-green-400 hover:bg-green-600/30 hover:text-green-300 px-2 py-1 rounded-md transition-colors text-xs"
                >
                    Unban
                </button>
            </div>
        </div>
    );
};
