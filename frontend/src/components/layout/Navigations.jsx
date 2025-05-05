import {
    Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Briefcase, Users, Zap, CheckCircle2, MessageCircle, Image, MapPin, Calendar, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from 'react';
import { authAxios } from '../../api/useAxios';
import messageEvents from '../../utils/messageEvents';
import notificationEvents from '../../utils/notificationEvents';
import { UserAction } from './UserAction';

export default function Navigations() {
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [socketReady, setSocketReady] = useState(false);
    const location = useLocation();

    // Fetch unread message count - memoized with useCallback
    const fetchUnreadMessages = useCallback(async () => {
        try {
            const response = await authAxios.get('/chat/unread-count/');
            setUnreadMessageCount(response.data.count);
        } catch (error) {
            console.error("Failed to fetch unread message count:", error);
        }
    }, []);

    // Fetch unread notification count - memoized with useCallback
    const fetchUnreadNotifications = useCallback(async () => {
        try {
            const response = await authAxios.get('/notifications/unread_count/');
            console.log("Unread notification count fetched:", response.data);
            setUnreadNotificationCount(response.data.count);
        } catch (error) {
            console.error("Failed to fetch unread notification count:", error);
        }
    }, []);

    // Handle messages
    useEffect(() => {
        // Initial fetch
        fetchUnreadMessages();

        // Listen for message updates
        const unsubscribe = messageEvents.on('unreadMessagesUpdated', (count) => {
            setUnreadMessageCount(count);
        });

        // Polling for messages
        const intervalId = setInterval(fetchUnreadMessages, 60000);

        return () => {
            unsubscribe();
            clearInterval(intervalId);
        };
    }, [fetchUnreadMessages]);

    // Set up WebSocket connection for notifications
    useEffect(() => {
        // Connect to the socket for notifications
        notificationEvents.connect()
            .then(() => {
                setSocketReady(true);
                console.log("Socket connection established successfully in Navigations");
                // Fetch notification count after socket is connected
                fetchUnreadNotifications();
            })
            .catch(error => {
                console.error("Failed to establish socket connection:", error);
                // Still try to fetch notification count even if socket fails
                fetchUnreadNotifications();
            });
        
        // Listen for unread notification count updates
        const unsubscribeUnreadCount = notificationEvents.on('unread_count', (data) => {
            console.log("Unread notification count updated:", data);
            if (data && typeof data.count === 'number') {
                setUnreadNotificationCount(data.count);
            }
        });
        
        // Listen for new notifications
        const unsubscribeNewNotification = notificationEvents.on('notification_message', (data) => {
            console.log("New notification received in Navigations:", data);
            // Only increment counter if not on notifications page
            if (location.pathname !== '/notifications') {
                setUnreadNotificationCount(prev => prev + 1);
            }
        });
        
        // Listen for notification read status updates
        const unsubscribeNotificationRead = notificationEvents.on('notification_read', (data) => {
            console.log("Notification marked as read in Navigations:", data);
            // Update counter when a notification is marked as read
            if (data && typeof data.unread_count === 'number') {
                setUnreadNotificationCount(data.unread_count);
            } else {
                // If unread_count is not provided, decrement the counter
                setUnreadNotificationCount(prev => Math.max(0, prev - 1));
            }
        });
        
        // Listen for all notifications read status update
        const unsubscribeAllRead = notificationEvents.on('all_notifications_read', () => {
            console.log("All notifications marked as read in Navigations");
            // Reset counter when all notifications are marked as read
            setUnreadNotificationCount(0);
        });

        // Polling for notification count
        const intervalId = setInterval(fetchUnreadNotifications, 60000);

        return () => {
            unsubscribeUnreadCount();
            unsubscribeNewNotification();
            unsubscribeNotificationRead();
            unsubscribeAllRead();
            clearInterval(intervalId);
        };
    }, [location.pathname, fetchUnreadNotifications]);

    const sidebarItems = [
        { icon: Home, text: 'Home', path: '/' },
        { icon: Search, text: 'Explore', path: '/explore' },
        { icon: Bell, text: 'Notifications', path: '/notifications' },
        { icon: Mail, text: 'Messages', path: '/messages' },
        { icon: Sparkles, text: 'Grok', path: '/grok' },
        { icon: Bookmark, text: 'Bookmarks', path: '/bookmarks' },
        { icon: Briefcase, text: 'Jobs', path: '/jobs' },
        { icon: Users, text: 'Communities', path: '/communities' },
        { icon: Zap, text: 'Premium', path: '/premium' },
        { icon: CheckCircle2, text: 'Verified Orgs', path: '/verified-orgs' },
        { icon: User, text: 'Profile', path: `/profile/${user?.username}` },
        { icon: MoreHorizontal, text: 'More', path: '/more' },
    ];

    return (
        <div className="flex flex-col w-16 sm:w-[275px] px-2 sm:px-4 py-4 border-r border-gray-800 items-center sm:items-stretch sticky top-0 h-screen">
            <div>
                <div className="text-xl font-bold mb-8 ml-3">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                        <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
                    </svg>
                </div>
                <nav className="space-y-2 flex flex-col items-center sm:items-stretch">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.text}
                            to={item.path}
                            className={`flex items-center gap-4 text-lg font-medium hover:bg-gray-900 px-4 py-3 rounded-full transition-colors relative ${location.pathname === item.path ? 'font-bold' : ''}`}
                        >
                            <div className="relative">
                                <item.icon className={`h-7 w-7 sm:h-6 sm:w-6 mx-auto ${location.pathname === item.path ? 'text-blue-500' : 'text-white'}`} />
                                {item.text === 'Messages' && unreadMessageCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                    </div>
                                )}
                                {item.text === 'Notifications' && unreadNotificationCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                                    </div>
                                )}
                            </div>
                            <span className="hidden sm:inline">{item.text}</span>
                        </Link>
                    ))}
                </nav>
                <button className="mt-6 w-full bg-white text-black rounded-full py-3 text-lg font-bold shadow hover:bg-gray-200 transition-colors hidden sm:block">
                    Post
                </button>

                <div className="flex items-center gap-3 px-2 py-3 hover:bg-gray-900 rounded-full cursor-pointer mt-3 hidden sm:flex">
                    <img src={user?.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{user?.name}</div>
                        <div className="text-gray-500 text-sm truncate">@{user?.username}</div>
                    </div>
                    <UserAction className="text-gray-500" />
                </div>
            </div>
        </div>
    )
}
