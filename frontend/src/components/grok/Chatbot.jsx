import React, { useState } from 'react';
import './Chatbot.css';
import api from '../../api/grok'; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendMessage(input);
      setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Failed to get response', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">Grok Chat</div>

      {/* Message list */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Typing...</div>}
      </div>

      {/* Input field */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;