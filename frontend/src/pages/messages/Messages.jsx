import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft, Search, Settings, MessageSquarePlus, Image, Smile, Calendar, X } from 'lucide-react';
import { currentUser } from "../../api/users";
import { authAxios } from "../../api/useAxios";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [showList, setShowList] = useState(true); 
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await currentUser();
        setMe(userData);
        return userData;
      } catch (error) {
        setError("Failed to authenticate. Please login again.");
        return null;
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async (currentUserData) => {
      if (!currentUserData) return;
      
      try {
        setLoading(true);
        const res = await authAxios.get("chat/all-users/");
        setUsers(res.data);
        
        const lastMsgsObj = {};
        for (const user of res.data) {
          lastMsgsObj[user.id] = { content: "", timestamp: null };
        }
        setLastMessages(lastMsgsObj);
        
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
      } catch (error) {
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      const userData = await fetchCurrentUser();
      await fetchUsers(userData);
    };

    init();
  }, []);

  useEffect(() => {
    if (!me) return;
    
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${me.id}/`);
    
    ws.onopen = () => {
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.action === "connection_established") {
        console.log("WebSocket connection confirmed:", data.message);
      }
      else if (data.action === "message" || data.action === "message_sent") {
        const messageData = data.action === "message_sent" ? data.message : data;
        const senderId = messageData.sender;
        const receiverId = messageData.receiver;
        const content = messageData.content;
        const timestamp = messageData.timestamp;
        
        const otherUserId = senderId === me.id ? receiverId : senderId;
        setLastMessages(prev => ({
          ...prev,
          [otherUserId]: {
            content: content,
            timestamp: timestamp
          }
        }));
        
        if (selectedUser && (senderId === selectedUser.id || receiverId === selectedUser.id)) {
          if (senderId !== me.id) {
            try {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.log("Audio play failed:", e));
            } catch (error) {
              console.error("Error playing notification sound:", error);
            }
          }
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
  }, [me, selectedUser]);

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const showChat = selectedUser && (!isMobile || !showList);

  const ChatWindow = ({ me, other }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
      if (!other) return;
      
      const fetchMessages = async () => {
        try {
          const res = await authAxios.get(`chat/messages/?user=${other.id}`);
          setMessages(res.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      
      fetchMessages();
      
      if (socket) {
        const messageHandler = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.action === "message" || data.action === "message_sent") {
            const messageData = data.action === "message_sent" ? data.message : data;
            const senderId = messageData.sender;
            const receiverId = messageData.receiver;
            
            if ((senderId === me.id && receiverId === other.id) || 
                (senderId === other.id && receiverId === me.id)) {
              
              const isDuplicate = messages.some(msg => 
                msg.content === messageData.content && 
                msg.sender === senderId && 
                msg.timestamp === messageData.timestamp
              );
              
              if (!isDuplicate) {
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  sender: senderId,
                  receiver: receiverId,
                  content: messageData.content,
                  timestamp: messageData.timestamp
                }]);
              }
            }
          }
        };
        
        socket.addEventListener("message", messageHandler);
        
        return () => {
          socket.removeEventListener("message", messageHandler);
        };
      }
    }, [other, socket, messages]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
      e.preventDefault();
      if (!input.trim()) return;
      
      const timestamp = new Date().toISOString();
      const messageData = {
        sender: me.id,
        receiver: other.id,
        content: input,
        timestamp: timestamp
      };
      
      try {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            action: "send_message",
            message: messageData
          }));
          
          setMessages(prev => [...prev, {
            id: Date.now(),
            ...messageData
          }]);
          
          const res = await authAxios.post("chat/send/", {
            receiver: other.id,
            content: input,
          });
        } else {
          const res = await authAxios.post("chat/send/", {
            receiver: other.id,
            content: input,
          });
          
          setMessages(prev => [...prev, res.data]);
        }
        
        setInput("");
      } catch (error) {
        alert("Failed to send message. Please try again.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="sticky top-0 z-10 bg-black border-b border-gray-800 p-3">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={() => setShowList(true)}
                className="p-2 rounded-full hover:bg-gray-800 mr-2"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <img 
                src={other.avatar || `https://ui-avatars.com/api/?name=${other.username}&background=random`} 
                alt={other.username} 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <div>
                <div className="font-bold text-sm">{other.display_name || other.username}</div>
                <div className="text-gray-500 text-xs">@{other.username}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-black">
          {messages.map((msg, i) => {
            const senderId = String(msg.sender);
            const myId = String(me?.id);
            
            const isSentByMe = senderId === myId;
            
            return (
              <div key={i} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-1`}>
                {!isSentByMe && (
                  <img 
                    src={other.avatar || `https://ui-avatars.com/api/?name=${other.username}&background=random`} 
                    alt={other.username} 
                    className="h-8 w-8 rounded-full mr-2 self-end mb-1 hidden sm:block" 
                  />
                )}
                <div className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                  isSentByMe 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-800 text-white rounded-bl-none'
                }`}>
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-xs opacity-70 text-right mt-1">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-800 p-3">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-blue-400">
              <button type="button" className="p-2 rounded-full hover:bg-gray-800">
                <Image size={18} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-gray-800">
                <Smile size={18} />
              </button>
            </div>
            <input
              className="flex-1 rounded-full px-4 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Start a new message"
            />
            <button 
              type="submit" 
              className={`p-2 rounded-full ${input.trim() ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-500'}`} 
              disabled={!input.trim()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 rotate-90">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black">
      <div className={`${showChat && isMobile ? 'hidden' : 'flex flex-col'} ${showChat && !isMobile ? 'w-[350px]' : 'w-full'} border-r border-gray-800`}>
        <div className="sticky top-0 z-20 bg-black">
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                <Settings size={18} />
              </button>
              <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                <MessageSquarePlus size={18} />
              </button>
            </div>
          </div>
          <div className="px-2 py-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Search size={16} />
              </div>
              <input
                className="w-full rounded-full pl-10 pr-4 py-2 bg-gray-800 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-500"
                placeholder="Search Direct Messages"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="text-gray-500 text-center py-8">Loading users...</div>
          )}
          
          {error && (
            <div className="text-red-500 text-center py-8">{error}</div>
          )}
          
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-gray-500 text-center py-8">No users to chat with.</div>
          )}
          
          {filteredUsers.map(user => {
            const lastMsg = lastMessages[user.id];
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition border-b border-gray-800
                  hover:bg-gray-900 ${selectedUser && selectedUser.id === user.id ? 'bg-gray-900' : ''}`}
                onClick={() => {
                  setSelectedUser(user);
                  if (isMobile) setShowList(false);
                }}
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                  alt={user.username} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm">{user.display_name || user.username}</div>
                    <div className="text-gray-500 text-xs">{formatTime(lastMsg?.timestamp)}</div>
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

      <div className={`${!showChat ? 'hidden' : 'flex'} flex-col ${!isMobile && showChat ? 'flex-1' : 'w-full'} bg-black`}>
        {selectedUser ? (
          <ChatWindow me={me} other={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 flex-col p-4">
            <div className="text-2xl font-bold mb-2">Select a message</div>
            <p className="text-gray-600 text-center">
              Choose from your existing conversations, start a new one, or just keep swimming.
            </p>
            <button className="mt-6 bg-blue-500 text-white rounded-full px-4 py-2 font-bold">
              New message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
