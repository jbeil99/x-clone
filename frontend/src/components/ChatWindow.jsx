import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ChatWindow({ me, other }) {
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
          className="flex-1 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
