import { useEffect, useState } from "react";
import { currentUser } from "../../api/users"; 
import axios from "axios";
import ChatWindow from "../../components/ChatWindow";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    currentUser().then(setMe);

    axios.get("http://localhost:8000/api/chat/all-users/", {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access"),
      },
    }).then(res => {
      console.log("users api response:", res.data);
      setUsers(res.data);
    });
  }, []);

  const filteredUsers = users.filter(u => me && u.id !== me.id);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="space-y-3">
        {filteredUsers.length === 0 && (
          <div className="text-gray-400 text-center py-8"> There is no users to chat with them .   .</div>
        )}
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer transition"
            onClick={() => setSelectedUser(user)}
          >
            <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-bold text-white">{user.display_name || user.username}</div>
              <div className="text-gray-400 text-sm">@{user.username}</div>
            </div>
          </div>
        ))}
      </div>
      {selectedUser && me && (
        <div className="mt-6">
          <ChatWindow me={me} other={selectedUser} />
        </div>
      )}
    </div>
  );
}
