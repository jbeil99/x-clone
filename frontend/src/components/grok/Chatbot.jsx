// src/components/grok/Chatbot.jsx
import React, { useState } from 'react';
import './Chatbot.css'; // Custom styles
import { sendMessage } from '../../api/grok';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      setMessages((prev) => [...prev, { text: response.data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Failed to get response', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header bg-dark text-white p-3 rounded-top">
        <h4 className="text-center">Grok Chat</h4>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages bg-dark p-3 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-2 ${
              msg.sender === 'user' ? 'user-message' : 'bot-message'
            }`}
          >
            <div className="message-content p-2 rounded-lg">
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message mb-2">
            <div className="message-content p-2 rounded-lg">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input bg-dark p-3 border-top border-secondary">
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="form-control flex-grow-1 bg-light text-dark"
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;