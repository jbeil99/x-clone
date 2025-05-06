import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAxios } from '../../api/useAxios';
import {
  Home,
  Users,
  MessageSquare,
  BarChart2,
  Bell,
  Settings,
  Flag,
  User,
  LogOut
} from 'lucide-react';

// Import components
import SidebarItem from './components/SidebarItem';
import StatCard from './components/StatCard';
import UserRow from './components/UserRow';
import TweetRow from './components/TweetRow';
import NotificationCard from './components/NotificationCard';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    tweets: 0,
    messages: 0,
    reports: 0
  });
  const [users, setUsers] = useState([]);
  const [reportedTweets, setReportedTweets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userGrowthLabels, setUserGrowthLabels] = useState([]);
  const [tweetActivityData, setTweetActivityData] = useState([]);
  const [tweetActivityLabels, setTweetActivityLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real application, these would be actual API calls
        // For now, we'll use mock data
        
        // Mock stats data
        setStats({
          users: 1245,
          tweets: 8723,
          messages: 3219,
          reports: 42
        });
        
        // Mock user growth data (last 7 days)
        const mockUserGrowthLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockUserGrowthData = [12, 19, 15, 27, 29, 18, 25];
        setUserGrowthLabels(mockUserGrowthLabels);
        setUserGrowthData(mockUserGrowthData);
        
        // Mock tweet activity data (last 7 days)
        const mockTweetActivityLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const mockTweetActivityData = [67, 89, 120, 105, 138, 145, 132];
        setTweetActivityLabels(mockTweetActivityLabels);
        setTweetActivityData(mockTweetActivityData);
        
        // Mock users data
        const mockUsers = [
          { id: 1, name: 'John Doe', username: 'johndoe', verified: true, profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
          { id: 2, name: 'Jane Smith', username: 'janesmith', verified: false, profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
          { id: 3, name: 'Robert Johnson', username: 'robert', verified: true, profileImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
          { id: 4, name: 'Emily Davis', username: 'emilyd', verified: false, profileImage: 'https://randomuser.me/api/portraits/women/4.jpg' },
          { id: 5, name: 'Michael Brown', username: 'michael', verified: false, profileImage: 'https://randomuser.me/api/portraits/men/5.jpg' }
        ];
        setUsers(mockUsers);
        
        // Mock reported tweets
        const mockReportedTweets = [
          { 
            id: 1, 
            content: 'This is a reported tweet with inappropriate content.', 
            createdAt: '2023-06-15T10:30:00Z',
            reportCount: 5,
            user: { name: 'User One', username: 'user1', verified: false, profileImage: 'https://randomuser.me/api/portraits/men/11.jpg' }
          },
          { 
            id: 2, 
            content: 'Another reported tweet that violates community guidelines.', 
            createdAt: '2023-06-14T14:20:00Z',
            reportCount: 3,
            image: 'https://picsum.photos/500/300',
            user: { name: 'User Two', username: 'user2', verified: true, profileImage: 'https://randomuser.me/api/portraits/women/12.jpg' }
          },
          { 
            id: 3, 
            content: 'This tweet contains spam and has been reported multiple times.', 
            createdAt: '2023-06-13T09:15:00Z',
            reportCount: 8,
            user: { name: 'User Three', username: 'user3', verified: false, profileImage: 'https://randomuser.me/api/portraits/men/13.jpg' }
          }
        ];
        setReportedTweets(mockReportedTweets);
        
        // Mock notifications
        const mockNotifications = [
          { type: 'warning', title: 'Spike in Reports', message: 'Unusual increase in reported content in the last hour.', time: '10 minutes ago' },
          { type: 'error', title: 'System Error', message: 'Database connection issue detected and resolved.', time: '2 hours ago' },
          { type: 'info', title: 'New Update', message: 'Platform updated to version 2.4.1 successfully.', time: '1 day ago' }
        ];
        setNotifications(mockNotifications);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleVerifyUser = (userId) => {
    // In a real app, this would make an API call to verify the user
    console.log(`Verifying user with ID: ${userId}`);
    // Update the users list to reflect the change
    setUsers(users.map(user => 
      user.id === userId ? { ...user, verified: true } : user
    ));
  };

  const handleBanUser = (userId) => {
    // In a real app, this would make an API call to ban the user
    console.log(`Banning user with ID: ${userId}`);
    // Update the users list to reflect the change
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleDeleteTweet = (tweetId) => {
    // In a real app, this would make an API call to delete the tweet
    console.log(`Deleting tweet with ID: ${tweetId}`);
    // Update the reported tweets list to reflect the change
    setReportedTweets(reportedTweets.filter(tweet => tweet.id !== tweetId));
  };

  const handleMarkReviewed = (tweetId) => {
    // In a real app, this would make an API call to mark the tweet as reviewed
    console.log(`Marking tweet with ID: ${tweetId} as reviewed`);
    // Update the reported tweets list to reflect the change
    setReportedTweets(reportedTweets.filter(tweet => tweet.id !== tweetId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users size={24} />} value={stats.users} label="Total Users" />
              <StatCard icon={<BarChart2 size={24} />} value={stats.tweets} label="Total Tweets" />
              <StatCard icon={<MessageSquare size={24} />} value={stats.messages} label="Messages" />
              <StatCard icon={<Flag size={24} />} value={stats.reports} label="Reports" />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <LineChart data={userGrowthData} labels={userGrowthLabels} title="New Users" />
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Tweet Activity</h3>
                <BarChart data={tweetActivityData} labels={tweetActivityLabels} title="Tweets" />
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {users.slice(0, 5).map(user => (
                    <UserRow 
                      key={user.id} 
                      user={user} 
                      onVerify={handleVerifyUser} 
                      onBan={handleBanUser} 
                    />
                  ))}
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">System Notifications</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <NotificationCard key={index} notification={notification} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Users</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                {users.map(user => (
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    onVerify={handleVerifyUser} 
                    onBan={handleBanUser} 
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Content Reports</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Reported Tweets</h3>
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {reportedTweets.map(tweet => (
                  <TweetRow 
                    key={tweet.id} 
                    tweet={tweet} 
                    onDelete={handleDeleteTweet} 
                    onMarkReviewed={handleMarkReviewed} 
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Settings</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="X Clone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Admin Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="admin@example.com"
                  />
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="maintenance-mode" 
                    className="mr-2"
                  />
                  <label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-400">Enable Maintenance Mode</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="auto-moderation" 
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="auto-moderation" className="text-sm font-medium text-gray-400">Enable Automatic Content Moderation</label>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-gray-900 flex flex-col">
        <div className="p-4 flex items-center justify-center md:justify-start">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="ml-2 text-xl font-bold hidden md:block">Admin Panel</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Users" 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
          />
          <SidebarItem 
            icon={<Flag size={20} />} 
            label="Reports" 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>
        <div className="p-4">
          <SidebarItem 
            icon={<LogOut size={20} />} 
            label="Logout" 
            onClick={() => console.log('Logout clicked')} 
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderContent()
          )}
        </motion.div>
      </div>
    </div>
  );
}
