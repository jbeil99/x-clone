import { useState } from 'react';
import { Settings, MoreHorizontal, MessageCircle, Heart, BarChart2 } from 'lucide-react';

const forYouPosts = [
  {
    user: {
      name: 'FC Barcelona',
      handle: '@FCBarcelona',
      avatar: 'https://pbs.twimg.com/profile_images/1915289330047758336/fpMzxHvk_400x400.jpg',
      verified: true,
    },
    time: '1h',
    text: 'THE COPA IS OURS! 🏆',
    img: 'https://pbs.twimg.com/media/Gpfvbt0WAAAVC0W?format=jpg&name=4096x4096',
    replies: '2k',
    likes: '38k',
    views: '154k',
  },
  {
    user: {
      name: '433',
      handle: '@433',
      avatar: 'https://pbs.twimg.com/profile_images/1911800877054119937/k1LYtno__400x400.jpg',
      verified: false,
    },
    time: '2h',
    text: 'Lewandowski scores twice as Barça clinch the title',
    img: 'https://pbs.twimg.com/media/GpicXHiXUAA_rMJ?format=jpg&name=large',
    replies: '1.1k',
    likes: '22k',
    views: '80k',
  },
  {
    user: {
      name: 'Barça Universal',
      handle: '@BarcaUniversal',
      avatar: 'https://pbs.twimg.com/profile_images/1640726070/fcb_400x400.png',
      verified: false,
    },
    time: '3h',
    text: 'Ter Stegen: Clean sheet king! New record for clean sheets in a single season.',
    img: 'https://www.fcbarcelona.com/photo-resources/2023/05/14/2e7b2e2e-2b2e-4e2e-8e2e-2e2e2e2e2e2e/terstegen.jpg?width=1200&height=750',
    replies: '800',
    likes: '10k',
    views: '40k',
  },
  {
    user: {
      name: 'LaLiga',
      handle: '@LaLiga',
      avatar: 'https://pbs.twimg.com/profile_images/1640726070/fcb_400x400.png',
      verified: false,
    },
    time: '4h',
    text: 'Barça reach the Champions League semi-finals! What a run!',
    img: 'https://pbs.twimg.com/media/GK7Qw1bWwAAwQwA?format=jpg&name=large',
    replies: '500',
    likes: '7k',
    views: '30k',
  },
];

const ForYouTab = () => (
  <div className="max-w-xl mx-auto">
    <div className="text-xl font-bold text-white mb-4">Posts For You</div>
    {forYouPosts.map((post, i) => (
      <div key={i} className="rounded-xl p-4 mb-4 border border-gray-800 bg-black">
        <div className="flex items-center gap-3 mb-2">
          <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
          <div>
            <span className="font-bold text-white">{post.user.name}</span>
            {post.user.verified && <span className="text-blue-400 ml-1">✔</span>}
            <span className="text-gray-400 ml-2">{post.user.handle} · {post.time}</span>
          </div>
          <span className="ml-auto text-gray-400"><MoreHorizontal /></span>
        </div>
        <div className="text-white mb-2">{post.text}</div>
        <img src={post.img} alt="post" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
        <div className="flex gap-6 text-gray-400 mt-2">
          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.replies}</span>
          <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes}</span>
          <span className="flex items-center gap-1"><BarChart2 className="w-4 h-4" /> {post.views}</span>
        </div>
      </div>
    ))}
  </div>
);

const moreBarcaNews = [
  {
    title: "Xavi: 'This team never gives up!'",
    desc: "Barcelona coach Xavi praised his players after their dramatic win in the Copa del Rey final.",
    img: "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2023/05/14/16840896028241.jpg",
    time: "30 min ago"
  },
  {
    title: "Lewandowski scores twice as Barça clinch the title",
    desc: "Robert Lewandowski was the hero with two goals in a thrilling final.",
    img: "https://img.bundesliga.com/tachyon/sites/2/2022/07/Robert-Lewandowski-Barcelona.jpg?crop=0px,0px,2048px,1152px&resize=960,540",
    time: "1 hour ago"
  },
  {
    title: "Ter Stegen: Clean sheet king!",
    desc: "Marc-André ter Stegen set a new record for clean sheets in a single season.",
    img: "https://www.fcbarcelona.com/photo-resources/2023/05/14/2e7b2e2e-2b2e-4e2e-8e2e-2e2e2e2e2e2e/terstegen.jpg?width=1200&height=750",
    time: "2 hours ago"
  },
];

const trendingTopics = [
  { topic: '#BarcaWin', posts: '120K posts' },
  { topic: '#ChampionsLeague', posts: '80K posts' },
  { topic: 'Xavi', posts: '50K posts' },
  { topic: 'Lewandowski', posts: '30K posts' },
  { topic: '#Messi', posts: '200K posts' },
  { topic: '#ViscaBarca', posts: '90K posts' },
];

const TrendingTab = () => (
  <div className="max-w-xl mx-auto">
    {trendingTopics.map((t, i) => (
      <div key={i} className="flex justify-between items-center py-3 border-b border-gray-800">
        <div>
          <div className="text-gray-400 text-xs">Trending</div>
          <div className="font-bold text-white">{t.topic}</div>
        </div>
        <div className="text-gray-500 text-xs">{t.posts}</div>
      </div>
    ))}
  </div>
);

const NewsTab = () => (
  <div className="max-w-xl mx-auto">
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Breaking: Barcelona wins the Copa del Rey!</div>
      <div className="text-gray-400 text-sm mb-2">Barcelona defeated their rivals in a thrilling final to claim the trophy.</div>
      <img src="https://pbs.twimg.com/media/GK7Qw1bWwAAwQwA?format=jpg&name=large" alt="Barca News" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">2 hours ago · Sports News</div>
    </div>
    {moreBarcaNews.map((news, i) => (
      <div key={i} className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
        <div className="font-bold text-white mb-1">{news.title}</div>
        <div className="text-gray-400 text-sm mb-2">{news.desc}</div>
        <img src={news.img} alt={news.title} className="rounded-xl mb-2 max-h-80 object-cover w-full" />
        <div className="text-gray-500 text-xs">{news.time} · Barcelona</div>
      </div>
    ))}
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Real Madrid sign new striker</div>
      <div className="text-gray-400 text-sm mb-2">Real Madrid have announced the signing of a new forward for next season.</div>
      <img src="https://e00-marca.uecdn.es/assets/multimedia/imagenes/2023/07/15/16894368028241.jpg" alt="Real Madrid" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">3 hours ago · Football News</div>
    </div>
  </div>
);

const SportsTab = () => (
  <div className="max-w-xl mx-auto">
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Barça reach the Champions League semi-finals!</div>
      <div className="text-gray-400 text-sm mb-2">FC Barcelona continues their amazing run in Europe this season.</div>
      <img src="https://pbs.twimg.com/media/GK7Qw1bWwAAwQwA?format=jpg&name=large" alt="Barca Sports" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">Champions League · Trending</div>
    </div>
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Manchester City win Premier League</div>
      <div className="text-gray-400 text-sm mb-2">City clinched the title after a dramatic final day.</div>
      <img src="https://static.standard.co.uk/2023/05/21/17/newFile-1.jpg?width=1200&height=800&fit=crop" alt="Man City" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">Premier League · 1 hour ago</div>
    </div>
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Messi scores a hat-trick for Inter Miami</div>
      <div className="text-gray-400 text-sm mb-2">Lionel Messi continues to shine in the MLS with another stunning performance.</div>
      <img src="https://phantom-marca.unidadeditorial.es/6e7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e/resize/1200/f/jpg/assets/multimedia/imagenes/2023/08/20/16925472028241.jpg" alt="Messi" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">MLS · 2 hours ago</div>
    </div>
  </div>
);

const EntertainmentTab = () => (
  <div className="max-w-xl mx-auto">
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Shakira celebrates Barcelona's victory!</div>
      <div className="text-gray-400 text-sm mb-2">The Colombian superstar shared her excitement on social media after Barça's win.</div>
      <img src="https://static.independent.co.uk/2022/06/04/09/newFile-2.jpg" alt="Shakira" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">Entertainment · 1 hour ago</div>
    </div>
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Gerard Piqué launches new football project</div>
      <div className="text-gray-400 text-sm mb-2">The former Barcelona defender is starting a new sports venture in Spain.</div>
      <img src="https://e00-marca.uecdn.es/assets/multimedia/imagenes/2023/06/01/16856352028241.jpg" alt="Pique" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">Entertainment · 2 hours ago</div>
    </div>
    <div className="bg-black rounded-xl p-4 mb-4 border border-gray-800">
      <div className="font-bold text-white mb-1">Barcelona players attend movie premiere</div>
      <div className="text-gray-400 text-sm mb-2">Several Barça stars were spotted at the red carpet of a new film in Barcelona.</div>
      <img src="https://www.fcbarcelona.com/photo-resources/2023/05/14/2e7b2e2e-2b2e-4e2e-8e2e-2e2e2e2e2e2e/terstegen.jpg?width=1200&height=750" alt="Barca Movie" className="rounded-xl mb-2 max-h-80 object-cover w-full" />
      <div className="text-gray-500 text-xs">Entertainment · 3 hours ago</div>
    </div>
  </div>
);

export default function Explore() {
  const [activeTab, setActiveTab] = useState('For You');
  let content;
  if (activeTab === 'For You') content = <ForYouTab />;
  else if (activeTab === 'Trending') content = <TrendingTab />;
  else if (activeTab === 'News') content = <NewsTab />;
  else if (activeTab === 'Sports') content = <SportsTab />;
  else if (activeTab === 'Entertainment') content = <EntertainmentTab />;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-10 bg-black backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center px-4 py-3 gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-black text-white rounded-full py-2 pl-10 pr-4 outline-none border border-gray-800 focus:border-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
          <button className="ml-2 p-2 rounded-full hover:bg-gray-800">
            <Settings className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="flex border-b border-gray-800">
          {['For You', 'Trending', 'News', 'Sports', 'Entertainment'].map(tab => (
            <button
              key={tab}
              className={`flex-1 py-3 text-center font-bold focus:outline-none text-white border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500' : 'border-transparent hover:bg-gray-900'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {content}
      </div>
    </div>
  );
} 