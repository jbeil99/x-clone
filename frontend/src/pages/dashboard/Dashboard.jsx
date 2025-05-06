import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, value, change }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow text-center flex-1 min-w-[120px]">
      <h2 className="text-sm text-gray-400 mb-1">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last week
        </p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_tweets: 0,
    total_followers: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/dashboard/');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Could not load stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-2xl mx-auto w-full border-r border-gray-800 min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Total Tweets"
            value={stats.total_tweets}
            change={5.7}
          />
          <StatCard
            title="Followers"
            value={stats.total_followers}
            change={8.2}
          />
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md h-64 flex items-center justify-center mb-8">
          <p className="text-gray-500">📈 Chart coming soon</p>
        </div>

        {/* Info Section */}
        <section className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>• View analytics on tweets and followers</li>
            <li>• Track real-time engagement metrics</li>
            <li>• Monitor trending topics and user activity</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;