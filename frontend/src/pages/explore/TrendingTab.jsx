import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrendingTab = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/trending_hashtags/');
        setTrendingTopics(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending topics:', err);
        setError('Failed to load trending topics');
        setTrendingTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="animate-pulse text-gray-400">Loading trending topics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-xl font-bold text-white mb-4">Trending Topics</div>
      {trendingTopics.length > 0 ? (
        trendingTopics.map((item, i) => (
          <div key={i} className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
            <div className="font-bold text-white">{item.name}</div>
            <div className="text-gray-500 text-sm">{item.count} posts</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400">No trending topics found</div>
      )}
    </div>
  );
};

export default TrendingTab;
