// RegisterForm.jsx
import { useState } from 'react';
import { User, Mail, Calendar, AtSign, Lock } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";

export default function RegisterForm({ toggleForm }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration attempted!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-black rounded-lg p-6 border border-gray-800">
        <div className="flex justify-center mb-6">
          <FaXTwitter size={40} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <Calendar className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="date"
                placeholder="Birth date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 text-gray-400"
                required
              />
            </div>
          </div>

          <div className="relative">
            <AtSign className="absolute top-3 left-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          >
            Sign up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?
            <button
              onClick={toggleForm}
              className="text-blue-500 hover:underline ml-1"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}