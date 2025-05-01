import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Aquí deberías usar una API real para obtener noticias
        // Por ahora, simularemos una solicitud que podría fallar
        const response = await axios.get('/api/news');
        setNews(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="animate-pulse text-gray-400">Loading news...</div>
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
      {news.length > 0 ? (
        news.map((item, i) => (
          <div key={i} className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
            <div className="font-bold text-white mb-1">{item.title}</div>
            <div className="text-gray-400 text-sm mb-2">{item.description}</div>
            {item.image && (
              <img src={item.image} alt={item.title} className="rounded-xl mb-2 max-h-80 object-cover w-full" />
            )}
            <div className="text-gray-500 text-xs">{item.category} · {item.time_ago}</div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-400">No news available</div>
      )}
    </div>
  );
};

export default NewsTab;
