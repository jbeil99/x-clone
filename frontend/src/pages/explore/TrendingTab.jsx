import React, { useState, useEffect } from 'react';
import { getHashtagTweets } from '../../api/hashtags';
import { getTrendingHashtag } from '../../api/hashtags';
import Tweet from '../../components/tweet/Tweet';
import { ArrowLeft } from 'lucide-react';

const TrendingTab = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [hashtagTweets, setHashtagTweets] = useState([]);
  const [tweetsLoading, setTweetsLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        setLoading(true);
        const response = await getTrendingHashtag();
        setTrendingTopics(response);
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

  const fetchHashtagTweets = async (hashtag) => {
    try {
      setTweetsLoading(true);
      const response = await getHashtagTweets(hashtag);
      
      const transformedTweets = response.results.map(post => ({
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
      
      setHashtagTweets(transformedTweets);
    } catch (err) {
      console.error(`Error fetching tweets for hashtag #${hashtag}:`, err);
      setHashtagTweets([]);
    } finally {
      setTweetsLoading(false);
    }
  };

  const handleHashtagClick = (hashtag) => {
    setSelectedHashtag(hashtag);
    fetchHashtagTweets(hashtag);
  };

  const handleBackClick = () => {
    setSelectedHashtag(null);
    setHashtagTweets([]);
  };

  const updatePost = (updatedPost) => {
    setHashtagTweets(prevTweets => 
      prevTweets.map(tweet => 
        tweet.id === updatedPost.id ? updatedPost : tweet
      )
    );
  };

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

  if (selectedHashtag) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-4 px-4">
          <button 
            onClick={handleBackClick}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-xl font-bold text-white">#{selectedHashtag}</div>
        </div>
        
        {tweetsLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-400">Loading tweets...</div>
          </div>
        ) : hashtagTweets.length > 0 ? (
          <div>
            {hashtagTweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} setPost={updatePost} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No tweets found for #{selectedHashtag}</div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-xl font-bold text-white mb-4 px-4">Trending Topics</div>
      {trendingTopics.length > 0 ? (
        trendingTopics.map((item, i) => (
          <div 
            key={i} 
            className="bg-black rounded-xl p-4 mb-4 border border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors"
            onClick={() => handleHashtagClick(item.name.replace('#', ''))}
          >
            <div className="font-bold text-white text-blue-500">{item.name}</div>
            <div className="text-gray-500 text-sm">{item.count} posts</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">No trending topics found</div>
      )}
    </div>
  );
};

export default TrendingTab;
