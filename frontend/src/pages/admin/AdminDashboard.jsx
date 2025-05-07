import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from '../../store/slices/auth';
import { authAxios } from '../../api/useAxios';
import AdminLayout from './components/AdminLayout';
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/UserManagement';
import ReportsManagement from './components/ReportsManagement';


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    tweets: 0,
    messages: 0,
    reports: 0
  });
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]); // New state for banned users
  const [reportedTweets, setReportedTweets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userGrowthLabels, setUserGrowthLabels] = useState([]);
  const [tweetActivityData, setTweetActivityData] = useState([]);
  const [tweetActivityLabels, setTweetActivityLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch user counts (assuming you have an endpoint for this)
        const usersResponse = await authAxios.get('/admin/users/');
        setStats(prevStats => ({ ...prevStats, users: usersResponse.data.count || usersResponse.data.length }));
        setUsers(usersResponse.data.results || usersResponse.data); // Handle paginated or non-paginated response

        // Fetch banned users
        const bannedUsersResponse = await authAxios.get('/admin/users/banned/');
        setBannedUsers(bannedUsersResponse.data.results || bannedUsersResponse.data);

        // Fetch reported tweets (adjust endpoint if needed)
        const reportsResponse = await authAxios.get('/reported/'); // Assuming an endpoint for reported content
        setReportedTweets(reportsResponse.data.results || reportsResponse.data.results); // Handle pagination

        // Fetch total tweet counts (assuming you have an endpoint)
        const tweetsResponse = await authAxios.get('/tweets'); // Assuming an endpoint for all tweets
        setStats(prevStats => ({ ...prevStats, tweets: tweetsResponse.data.count || tweetsResponse.data.length }));
        const allTweets = tweetsResponse.data.results || tweetsResponse.data;

        const today = new Date();
        const last7Days = Array(7).fill().map((_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });

        // Count tweets by day for the last 7 days
        const tweetsByDay = {};
        last7Days.forEach(day => tweetsByDay[day] = 0);

        allTweets.forEach(tweet => {
          const tweetDate = new Date(tweet.createdAt);
          const dayLabel = tweetDate.toLocaleDateString('en-US', { weekday: 'short' });
          if (tweetsByDay[dayLabel] !== undefined) {
            tweetsByDay[dayLabel]++;
          }
        });

        setTweetActivityLabels(last7Days);
        setTweetActivityData(last7Days.map(day => tweetsByDay[day]));

        // Process user data for chart (new signups in last 7 days)
        const usersByDay = {};
        last7Days.forEach(day => usersByDay[day] = 0);

        usersResponse.data.results?.forEach(user => { // Assuming paginated user data
          const userDate = new Date(user.createdAt);
          const dayLabel = userDate.toLocaleDateString('en-US', { weekday: 'short' });
          if (usersByDay[dayLabel] !== undefined) {
            usersByDay[dayLabel]++;
          }
        });
        if (!usersResponse.data.results) { // Handle non-paginated user data
          usersResponse.data.forEach(user => {
            const userDate = new Date(user.createdAt);
            const dayLabel = userDate.toLocaleDateString('en-US', { weekday: 'short' });
            if (usersByDay[dayLabel] !== undefined) {
              usersByDay[dayLabel]++;
            }
          });
        }

        setUserGrowthLabels(last7Days);
        setUserGrowthData(last7Days.map(day => usersByDay[day]));

        // Create some system notifications based on data
        const systemNotifications = [];

        if (reportsResponse.data.length > 0 || reportsResponse.data.results?.length > 0) {
          const reportCount = reportsResponse.data.length || reportsResponse.data.results.length;
          systemNotifications.push({
            type: 'warning',
            title: 'Content Reports',
            message: `There are ${reportCount} reported tweets requiring review.`,
            time: 'Now'
          });
        }

        // Check for new users today (approximate based on fetched users)
        const todayLabel = today.toLocaleDateString('en-US', { weekday: 'short' });
        const usersToday = usersByDay[todayLabel] || 0;
        if (usersToday > 0) {
          systemNotifications.push({
            type: 'info',
            title: 'New Users',
            message: `${usersToday} new users joined today.`,
            time: 'Today'
          });
        }

        // Add system status notification
        systemNotifications.push({
          type: 'info',
          title: 'System Status',
          message: 'All systems operating normally.',
          time: 'Just now'
        });

        setNotifications(systemNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setNotifications([{
          type: 'error',
          title: 'API Error',
          message: `Failed to fetch data: ${error.message}`,
          time: 'Just now'
        }]);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const handleLoagout = () => {
    dispatch(logout())
    navigate("/auth")
  }
  const handleVerifyUser = async (userId) => {
    try {
      await authAxios.post(`/admin/users/${userId}/verify/`); // Use POST for actions
      // Update the users list to reflect the change
      setUsers(users.map(user =>
        user.id === userId ? { ...user, verified: true } : user
      ));
      setNotifications([
        ...notifications,
        {
          type: 'info',
          title: 'User Verified',
          message: `User with ID ${userId} has been verified.`,
          time: 'Just now'
        }
      ]);
    } catch (error) {
      console.error(`Error verifying user with ID: ${userId}`, error);
      setNotifications([
        ...notifications,
        {
          type: 'error',
          title: 'Verification Failed',
          message: `Failed to verify user: ${error.message}`,
          time: 'Just now'
        }
      ]);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await authAxios.post(`/admin/users/${userId}/ban/`); // Use POST for actions
      // Update the users list to reflect the change
      setUsers(users.filter(user => user.id !== userId));
      // Remove from banned users list if present
      setBannedUsers(bannedUsers.filter(user => user.id !== userId));
      setNotifications([
        ...notifications,
        {
          type: 'info',
          title: 'User Banned',
          message: `User with ID ${userId} has been banned.`,
          time: 'Just now'
        }
      ]);
    } catch (error) {
      console.error(`Error banning user with ID: ${userId}`, error);
      setNotifications([
        ...notifications,
        {
          type: 'error',
          title: 'Ban Failed',
          message: `Failed to ban user: ${error.message}`,
          time: 'Just now'
        }
      ]);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await authAxios.post(`/admin/users/${userId}/unban/`);
      setBannedUsers(bannedUsers.filter((user) => user.id !== userId));
      setNotifications([
        ...notifications,
        {
          type: 'info',
          title: 'User Unbanned',
          message: `User with ID ${userId} has been unbanned.`,
          time: 'Just now',
        },
      ]);
    } catch (error) {
      console.error(`Error unbanning user ${userId}`, error);
      setNotifications([
        ...notifications,
        {
          type: 'error',
          title: 'Unban Failed',
          message: `Failed to unban user: ${error.message}`,
          time: 'Just now'
        }
      ]);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await authAxios.delete(`/tweets/${tweetId}/`); // Assuming a standard DELETE endpoint for tweets
      // Update the reported tweets list to reflect the change
      setReportedTweets(reportedTweets.filter(tweet => tweet.id !== tweetId));
      setNotifications([
        ...notifications,
        {
          type: 'info',
          title: 'Tweet Deleted',
          message: `Tweet with ID ${tweetId} has been deleted.`,
          time: 'Just now'
        }
      ]);
    } catch (error) {
      console.error(`Error deleting tweet with ID: ${tweetId}`, error);
      setNotifications([
        ...notifications,
        {
          type: 'error',
          title: 'Delete Failed',
          message: `Failed to delete tweet: ${error.message}`,
          time: 'Just now'
        }
      ]);
    }
  };

  const handleMarkReviewed = async (tweetId) => {
    try {
      await authAxios.patch(`/reported/${tweetId}/`, { reviewed: true }); // Assuming a PATCH to update review status
      // Update the reported tweets list to reflect the change
      setReportedTweets(reportedTweets.filter(tweet => tweet.id !== tweetId));
      setNotifications([
        ...notifications,
        {
          type: 'info',
          title: 'Review Complete',
          message: `Tweet with ID ${tweetId} marked as reviewed.`,
          time: 'Just now'
        }
      ]);
    } catch (error) {
      console.error(`Error marking tweet with ID: ${tweetId} as reviewed`, error);
      setNotifications([
        ...notifications,
        {
          type: 'error',
          title: 'Review Failed',
          message: `Failed to mark tweet as reviewed: ${error.message}`,
          time: 'Just now'
        }
      ]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            stats={stats}
            userGrowthData={userGrowthData}
            userGrowthLabels={userGrowthLabels}
            tweetActivityData={tweetActivityData}
            tweetActivityLabels={tweetActivityLabels}
            users={users}
            notifications={notifications}
            handleVerifyUser={handleVerifyUser}
            handleBanUser={handleBanUser}
          />
        );
      case 'users':
        return (
          <UserManagement
            users={users}
            bannedUsers={bannedUsers}
            handleVerifyUser={handleVerifyUser}
            handleBanUser={handleBanUser}
            handleUnbanUser={handleUnbanUser}
          />
        );
      case 'reports':
        return (
          <ReportsManagement
            reportedTweets={reportedTweets}
            handleDeleteTweet={handleDeleteTweet}
            handleMarkReviewed={handleMarkReviewed}
          />
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLoagout}
    >
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
    </AdminLayout>
  );
}

