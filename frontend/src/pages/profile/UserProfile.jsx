import { useState } from 'react';
import { Calendar, Link, MapPin, Verified } from 'lucide-react';
import Tweet from '../../components/Tweet';
import { useEffect } from 'react';
import TabButton from "./components/TabButton";
import Loader from '../../components/Loader';
import EmptyState from './components/EmptyState';


export default function TwitterProfile() {
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [contentMap, setContentMap] = useState({
    posts: [],
    replies: [],
    media: [],
    likes: []
  });

  // Simulate API loading
  useEffect(() => {
    setLoading(true);

    // Simulate network delay
    const timer = setTimeout(() => {
      const tweets = [
        {
          id: 1,
          content: "Just launched our new product! Check it out at the link below. Excited to hear your feedback! #ProductLaunch #Tech",
          time: "2h",
          likes: 1243,
          retweets: 328,
          replies: 78,
          type: "posts"
        },
        {
          id: 2,
          content: "Thanks everyone for the amazing response to our recent announcement. The team has been working hard on this for months, and we're thrilled to finally share it with the world!",
          time: "5h",
          likes: 2947,
          retweets: 671,
          replies: 123,
          type: "posts"
        },
        {
          id: 3,
          content: "Looking forward to speaking at @TechConference next month about the future of AI in everyday applications. Who else will be there?",
          time: "1d",
          likes: 854,
          retweets: 201,
          replies: 54,
          type: "posts"
        }
      ];

      const replies = [
        {
          id: 4,
          replyingTo: "@codecraft",
          content: "We're definitely interested in this collaboration! Let's set up a meeting next week to discuss the details further.",
          time: "4h",
          likes: 42,
          retweets: 5,
          replies: 3,
          type: "replies"
        },
        {
          id: 5,
          replyingTo: "@techweekly",
          content: "Thanks for featuring our project! The feedback from your community has been invaluable for our development process.",
          time: "2d",
          likes: 128,
          retweets: 21,
          replies: 7,
          type: "replies"
        }
      ];

      const media = [
        {
          id: 6,
          content: "Check out our new office space! Excited to welcome the team to our new headquarters next month. #NewBeginnings",
          time: "3d",
          likes: 1852,
          retweets: 412,
          replies: 143,
          hasMedia: true,
          type: "media"
        },
        {
          id: 7,
          content: "Product demo day! Here's a sneak peek at what we've been working on for the past quarter. #Innovation",
          time: "1w",
          likes: 2104,
          retweets: 587,
          replies: 96,
          hasMedia: true,
          type: "media"
        }
      ];

      const likes = [
        {
          id: 8,
          author: "Tech Weekly",
          handle: "@techweekly",
          content: "The top 10 innovations that are changing how we interact with technology in 2025. What would you add to this list?",
          time: "6h",
          likes: 3241,
          retweets: 942,
          replies: 217,
          type: "likes"
        },
        {
          id: 9,
          author: "AI Research Group",
          handle: "@airesearch",
          content: "Our new paper on sustainable AI development practices has been published today. Link in bio for the full read.",
          time: "1d",
          likes: 1564,
          retweets: 503,
          replies: 89,
          type: "likes"
        }
      ];

      const newContentMap = {
        posts: tweets,
        replies: replies,
        media: [],
        likes: likes
      };

      setContentMap(newContentMap);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getTabContent = () => {
    return contentMap[activeTab] || [];
  };

  const renderContentSection = () => {
    if (loading) {
      return <Loader />;
    }

    const content = getTabContent();

    if (content.length === 0) {
      return <EmptyState tabName={activeTab} />;
    }

    return (
      <div className="divide-y divide-gray-800">
        {content.map(item => (
          <Tweet key={item.id} tweet={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-black text-white">
      <div className="relative">
        <div className="h-48 bg-blue-600"></div>
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-black"></div>
        </div>
      </div>

      <div className="pt-20 px-4">
        <div className="flex justify-end mb-4">
          <button
            className={`px-4 py-2 rounded-full font-bold ${following ? 'bg-transparent border border-gray-600 hover:border-red-500 hover:text-red-500' : 'bg-white text-black'}`}
            onClick={() => setFollowing(!following)}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold">Tech Innovations</h1>
            <Verified className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-500">@techinnovate</p>
        </div>

        <div className="mb-4">
          <p>Building the future of technology. Official account for Tech Innovations - where ideas become reality.</p>
        </div>

        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-1">
            <Link className="w-4 h-4" />
            <span className="text-blue-500">techinnovations.com</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined March 2018</span>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div>
            <span className="font-bold">1,234</span> <span className="text-gray-500">Following</span>
          </div>
          <div>
            <span className="font-bold">45.6K</span> <span className="text-gray-500">Followers</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800">
          <TabButton name="posts" label="Posts" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="replies" label="Replies" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="media" label="Media" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="likes" label="Likes" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content based on active tab */}
        {renderContentSection()}
      </div>
    </div>
  );
}