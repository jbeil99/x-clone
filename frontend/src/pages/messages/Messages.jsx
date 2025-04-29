import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft, Search, Settings, MessageSquarePlus, Image, Smile, Calendar } from 'lucide-react';

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [showList, setShowList] = useState(true); // for mobile
  const [newMessage, setNewMessage] = useState("");

  // Mock data instead of API calls
  useEffect(() => {
    // Mock current user
    const mockMe = {
      id: 1,
      username: "currentuser",
      display_name: "Current User",
      avatar: "/api/placeholder/100/100"
    };
    setMe(mockMe);
    
    // Mock users list
    const mockUsers = [
      {
        id: 2,
        username: "btnganm2ley",
        display_name: "خشيش",
        avatar: "/api/placeholder/100/100"
      },
      {
        id: 3,
        username: "user2",
        display_name: "Another User",
        avatar: "/api/placeholder/100/100"
      },
      {
        id: 4,
        username: "user3",
        display_name: "Test User",
        avatar: "/api/placeholder/100/100"
      }
    ];
    setUsers(mockUsers);
    
    // Mock last messages
    setLastMessages({
      2: { content: "alooooooooooooo", timestamp: new Date(Date.now() - 86400000).toISOString() },
      3: { content: "Hey there!", timestamp: new Date(Date.now() - 7200000).toISOString() },
      4: { content: "Let me know when you're free", timestamp: new Date(Date.now() - 172800000).toISOString() }
    });
  }, []);

  const filteredUsers = users.filter(u => me && u.id !== me.id && (
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  ));

  function formatTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff/60)}h`;
    if (diff < 10080) return `${Math.floor(diff/1440)}d`;
    return date.toLocaleDateString();
  }

  // Responsive: show only list or chat on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const showChat = selectedUser && (!isMobile || !showList);

  // Chat window component
  const ChatWindow = ({ me, other }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
      if (!other) return;
      axios.get(`http://localhost:8000/api/chat/messages/?user=${other.id}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("access"),
        },
      }).then(res => {
        setMessages(res.data);
      });
    }, [other]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
      e.preventDefault();
      if (!input.trim()) return;
      const res = await axios.post("http://localhost:8000/api/chat/send/", {
        receiver: other.id,
        content: input,
      }, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("access"),
        },
      });
      setMessages([...messages, res.data]);
      setInput("");
    };

    return (
      <div className="bg-gray-800 rounded-lg p-4 h-96 flex flex-col">
        <div className="font-bold mb-2 text-white">Chat with {other.display_name || other.username}</div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-2 bg-gray-900 p-2 rounded">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === me.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs text-sm ${msg.sender === me.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 rounded px-3 py-2 bg-gray-700 text-white"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit" className="text-blue-400 hover:text-blue-300 disabled:text-gray-600" disabled={!input.trim()}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 rotate-90">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black text-white" style={{ minHeight: '100vh' }}>
      {/* Messages List Column */}
      <div className={`flex flex-col border-r border-gray-800 bg-black transition-all duration-200
        ${isMobile ? (showChat ? 'hidden' : 'w-full') : 'w-1/3 min-w-[320px] max-w-[400px]'}`}
      >
        {/* Sticky Search and Header */}
        <div className="sticky top-0 z-10 bg-black border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-white p-2">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white p-2">
                <MessageSquarePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                className="w-full rounded-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-500"
                placeholder="Search Direct Messages"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredUsers.length === 0 && (
            <div className="text-gray-500 text-center py-8">No users to chat with.</div>
          )}
          {filteredUsers.map(user => {
            const lastMsg = lastMessages[user.id];
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b border-gray-800
                  hover:bg-gray-900 ${selectedUser && selectedUser.id === user.id ? 'bg-gray-900' : ''}`}
                onClick={() => {
                  setSelectedUser(user);
                  if (isMobile) setShowList(false);
                }}
              >
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <div className="font-bold truncate">{user.display_name || user.username}</div>
                    <span className="text-gray-500 text-xs">· {formatTime(lastMsg?.timestamp)}</span>
                  </div>
                  <div className="text-gray-500 text-sm truncate">
                    {lastMsg?.content || ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Message Content Column */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-200 ${isMobile ? (showList ? 'hidden' : 'w-full') : 'w-2/3'}`}>
        {selectedUser ? <ChatWindow me={me} other={selectedUser} /> : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
