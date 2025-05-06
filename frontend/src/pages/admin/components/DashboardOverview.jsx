import React from 'react';
import { Users, BarChart2, MessageSquare, Flag } from 'lucide-react';
import StatCard from './StatCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import UserRow from './UserRow';
import NotificationCard from './NotificationCard';

export default function DashboardOverview({
    stats,
    userGrowthData,
    userGrowthLabels,
    tweetActivityData,
    tweetActivityLabels,
    users,
    notifications,
    handleVerifyUser,
    handleBanUser
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users size={24} />} value={stats.users} label="Total Users" />
                <StatCard icon={<BarChart2 size={24} />} value={stats.tweets} label="Total Tweets" />
                <StatCard icon={<MessageSquare size={24} />} value={stats.messages} label="Messages" />
                <StatCard icon={<Flag size={24} />} value={stats.reports} label="Reports" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <LineChart data={userGrowthData} labels={userGrowthLabels} title="New Users" />
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Tweet Activity</h3>
                    <BarChart data={tweetActivityData} labels={tweetActivityLabels} title="Tweets" />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                        {users.slice(0, 5).map(user => (
                            <UserRow
                                key={user.id}
                                user={user}
                                onVerify={handleVerifyUser}
                                onBan={handleBanUser}
                            />
                        ))}
                    </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">System Notifications</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {notifications.map((notification, index) => (
                            <NotificationCard key={index} notification={notification} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}