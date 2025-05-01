import { useState, useEffect } from 'react';
import { MoreHorizontal, MessageCircle, Heart, BarChart2 } from 'lucide-react';
import { getRandomPosts } from '../../api/tweets';

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
          setPosts(data);
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
      <div className="text-xl font-bold text-white mb-4">Posts For You</div>
      {posts.map((post, i) => {
        const user = post.user || post.author || {};
        const content = post.text || post.content || '';
        const image = post.img || post.image || null;
        const repliesCount = post.replies || post.replies_count || '0';
        const likesCount = post.likes || post.likes_count || '0';
        const viewsCount = post.views || post.views_count || '0';
        const postTime = post.time || post.created_at || '';
        
        return (
          <div key={post.id || i} className="rounded-xl p-4 mb-4 border border-gray-800 bg-black">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={user.avatar || user.profile_image || 'https://via.placeholder.com/40'} 
                alt={user.name || user.username || 'User'} 
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <span className="font-bold text-white">{user.name || user.username || 'User'}</span>
                {(user.verified || user.is_verified) && <span className="text-blue-400 ml-1">✔</span>}
                <span className="text-gray-400 ml-2">
                  {user.handle || `@${user.username}` || ''} · {postTime}
                </span>
              </div>
              <span className="ml-auto text-gray-400"><MoreHorizontal /></span>
            </div>
            <div className="text-white mb-2">{content}</div>
            {image && (
              <img 
                src={image} 
                alt="post" 
                className="rounded-xl mb-2 max-h-80 object-cover w-full" 
              />
            )}
            <div className="flex gap-6 text-gray-400 mt-2">
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {repliesCount}</span>
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {likesCount}</span>
              <span className="flex items-center gap-1"><BarChart2 className="w-4 h-4" /> {viewsCount}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForYouTab;
