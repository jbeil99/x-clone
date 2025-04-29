import { useState, useEffect } from 'react';
import { Search, Settings, ExternalLink, Image, FileText, Smile, ChevronRight, Info } from 'lucide-react';
import { currentUser } from '../../api/users';
import axios from 'axios';

export default function TwitterMessagesInterface() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState({ id: 0, username: 'current_user', avatar: '/api/placeholder/100/100' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  
  // Mock messages for demonstration
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "alooooooooooo",
      timestamp: "Yesterday, 8:07 AM",
      isFromMe: false
    },
    {
      id: 2,
      text: "aloooooooooooooooooooooooooooooooo",
      timestamp: "Yesterday, 8:08 AM",
      isFromMe: true,
      seen: true
    }
  ]);

  // Mock data instead of API calls
 
  useEffect(() => {
    currentUser().then(setMe);
    axios.get("http://localhost:8000/api/chat/all-users/", {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access"),
      },
    }).then(res => {
      console.log("users api response:", res.data);
      setUsers(res.data);
      setSelectedUser(res.data[0])
    });
  }, []);


  const filteredUsers = users.filter(user => 
    searchTerm === '' || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: message,
      timestamp: "Just now",
      isFromMe: true,
      seen: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };




  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Left sidebar with messages */}
      <div className="w-96 border-r border-gray-800">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex space-x-3">
            <button className="text-gray-400 hover:text-white">
              <Settings size={20} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <ExternalLink size={20} />
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="px-4 py-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-900 rounded-full py-2 pl-10 pr-4 w-full text-sm focus:outline-none"
              placeholder="Search Direct Messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Conversation list */}
        <div className="overflow-y-auto h-full">
          {filteredUsers.length === 0 && (
            <div className="text-gray-400 text-center py-8 px-4">
              There are no users to chat with...
            </div>
          )}
          
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`border-l-4 ${selectedUser && selectedUser.id === user.id ? 'border-blue-500' : 'border-transparent'} p-3 hover:bg-gray-900 cursor-pointer transition ${selectedUser && selectedUser.id === user.id ? 'bg-gray-800' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex justify-center items-center overflow-hidden">
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{user.display_name || user.username}</span>
                      <span className="text-gray-500 ml-1 text-sm">@{user.username}</span>
                      <span className="text-gray-500 ml-1 text-sm">· 17h</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">
                    aloooooooooooooooooooooooooooooooo
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right content area - Chat window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header with user info */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-right" dir="rtl">{selectedUser.display_name || selectedUser.username}</h2>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Info size={20} />
              </button>
            </div>
            
            {/* User profile information */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full flex justify-center items-center overflow-hidden">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.username} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl">{selectedUser.display_name || selectedUser.username}</h3>
                  <p className="text-gray-500">@{selectedUser.username}</p>
                  <p className="text-gray-500 text-sm mt-2">Joined {selectedUser.joinDate} · {selectedUser.followers} Followers</p>
                  <p className="text-gray-500 text-sm">Not followed by anyone you're following</p>
                </div>
              </div>
            </div>
            
            {/* Message conversation */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.isFromMe ? 'items-end' : 'items-start'}`}>
                    <div className={`${msg.isFromMe ? 'bg-blue-500' : 'bg-gray-800'} rounded-2xl px-4 py-2 max-w-xs`}>
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-gray-500 text-xs mt-1">
                      {msg.timestamp}
                      {msg.isFromMe && msg.seen && ' · Seen'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message input */}
            <div className="p-3 border-t border-gray-800">
              <form onSubmit={handleSendMessage} className="bg-gray-900 rounded-full flex items-center">
                <div className="flex space-x-2 px-4">
                  <button type="button" className="text-blue-400 hover:text-blue-500">
                    <Image size={20} />
                  </button>
                  <button type="button" className="text-blue-400 hover:text-blue-500">
                    <FileText size={20} />
                  </button>
                  <button type="button" className="text-blue-400 hover:text-blue-500">
                    <Smile size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  className="bg-transparent flex-1 p-2 focus:outline-none text-sm"
                  placeholder="Start a new message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="text-blue-400 hover:text-blue-500 pr-4">
                  <ChevronRight size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          // Empty state when no conversation is selected
          <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Select a message</h2>
            <p className="text-gray-500 mb-8">Choose from your existing conversations, start a new one, or just keep swimming.</p>
          </div>
        )}
      </div>
    </div>
  );
}