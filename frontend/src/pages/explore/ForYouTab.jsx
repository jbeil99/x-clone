import { useState, useEffect } from 'react';
import { getRandomPosts } from '../../api/tweets';
import Tweet from '../../components/tweet/Tweet';

const ForYouTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        setLoading(true);
        const data = await getRandomPosts(20);
        if (data && data.length > 0) {
          const transformedPosts = data.map(post => ({
            ...post,
            author: post.user || post.author || {
              username: 'undefined',
              display_name: 'User',
              avatar: 'https://via.placeholder.com/40'
            },
            content: post.content || post.text || '',
            image: post.image || post.img || null,
            replies_count: post.replies_count || post.replies || 0,
            likes_count: post.likes_count || post.likes || 0,
            views_count: post.views_count || post.views || 0,
            retweets_count: post.retweets_count || post.retweets || 0,
            time: post.created_at || post.time || '',
            iliked: post.iliked || false,
            iretweeted: post.iretweeted || false,
            ibookmarked: post.ibookmarked || false,
            hashtags: post.hashtags || [],
            mentions: post.mentions || []
          }));
          
          setPosts(transformedPosts);
          setError(null);
        } else {
          setError('No posts found. Please try again later.');
          setPosts([]);
        }
      } catch (err) {
        setError(`Failed to load posts: ${err.message}`);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPosts();
  }, []);

  const updatePost = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="animate-pulse text-gray-400">Loading posts...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-xl font-bold text-white mb-4 px-4">Posts For You</div>
      {posts.map((post) => (
        <Tweet key={post.id} tweet={post} setPost={updatePost} />
      ))}
    </div>
  );
};

export default ForYouTab;
