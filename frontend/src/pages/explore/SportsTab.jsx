import React, { useState, useEffect } from 'react';
import { getExploreSports } from '../../api/hashtags';
import Tweet from '../../components/tweet/Tweet';

const SportsTab = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await getExploreSports(sortBy);
        if (response && response.results && response.results.length > 0) {
          const transformedSports = response.results.map(post => ({
            id: post.id,
            content: post.content || post.text || '',
            image: post.image || post.img || null,
            replies_count: post.replies_count || post.replies || 0,
            likes_count: post.likes_count || post.likes || 0,
            views_count: post.views_count || post.views || 0,
            retweets_count: post.retweets_count || post.retweets || 0,
            time: post.created_at || post.time || '',
            author: post.user || post.author || {
              username: 'undefined',
              display_name: 'User',
              avatar: 'https://via.placeholder.com/40'
            },
            iliked: post.iliked || false,
            iretweeted: post.iretweeted || false,
            ibookmarked: post.ibookmarked || false,
            hashtags: post.hashtags || [],
            mentions: post.mentions || []
          }));
          
          setSports(transformedSports);
          setError(null);
        } else {
          setError('No sports posts found');
          setSports([]);
        }
      } catch (err) {
        setError('Failed to load sports');
        setSports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, [sortBy]);

  const updatePost = (updatedPost) => {
    setSports(prevSports => 
      prevSports.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="animate-pulse text-gray-400">Loading sports posts...</div>
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
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="text-xl font-bold text-white">Sports</div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSortBy('created_at')}
            className={`px-3 py-1 rounded-full text-sm ${sortBy === 'created_at' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            Latest
          </button>
          <button 
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1 rounded-full text-sm ${sortBy === 'likes' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
          >
            Popular
          </button>
        </div>
      </div>
      
      {sports.length > 0 ? (
        <div>
          {sports.map((post) => (
            <Tweet key={post.id} tweet={post} setPost={updatePost} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">No sports posts available</div>
      )}
    </div>
  );
};

export default SportsTab;
