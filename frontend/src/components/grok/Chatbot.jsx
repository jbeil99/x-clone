// Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { sendMessage } from '../../api/grok';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    { id: 'chat1', title: 'Previous Chat 1', date: 'Apr 30', preview: 'How can I optimize my React app...' },
    { id: 'chat2', title: 'Previous Chat 2', date: 'Apr 29', preview: 'Tell me about the future of AI...' },
    { id: 'chat3', title: 'Previous Chat 3', date: 'Apr 28', preview: 'What are the best coding practices...' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('new');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

 // Chatbot.jsx
const handleSendMessage = async () => {
  if (!input.trim()) return;

  setMessages(prev => [...prev, { text: input, sender: 'user' }]);
  setInput('');
  setIsLoading(true);

  try {
    const response = await sendMessage(input);
    setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
  } catch (error) {
    console.error('Chat error:', error); // Logs full error
    const errorMsg = error.response?.data?.response || error.message; // ✅ Show real error
    setMessages(prev => [...prev, { text: `⚠️ ${errorMsg}`, sender: 'bot' }]);
  } finally {
    setIsLoading(false);
  }
};

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId('new');
    setShowHistory(false);
  };

  const loadChat = (chatId) => {
    // In a real app, you would fetch the chat messages from your backend
    const mockMessages = [
      { text: 'Hello Grok', sender: 'user' },
      { text: 'Error: 403 - {"error":"The model meta-llama/Llama-2-7b-chat-hf is too large to be loaded automatically (13GB > 10GB)."}', sender: 'bot' }
    ];
    setMessages(mockMessages);
    setCurrentChatId(chatId);
    setShowHistory(false);
  };

  // Format message text with line breaks
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    
    <div className="grok-container">
      {/* History Sidebar */}
      <div className={`grok-history-sidebar ${showHistory ? 'show' : ''}`}>
        <div className="grok-history-header">
          <h4>Chat History</h4>
          <button className="grok-new-chat" onClick={startNewChat}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5v2H5v14h14v-5h2z"></path>
              <path d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z"></path>
            </svg>
            New Chat
          </button>
        </div>
        <div className="grok-history-list">
          {chatHistory.map(chat => (
            <div 
              key={chat.id} 
              className={`grok-history-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => loadChat(chat.id)}
            >
              <div className="grok-history-icon">G</div>
              <div className="grok-history-content">
                <div className="grok-history-title">
                  <span>{chat.title}</span>
                  <span className="grok-history-date">{chat.date}</span>
                </div>
                <div className="grok-history-preview">{chat.preview}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="grok-main-area">
        {/* Chat Header */}
        <div className="grok-header">
          <button 
            className="grok-history-toggle" 
            onClick={() => setShowHistory(!showHistory)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="grok-logo">G</div>
          <h4>Grok</h4>
        </div>

        {/* Chat Messages */}
        <div className="grok-messages">
          {messages.length === 0 && (
            <div className="grok-empty-state">
              <div className="grok-empty-icon">G</div>
              <h3>How can I help you today?</h3>
              <p>I'm Grok, an AI assistant that's helpful and a bit mischievous.</p>
              <div className="grok-suggestions">
                <button onClick={() => setInput("Tell me about yourself")}>Tell me about yourself</button>
                <button onClick={() => setInput("Write a funny story")}>Write a funny story</button>
                <button onClick={() => setInput("What's your take on AI regulation?")}>What's your take on AI regulation?</button>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`grok-message ${
                msg.sender === 'user' ? 'grok-user-message' : 'grok-bot-message'
              }`}
            >
              <div className="grok-avatar">
                {msg.sender === 'user' ? 'U' : 'G'}
              </div>
              <div className="grok-message-content">
                {formatMessage(msg.text)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="grok-message grok-bot-message">
              <div className="grok-avatar">G</div>
              <div className="grok-message-content">
                <div className="grok-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="grok-input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Grok..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
            className="grok-input"
          />
          <button
            onClick={handleSendMessage}
            className={`grok-send-button ${input.trim() ? 'active' : ''}`}
            disabled={isLoading || !input.trim()}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;