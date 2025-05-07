import React from 'react';
import UserRow from './UserRow';

const RecentUsers = ({ users, onVerify, onBan }) => {
    return (
        <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
            <div className="space-y-1 max-h-80 overflow-y-auto">
                {users.slice(0, 5).map(user => (
                    <UserRow
                        key={user.id}
                        user={user}
                        onVerify={onVerify}
                        onBan={onBan}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentUsers;