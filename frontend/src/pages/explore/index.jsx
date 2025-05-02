import { useState } from 'react';
import { Settings } from 'lucide-react';
import ForYouTab from './ForYouTab';
import TrendingTab from './TrendingTab';
import NewsTab from './NewsTab';
import SportsTab from './SportsTab';

export default function Explore() {
  const [activeTab, setActiveTab] = useState('For You');
  let content;
  if (activeTab === 'For You') content = <ForYouTab />;
  else if (activeTab === 'Trending') content = <TrendingTab />;
  else if (activeTab === 'News') content = <NewsTab />;
  else if (activeTab === 'Sports') content = <SportsTab />;

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
          {['For You', 'Trending', 'News', 'Sports'].map(tab => (
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
