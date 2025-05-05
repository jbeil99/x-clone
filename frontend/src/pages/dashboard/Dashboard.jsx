import React, { useState, useEffect } from 'react';

const StatCard = ({ title, value, change }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow text-center flex-1 min-w-[120px]">
      <h2 className="text-sm text-gray-400 mb-1">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
      <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last week
      </p>
    </div>
  );
};


const ChartPlaceholder = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md h-64 flex items-center justify-center mb-6">
      <p className="text-gray-500">📈 Chart coming soon</p>
    </div>
  );
};


const TrendCard = ({ topic, volume, category }) => {
  return (
    <div className="p-4 hover:bg-gray-900 rounded-lg cursor-pointer transition">
      <p className="text-sm text-gray-500">{category}</p>
      <p className="font-bold text-lg">{topic}</p>
      <p className="text-sm text-gray-400">{volume} posts</p>
    </div>
  );
};


const NewsCard = ({ title, source, summary, imageUrl }) => {
  return (
    <div className="flex gap-4 mb-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-24 h-24 object-cover rounded"
      />
      <div>
        <p className="text-sm text-blue-400">{source}</p>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{summary}</p>
      </div>
    </div>
  );
};


const RecentActivity = ({ activities }) => {
  return (
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
};


const Feed = () => {
  const [stats, setStats] = useState([
    { title: "Followers", value: "12.4K", change: 8.5 },
    { title: "Total Posts", value: "42", change: 12 },
    { title: "Profile Views", value: "34.2K", change: -2.3 },
  ]);
  const [trends, setTrends] = useState([
    { topic: "AI Ethics", volume: "20K", category: "Technology" },
    { topic: "Climate Summit", volume: "15K", category: "World" },
    { topic: "New iPhone Launch", volume: "25K", category: "Tech" },
    { topic: "Global Elections", volume: "18K", category: "Politics" },
  ]);
  const [news, setNews] = useState([
    {
      title: "Major Climate Agreement Reached",
      source: "BBC",
      summary: "World leaders agree on new emissions targets at COP29 summit.",
      imageUrl: "https://picsum.photos/seed/climate/200/300",
    },
    {
      title: "OpenAI Releases New Language Model",
      source: "TechCrunch",
      summary: "GPT-5 promises major improvements in reasoning and multilingual support.",
      imageUrl: "https://picsum.photos/seed/ai/200/300",
    },
  ]);
  const [activity, setActivity] = useState([
    { user: "Alice", action: "posted a new tweet" },
    { user: "Bob", action: "retweeted your post" },
    { user: "Charlie", action: "mentioned you in a reply" },
    { user: "Dana", action: "followed you" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //API 
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay

            //////
        
   
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
    return (
      <div className="text-center py-10 text-gray-400">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto w-full border-r border-gray-800 min-h-screen p-4 bg-black">
      
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>
      <ChartPlaceholder />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
        <div className="space-y-1 bg-gray-900 rounded-xl overflow-hidden">
          {trends.map((trend, index) => (
            <TrendCard key={index} {...trend} />
          ))}
        </div>
      </section>

      <RecentActivity activities={activity} />

      <section>
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        <div className="space-y-4">
          {news.map((article, index) => (
            <NewsCard key={index} {...article} />
          ))}
        </div>
      </section>

      
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </main>
  );
};


const Dashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Feed />
    </div>
  );
};

export default Dashboard;