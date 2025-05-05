import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { authAxios } from '../api/useAxios';
import notificationEvents from '../utils/notificationEvents';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Heart, MessageCircle, Bell, Check } from 'lucide-react';

export default function Notifications() {
    const { user } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socketReady, setSocketReady] = useState(false);
    const navigate = useNavigate();

    // Fetch notifications function - memoized with useCallback
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            // Correct path for getting notifications
            const response = await authAxios.get('/notifications/');
            console.log('Notifications fetched:', response.data);
            
            // Make sure the data is an array
            if (response.data && Array.isArray(response.data.results)) {
                // If data comes in {results: [...]} format
                setNotifications(response.data.results);
            } else if (Array.isArray(response.data)) {
                // If data comes directly as an array
                setNotifications(response.data);
            } else {
                console.warn('Unexpected notification data format:', response.data);
                setNotifications([]);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Connect to WebSocket when component mounts
    useEffect(() => {
        // Connect to socket
        notificationEvents.connect()
            .then(() => {
                setSocketReady(true);
                console.log("Socket connection established successfully");
                // Fetch notifications after socket is connected
                fetchNotifications();
            })
            .catch(error => {
                console.error("Failed to establish socket connection:", error);
                // Still try to fetch notifications even if socket fails
                fetchNotifications();
            });

        // Listen for new notifications
        const unsubscribeNewNotification = notificationEvents.on('notification_message', (newNotification) => {
            console.log('New notification received:', newNotification);
            // Add new notification at the top of the list
            setNotifications(prev => {
                // Check if notification already exists to avoid duplicates
                const exists = prev.some(n => n.id === newNotification.id);
                if (exists) {
                    return prev;
                }
                return [newNotification, ...prev];
            });
        });

        // Listen for read status updates
        const unsubscribeNotificationRead = notificationEvents.on('notification_read', (data) => {
            console.log('Notification read status updated:', data);
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === data.notification_id 
                        ? { ...notification, is_read: true } 
                        : notification
                )
            );
        });

        // Listen for all notifications read status update
        const unsubscribeAllRead = notificationEvents.on('all_notifications_read', () => {
            console.log('All notifications marked as read');
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, is_read: true }))
            );
        });

        return () => {
            unsubscribeNewNotification();
            unsubscribeNotificationRead();
            unsubscribeAllRead();
        };
    }, [fetchNotifications]);

    // Set up polling for notifications
    useEffect(() => {
        // Set up interval to refresh notifications every 30 seconds
        const intervalId = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    // Format date in relative format
    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { 
                addSuffix: true,
                locale: enUS
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    };

    // Mark notification as read
    const handleMarkAsRead = (notificationId) => {
        if (socketReady) {
            notificationEvents.markAsRead(notificationId);
            
            // Update local state immediately for better UX
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        }
    };

    // Mark all notifications as read
    const handleMarkAllAsRead = async () => {
        if (socketReady) {
            try {
                await notificationEvents.markAllAsRead();
                
                // Update local state immediately for better UX
                setNotifications(prev => 
                    prev.map(notification => ({ ...notification, is_read: true }))
                );
            } catch (error) {
                console.error("Failed to mark all notifications as read:", error);
            }
        }
    };

    // Follow back a user
    const handleFollowBack = async (userId, event) => {
        event.stopPropagation(); // Prevent notification click event
        
        try {
            await authAxios.post(`/users/${userId}/follow/`);
            console.log('Successfully followed user');
            
            // Update the notification to show "Following" instead of "Follow back"
            setNotifications(prev => 
                prev.map(notification => 
                    notification.sender?.id === userId && notification.notification_type === 'follow'
                        ? { ...notification, followed_back: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Failed to follow user:', error);
        }
    };

    // Extract post ID from related_object_info
    const getPostId = (notification) => {
        const { notification_type, related_object_info } = notification;
        
        if (!related_object_info) return null;
        
        if (notification_type === 'like' || notification_type === 'comment') {
            if (related_object_info.type === 'tweet') {
                return related_object_info.id;
            }
        }
        
        return null;
    };

    // Navigate to relevant content based on notification type
    const handleNotificationClick = (notification) => {
        console.log("Notification clicked:", notification);
        
        // Mark as read if not already read
        if (!notification.is_read) {
            handleMarkAsRead(notification.id);
        }
        
        const { notification_type, sender, related_object_info } = notification;
        const postId = getPostId(notification);
        
        switch (notification_type) {
            case 'follow':
                // Navigate to follower's profile
                if (sender && sender.username) {
                    console.log(`Navigating to profile: /profile/${sender.username}`);
                    navigate(`/profile/${sender.username}`);
                }
                break;
                
            case 'like':
                // Navigate to the liked post - use status/:id route instead of post/:id
                if (postId) {
                    console.log(`Navigating to post: /status/${postId}`);
                    // Always mark as read when navigating to the post
                    handleMarkAsRead(notification.id);
                    navigate(`/status/${postId}`);
                }
                break;
                
            case 'comment':
                // Navigate to the comment on the post - use status/:id route instead of post/:id
                if (postId) {
                    const commentId = related_object_info?.id || '';
                    console.log(`Navigating to post with comment: /status/${postId}?comment=${commentId}`);
                    // Always mark as read when navigating to the post
                    handleMarkAsRead(notification.id);
                    navigate(`/status/${postId}?comment=${commentId}`);
                }
                break;
                
            default:
                // Default behavior for other notification types
                if (sender && sender.username) {
                    console.log(`Navigating to profile: /profile/${sender.username}`);
                    navigate(`/profile/${sender.username}`);
                }
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'follow':
                return <UserPlus className="h-5 w-5 text-blue-500" />;
            case 'like':
                return <Heart className="h-5 w-5 text-red-500" />;
            case 'comment':
                return <MessageCircle className="h-5 w-5 text-green-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    // Get default avatar URL
    const getDefaultAvatar = () => {
        return 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';
    };

    // Get sender's avatar URL with API base URL if needed
    const getSenderAvatarUrl = (sender) => {
        if (!sender) return getDefaultAvatar();
        
        // If avatar_url is already a full URL, use it
        if (sender.avatar_url && (sender.avatar_url.startsWith('http://') || sender.avatar_url.startsWith('https://'))) {
            return sender.avatar_url;
        }
        
        // If avatar_url is a relative path, prepend the API base URL
        if (sender.avatar_url && sender.avatar_url.startsWith('/')) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            return `${apiUrl}${sender.avatar_url}`;
        }
        
        // If avatar_url is a relative path without leading slash
        if (sender.avatar_url) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            return `${apiUrl}/${sender.avatar_url}`;
        }
        
        return getDefaultAvatar();
    };

    // Get post content from related_object_info
    const getPostContent = (notification) => {
        const { related_object_info } = notification;
        
        if (!related_object_info) return null;
        
        if (related_object_info.type === 'tweet') {
            return related_object_info.content;
        }
        
        return null;
    };

    // Get comment content from related_object_info
    const getCommentContent = (notification) => {
        const { notification_type, text, related_object_info } = notification;
        
        if (notification_type === 'comment') {
            return text || (related_object_info?.content || null);
        }
        
        return null;
    };

    // Render notification content based on type
    const renderNotificationContent = (notification) => {
        const { notification_type, sender, text, followed_back, related_object_info } = notification;
        
        // Ensure sender has an avatar_url or use default
        const avatarUrl = getSenderAvatarUrl(sender);
        const postContent = getPostContent(notification);
        const commentContent = getCommentContent(notification);
        
        switch (notification_type) {
            case 'follow':
                return (
                    <div className="flex items-start w-full">
                        <div className="flex-shrink-0 mr-3">
                            <img 
                                src={avatarUrl} 
                                alt={sender?.username || 'User'} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 hover:border-blue-500 transition-colors"
                                onError={(e) => {
                                    console.log("Image load error, using default avatar");
                                    e.target.onerror = null;
                                    e.target.src = getDefaultAvatar();
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                <div className="text-white">
                                    <Link to={`/profile/${sender?.username}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                        {sender?.name || sender?.username || 'User'}
                                    </Link>
                                    <span className="ml-1">followed you</span>
                                </div>
                                <div className="text-gray-500 text-sm">@{sender?.username || 'user'}</div>
                            </div>
                        </div>
                        <div className="ml-auto flex-shrink-0">
                            {!followed_back && (
                                <button 
                                    className="bg-white text-black rounded-full px-4 py-1 text-sm font-bold hover:bg-gray-200 transition-colors"
                                    onClick={(e) => handleFollowBack(sender?.id, e)}
                                >
                                    Follow back
                                </button>
                            )}
                            {followed_back && (
                                <div className="text-gray-500 flex items-center">
                                    <Check className="h-4 w-4 mr-1" />
                                    <span className="text-sm">Following</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
                
            case 'like':
                return (
                    <div className="flex items-start w-full">
                        <div className="flex-shrink-0 mr-3">
                            <img 
                                src={avatarUrl}
                                alt={sender?.username || 'User'} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 hover:border-red-500 transition-colors"
                                onError={(e) => {
                                    console.log("Image load error, using default avatar");
                                    e.target.onerror = null;
                                    e.target.src = getDefaultAvatar();
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                <div className="text-white">
                                    <Link to={`/profile/${sender?.username}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                        {sender?.name || sender?.username || 'User'}
                                    </Link>
                                    <span className="ml-1">liked your post</span>
                                </div>
                                <div className="text-gray-500 text-sm">@{sender?.username || 'user'}</div>
                                {postContent && (
                                    <div className="mt-2 p-3 bg-gray-800 rounded-lg text-gray-300 text-sm border border-gray-700">
                                        {postContent}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            case 'comment':
                return (
                    <div className="flex items-start w-full">
                        <div className="flex-shrink-0 mr-3">
                            <img 
                                src={avatarUrl}
                                alt={sender?.username || 'User'} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 hover:border-green-500 transition-colors"
                                onError={(e) => {
                                    console.log("Image load error, using default avatar");
                                    e.target.onerror = null;
                                    e.target.src = getDefaultAvatar();
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                <div className="text-white">
                                    <Link to={`/profile/${sender?.username}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                        {sender?.name || sender?.username || 'User'}
                                    </Link>
                                    <span className="ml-1">commented on your post</span>
                                </div>
                                <div className="text-gray-500 text-sm">@{sender?.username || 'user'}</div>
                                {commentContent && (
                                    <div className="mt-2 p-3 bg-gray-800 rounded-lg text-gray-300 text-sm border border-gray-700">
                                        {commentContent}
                                    </div>
                                )}
                                {postContent && (
                                    <div className="mt-1 p-3 bg-gray-900 rounded-lg text-gray-400 text-sm border border-gray-800">
                                        <div className="text-xs text-gray-500 mb-1">Original post:</div>
                                        {postContent}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div className="flex items-start w-full">
                        <div className="flex-shrink-0 mr-3">
                            <img 
                                src={avatarUrl}
                                alt={sender?.username || 'User'} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                                onError={(e) => {
                                    console.log("Image load error, using default avatar");
                                    e.target.onerror = null;
                                    e.target.src = getDefaultAvatar();
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                <div className="text-white">
                                    <Link to={`/profile/${sender?.username}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                        {sender?.name || sender?.username || 'User'}
                                    </Link>
                                    <span className="ml-1">{text || 'interacted with you'}</span>
                                </div>
                                <div className="text-gray-500 text-sm">@{sender?.username || 'user'}</div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 border-x border-gray-800 min-h-screen">
            <div className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
                <div className="flex justify-between items-center p-4">
                    <h1 className="text-xl font-bold">Notifications</h1>
                    {notifications.length > 0 && (
                        <button 
                            onClick={handleMarkAllAsRead}
                            className="text-blue-500 hover:text-blue-400 text-sm font-semibold transition-colors flex items-center"
                        >
                            <Check className="h-4 w-4 mr-1" />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>
            
            <div className="divide-y divide-gray-800">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col justify-center items-center p-8 text-gray-500">
                        <Bell className="h-12 w-12 mb-4" />
                        <p className="text-lg font-medium">No notifications yet</p>
                        <p className="text-sm">When someone interacts with you, you'll see it here</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`p-4 hover:bg-gray-900 transition-colors cursor-pointer ${!notification.is_read ? 'bg-gray-900 bg-opacity-50' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex items-center mb-2">
                                <div className="mr-2">
                                    {getNotificationIcon(notification.notification_type)}
                                </div>
                                <div className="text-gray-500 text-sm ml-auto">
                                    {formatDate(notification.created_at)}
                                </div>
                            </div>
                            {renderNotificationContent(notification)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
