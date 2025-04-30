import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Briefcase, Users, Zap, CheckCircle2, MessageCircle, Image, MapPin, Calendar, Link as LinkIcon, Sparkles, ArrowUp, X, Send
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { authAxios } from '../../api/useAxios';
import { currentUser } from '../../api/users';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isMessagesPage = location.pathname === '/messages';
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [unreadByUser, setUnreadByUser] = useState({});
    const [me, setMe] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isMessagesTabOpen, setIsMessagesTabOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);
    
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await currentUser();
                setMe(userData);
                return userData;
            } catch (error) {
                console.error("Failed to fetch current user:", error);
                return null;
            }
        };
        
        fetchCurrentUser();
    }, []);
    
    useEffect(() => {
        if (!me) return;
        
        // Connect to WebSocket
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${me.id}/`);
        
        ws.onopen = () => {
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.action === "message" && data.sender !== me.id) {
                // If we're not viewing messages from this sender, increment the unread count
                const isViewingSender = (isMessagesPage || isMessagesTabOpen) && selectedUser && data.sender === selectedUser.id;
                
                if (!isViewingSender) {
                    setUnreadMessageCount(prev => prev + 1);
                    
                    // Update last message for this user if we have them in our list
                    if (users.find(u => u.id === data.sender)) {
                        setLastMessages(prev => ({
                            ...prev,
                            [data.sender]: {
                                content: data.content,
                                timestamp: data.timestamp || new Date().toISOString()
                            }
                        }));
                    }
                    
                    // Play notification sound
                    try {
                        const audio = new Audio('/notification.mp3');
                        audio.play().catch(e => console.log("Audio play failed:", e));
                    } catch (error) {
                        console.error("Error playing notification sound:", error);
                    }
                }
                
                // If messages tab is open and we have a selected user that matches the sender
                if (isMessagesTabOpen && selectedUser && data.sender === selectedUser.id) {
                    // Add the message to the current conversation
                    const newMsg = {
                        id: Date.now(),
                        sender: data.sender,
                        recipient: me.id,
                        content: data.content,
                        timestamp: data.timestamp || new Date().toISOString(),
                        is_read: true // Mark as read since we're viewing it
                    };
                    
                    setMessages(prev => [...prev, newMsg]);
                    
                    // Update the last message for this user
                    setLastMessages(prev => ({
                        ...prev,
                        [data.sender]: {
                            content: data.content,
                            timestamp: data.timestamp || new Date().toISOString()
                        }
                    }));
                    
                    // Mark as read in the backend
                    authAxios.post('chat/mark-as-read/', { sender: data.sender })
                        .catch(error => console.error("Failed to mark messages as read:", error));
                }
            }
        };
        
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        
        ws.onclose = (event) => {
            setTimeout(() => {
                if (me) {
                    const newWs = new WebSocket(`ws://localhost:8000/ws/chat/${me.id}/`);
                    setSocket(newWs);
                }
            }, 3000);
        };
        
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [me, isMessagesPage]);
    
    // Fetch unread messages count when component mounts and periodically
    useEffect(() => {
        const fetchUnreadMessages = async () => {
            if (!me) return;
            
            try {
                // Get total unread count
                const totalResponse = await authAxios.get('/chat/unread-count/');
                setUnreadMessageCount(totalResponse.data.count);
                
                // Get unread count by user
                const byUserResponse = await authAxios.get('/chat/unread-by-user/');
                setUnreadByUser(byUserResponse.data);
            } catch (error) {
                console.error("Failed to fetch unread message count:", error);
            }
        };
        
        // Initial fetch
        fetchUnreadMessages();
        
        // Set up periodic polling (every 15 seconds) as a fallback
        const intervalId = setInterval(fetchUnreadMessages, 15000);
        
        return () => clearInterval(intervalId);
    }, [me]);
    
    // Fetch users for messages tab
    useEffect(() => {
        const fetchUsers = async () => {
            if (!me) return;
            
            try {
                // Fetch users
                const res = await authAxios.get("chat/all-users/");
                setUsers(res.data);
                
                // Initialize last messages object
                const lastMsgsObj = {};
                for (const user of res.data) {
                    lastMsgsObj[user.id] = { content: "", timestamp: null };
                }
                setLastMessages(lastMsgsObj);
                
                // Fetch last message for each user
                for (const user of res.data) {
                    try {
                        const msgRes = await authAxios.get(`chat/messages/?user=${user.id}`);
                        
                        if (msgRes.data.length > 0) {
                            const lastMsg = msgRes.data[msgRes.data.length - 1];
                            setLastMessages(prev => ({
                                ...prev,
                                [user.id]: { 
                                    content: lastMsg.content, 
                                    timestamp: lastMsg.timestamp 
                                }
                            }));
                        }
                    } catch (err) {
                        console.error(`Error fetching messages for user ${user.id}:`, err);
                    }
                }
                
                // Make sure to fetch unread counts when opening the messages tab
                // This ensures the badges remain visible
                const byUserResponse = await authAxios.get('/chat/unread-by-user/');
                setUnreadByUser(byUserResponse.data);
            } catch (error) {
                console.error("Failed to load users:", error);
            }
        };
        
        if (isMessagesTabOpen) {
            fetchUsers();
        }
    }, [me, isMessagesTabOpen]);
    
    // Reset unread count only when selecting a specific user
    useEffect(() => {
        if (selectedUser) {
            // Reset unread count for this specific user only
            if (unreadByUser[selectedUser.id]) {
                // Update total unread count
                setUnreadMessageCount(prev => Math.max(0, prev - unreadByUser[selectedUser.id]));
                
                // Reset unread count for this specific user
                setUnreadByUser(prev => ({
                    ...prev,
                    [selectedUser.id]: 0
                }));
                
                // Mark messages as read in the backend
                authAxios.post('chat/mark-as-read/', { sender: selectedUser.id })
                    .catch(error => console.error("Failed to mark messages as read:", error));
            }
        } else if (isMessagesPage) {
            // Only reset all counts if on the main messages page and no user is selected
            if (unreadMessageCount > 0) {
                setUnreadMessageCount(0);
                setUnreadByUser({});
                
                // Mark all messages as read
                authAxios.post('chat/mark-all-as-read/')
                    .catch(error => console.error("Failed to mark all messages as read:", error));
            }
        }
    }, [selectedUser, isMessagesPage, unreadByUser, unreadMessageCount]);
    
    // Fetch messages for selected user
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            
            try {
                const response = await authAxios.get(`chat/messages/?user=${selectedUser.id}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
        
        fetchMessages();
    }, [selectedUser]);
    
    // Scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    // Handle clicking outside messages tab to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            const messagesTab = document.getElementById('messages-tab');
            if (messagesTab && !messagesTab.contains(event.target) && isMessagesTabOpen) {
                setIsMessagesTabOpen(false);
                setSelectedUser(null);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMessagesTabOpen]);
    
    const sidebarItems = [
        { icon: Home, text: 'Home', path: '/' },
        { icon: Search, text: 'Explore', path: '/explore' },
        { icon: Bell, text: 'Notifications', path: '/notifications' },
        { icon: Mail, text: 'Messages', path: '/messages', badge: unreadMessageCount },
        { icon: Sparkles, text: 'Grok', path: '/grok' },
        { icon: Bookmark, text: 'Bookmarks', path: '/bookmarks' },
        { icon: Briefcase, text: 'Jobs', path: '/jobs' },
        { icon: Users, text: 'Communities', path: '/communities' },
        { icon: Zap, text: 'Premium', path: '/premium' },
        { icon: CheckCircle2, text: 'Verified Orgs', path: '/verified-orgs' },
        { icon: User, text: 'Profile', path: '/profile' },
        { icon: MoreHorizontal, text: 'More', path: '/more' },
    ];

    const user = {
        name: 'mahmoud essa',
        username: '@mahmoudess61320',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    };

    const [pollQuestion, setPollQuestion] = useState("");

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };
    
    const [isSending, setIsSending] = useState(false);
    
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || isSending) return;
        
        setIsSending(true);
        
        try {
            const messageData = {
                receiver: selectedUser.id,
                content: newMessage.trim(),
            };
            
            // Store message content before clearing input
            const messageContent = newMessage.trim();
            setNewMessage('');
            
            // Add message to UI immediately with pending status
            const tempId = Date.now();
            const newMsg = {
                id: tempId,
                sender: me.id,
                recipient: selectedUser.id,
                content: messageContent,
                timestamp: new Date().toISOString(),
                is_read: false,
                pending: true
            };
            
            setMessages(prev => [...prev, newMsg]);
            
            // Send message to server
            const response = await authAxios.post('chat/send/', messageData);
            
            // Update message with server response
            setMessages(prev => prev.map(msg => 
                msg.id === tempId ? { ...msg, id: response.data.id || msg.id, pending: false } : msg
            ));
            
            // Update last message for this user
            setLastMessages(prev => ({
                ...prev,
                [selectedUser.id]: {
                    content: messageContent,
                    timestamp: new Date().toISOString()
                }
            }));
            
            // Send via WebSocket if available
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    action: 'send_message',
                    message: {
                        sender: me.id,
                        receiver: messageData.receiver,
                        content: messageContent,
                        timestamp: new Date().toISOString()
                    }
                }));
            }
            
            // Focus the input field after sending
            if (messageInputRef.current) {
                messageInputRef.current.focus();
            }
            
            // Scroll to bottom
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            
            // Remove the pending message on error
            setMessages(prev => prev.filter(msg => !msg.pending));
            
            // Restore the message in the input
            setNewMessage(newMessage);
        } finally {
            setIsSending(false);
        }
    };
    
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        
        // Note: We don't reset unread counts here anymore
        // That will be handled by the useEffect that watches selectedUser
        
        if (messageInputRef.current) {
            setTimeout(() => {
                messageInputRef.current.focus();
            }, 100);
        }
    };
    
    const closeMessagesTab = () => {
        setIsMessagesTabOpen(false);
        setSelectedUser(null);
    };
    
    const goToFullMessages = () => {
        navigate('/messages');
        setIsMessagesTabOpen(false);
    };
    
    return (
        <div className="min-h-screen bg-black text-white flex justify-center relative">
            <div className="flex w-full max-w-[1280px]">
                {/* Left Sidebar */}
                <div className="flex flex-col w-[275px] px-4 py-4 border-r border-gray-800">
                    <div>
                        <div className="text-xl font-bold mb-8 ml-3">
                            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                                <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
                            </svg>
                        </div>
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.text}
                                    to={item.path}
                                    className={`flex items-center gap-4 text-lg font-medium hover:bg-gray-900 px-4 py-3 rounded-full transition-colors ${location.pathname === item.path ? 'font-bold' : ''}`}
                                >
                                    <div className="relative">
                                        <item.icon className="h-6 w-6" />
                                        {item.badge > 0 && (
                                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                {item.badge > 99 ? '99+' : item.badge}
                                            </div>
                                        )}
                                    </div>
                                    <span>{item.text}</span>
                                </Link>
                            ))}
                        </nav>
                        <button className="mt-6 w-full bg-blue-500 text-white rounded-full py-3 text-lg font-bold shadow hover:bg-blue-600 transition-colors">
                            Post
                        </button>

                        <div className="flex items-center gap-3 px-2 py-3 hover:bg-gray-900 rounded-full cursor-pointer mt-3">
                            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{user.name}</div>
                                <div className="text-gray-500 text-sm truncate">{user.username}</div>
                            </div>
                            <MoreHorizontal className="text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className={`flex-1 min-w-0 ${!isMessagesPage ? 'border-r border-gray-800' : ''} flex justify-center`}>
                    <div className={`w-full ${!isMessagesPage ? 'max-w-[600px]' : ''}`}>
                        {children}
                    </div>
                </main>

                {/* Right Sidebar - Hidden on Messages page */}
                {!isMessagesPage && (
                    <div className="w-[350px] px-4 py-4">
                        <div className="bg-black border border-gray-800 rounded-2xl mb-4">
                            <div className="flex items-center px-4 py-2">
                                <Search className="h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-transparent ml-2 outline-none w-full text-white placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
                            <h2 className="text-xl font-bold mb-4 text-white">Subscribe to Premium</h2>
                            <p className="mb-4 text-white">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                            <button className="bg-blue-500 text-white rounded-full py-2 px-4 font-bold">
                                Subscribe
                            </button>
                        </div>
                        <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
                            <h2 className="text-xl font-bold mb-4 text-white">What's happening</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-400">Trending in Egypt</div>
                                    <div className="font-bold text-white">#TrendingTopic</div>
                                    <div className="text-sm text-gray-400">1,431 posts</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Trending in Egypt</div>
                                    <div className="font-bold text-white">The Tripartite Aggression</div>
                                    <div className="text-sm text-gray-400">2,715 posts</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Trending in Egypt</div>
                                    <div className="font-bold text-white">American Prisons</div>
                                    <div className="text-sm text-gray-400">1,428 posts</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Trending in Egypt</div>
                                    <div className="font-bold text-white">#End_American_Presence_Demand</div>
                                    <div className="text-sm text-gray-400">50.4K posts</div>
                                </div>
                            </div>
                            <button className="text-blue-500 hover:underline mt-2">Show more</button>
                        </div>

                        <div className="bg-black border border-gray-800 rounded-2xl p-4">
                            <h2 className="text-xl font-bold mb-4 text-white">Who to follow</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <div className="font-bold text-white">hussien</div>
                                            <div className="text-gray-400 text-sm">@Al Doctor</div>
                                        </div>
                                    </div>
                                    <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <div className="font-bold text-white">ON Sport</div>
                                            <div className="text-gray-400 text-sm">@ONTimeSports</div>
                                        </div>
                                    </div>
                                    <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <div className="font-bold text-white">Ahmed Shobier</div>
                                            <div className="text-gray-400 text-sm">@ShobierOfficial</div>
                                        </div>
                                    </div>
                                    <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                                </div>
                            </div>
                            <button className="text-blue-500 hover:underline mt-4">Show more</button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Messages Tab at bottom */}
            {!isMessagesPage && (
                <div className="fixed bottom-0 right-0 z-50 flex justify-end w-full">
                    {/* Messages Tab Button */}
                    <button 
                        onClick={() => setIsMessagesTabOpen(!isMessagesTabOpen)}
                        className="bg-black border border-gray-800 rounded-t-lg px-4 py-2 mr-4 flex items-center gap-2"
                    >
                        <div className="relative">
                            <MessageCircle size={20} />
                            {unreadMessageCount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                </div>
                            )}
                        </div>
                        <span>Messages</span>
                        <ArrowUp size={16} className={`transition-transform ${isMessagesTabOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Messages Tab Content */}
                    {isMessagesTabOpen && (
                        <div 
                            id="messages-tab"
                            className="fixed bottom-0 right-4 w-[350px] bg-black border border-gray-800 rounded-t-lg overflow-hidden shadow-lg z-50 flex flex-col"
                            style={{ maxHeight: '80vh' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-800 p-3">
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={20} />
                                    <h2 className="font-bold">Messages</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={goToFullMessages} className="hover:bg-gray-800 p-1 rounded-full">
                                        <ArrowUp size={18} />
                                    </button>
                                    <button onClick={closeMessagesTab} className="hover:bg-gray-800 p-1 rounded-full">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            {selectedUser ? (
                                <div className="flex flex-col h-full">
                                    {/* Chat Header */}
                                    <div className="flex items-center gap-3 p-3 border-b border-gray-800">
                                        <button 
                                            onClick={() => setSelectedUser(null)}
                                            className="hover:bg-gray-800 p-1 rounded-full"
                                        >
                                            <ArrowUp size={18} className="rotate-90" />
                                        </button>
                                        <img 
                                            src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`} 
                                            alt={selectedUser.username} 
                                            className="w-8 h-8 rounded-full object-cover" 
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold">{selectedUser.display_name || selectedUser.username}</div>
                                            <div className="text-gray-500 text-xs">@{selectedUser.username}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: '300px' }}>
                                        {messages.map((msg) => (
                                            <div 
                                                key={msg.id} 
                                                className={`flex ${msg.sender === me?.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div 
                                                    className={`max-w-[80%] p-3 rounded-lg ${msg.sender === me?.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'} ${msg.pending ? 'opacity-70' : ''}`}
                                                >
                                                    <div>{msg.content}</div>
                                                    <div className="text-xs opacity-70 mt-1 text-right flex items-center justify-end gap-1">
                                                        {formatTime(msg.timestamp)}
                                                        {msg.pending && (
                                                            <span className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    
                                    {/* Message Input */}
                                    <form onSubmit={sendMessage} className="border-t border-gray-800 p-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Start a new message"
                                                className="flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none"
                                                ref={messageInputRef}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        sendMessage(e);
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={!newMessage.trim() || isSending}
                                                className={`p-2 rounded-full transition-all duration-200 ${newMessage.trim() && !isSending ? 'text-blue-500 hover:bg-gray-800 active:scale-95' : 'text-gray-500 cursor-not-allowed'}`}
                                            >
                                                {isSending ? (
                                                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                ) : (
                                                    <Send size={18} className="transform transition-transform active:translate-x-1" />
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto">
                                    {/* User List */}
                                    {users.length > 0 ? (
                                        <div className="divide-y divide-gray-800">
                                            {users.map((user) => (
                                                <div 
                                                    key={user.id} 
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-900 cursor-pointer"
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    <div className="relative">
                                                        <img 
                                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                                                            alt={user.username} 
                                                            className="w-10 h-10 rounded-full object-cover" 
                                                        />
                                                        {/* Always show badge if there are unread messages */}
                                                        {unreadByUser[user.id] > 0 && (
                                                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                                {unreadByUser[user.id] > 99 ? '99+' : unreadByUser[user.id]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold truncate">{user.display_name || user.username}</div>
                                                        <div className="text-gray-500 text-sm truncate">
                                                            {lastMessages[user.id]?.content ? 
                                                                lastMessages[user.id].content : 
                                                                `@${user.username}`}
                                                        </div>
                                                    </div>
                                                    {lastMessages[user.id]?.timestamp && (
                                                        <div className="text-xs text-gray-500">
                                                            {formatTime(lastMessages[user.id].timestamp)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No conversations yet
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}