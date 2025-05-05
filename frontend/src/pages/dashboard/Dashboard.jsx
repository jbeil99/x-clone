import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components
const StatCard = ({ title, value, change }) => (
  <div className="bg-gray-900 p-4 rounded-lg shadow text-center flex-1 min-w-[120px]">
    <h2 className="text-sm text-gray-400 mb-1">{title}</h2>
    <p className="text-xl font-bold">{value}</p>
    <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last week
    </p>
  </div>
);

const TrendCard = ({ topic, volume, category }) => (
  <div className="p-4 hover:bg-gray-900 rounded-lg cursor-pointer transition">
    <p className="text-sm text-gray-500">{category}</p>
    <p className="font-bold text-lg">{topic}</p>
    <p className="text-sm text-gray-400">{volume} posts</p>
  </div>
);

const NewsCard = ({ title, source, summary, imageUrl }) => (
  <div className="flex gap-4 mb-4">
    <img src={imageUrl} alt={title} className="w-24 h-24 object-cover rounded" />
    <div>
      <p className="text-sm text-blue-400">{source}</p>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{summary}</p>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
    <ul className="space-y-3">
      {activities.map((item, i) => (
        <li key={i} className="text-sm">
          <span className="font-medium">{item.user}</span> {item.action}
        </li>
      ))}
    </ul>
  </div>
);

// Main Feed
const Feed = () => {
  const [stats, setStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [news, setNews] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance
  const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          trendsRes,
          newsRes,
          activityRes,
        ] = await Promise.all([
          apiClient.get('dashboard/stats/'),
          apiClient.get('dashboard/trends/'),
          apiClient.get('dashboard/news/'),
          apiClient.get('dashboard/activity/'),
        ]);

        setStats(statsRes.data.stats || []);
        setTrends(trendsRes.data.trends || []);
        setNews(newsRes.data.news || []);
        setActivity(activityRes.data.activity || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load some data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto w-full border-r border-gray-800 min-h-screen p-4 bg-black">
      {/* Stats */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* Chart Placeholder */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md h-64 flex items-center justify-center mb-6">
        <p className="text-gray-500">📈 Chart coming soon</p>
      </div>

      {/* Trends */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
        <div className="space-y-1 bg-gray-900 rounded-xl overflow-hidden">
          {trends.map((trend, index) => (
            <TrendCard key={index} {...trend} />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <RecentActivity activities={activity} />

      {/* News */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        <div className="space-y-4">
          {news.map((article, index) => (
            <NewsCard key={index} {...article} />
          ))}
        </div>
      </section>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </main>
  );
};

// Dashboard Page
const Dashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Feed />
    </div>
  );
};

export default Dashboard;