import React from 'react';
import UserRow from './UserRow';
import BannedUserRow from './BannedUserRow';

export default function UserManagement({
    users,
    bannedUsers,
    handleVerifyUser,
    handleBanUser,
    handleUnbanUser
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">All Users</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {users.map(user => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onVerify={handleVerifyUser}
                            onBan={handleBanUser}
                        />
                    ))}
                </div>
            </div>
            {/* Banned Users Section */}
            <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Banned Users</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bannedUsers.length > 0 ? (
                        bannedUsers.map(user => (
                            <BannedUserRow
                                key={user.id}
                                user={user}
                                onUnban={handleUnbanUser}
                            />
                        ))
                    ) : (
                        <div className="text-gray-400 text-sm">No users are currently banned.</div>
                    )}
                </div>
            </div>
        </div>
    );
}