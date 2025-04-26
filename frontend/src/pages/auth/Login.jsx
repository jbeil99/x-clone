import { useState } from 'react';
import { AtSign, Lock } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import { login } from "../../api/users"
import { toast } from 'react-toastify';

export default function Login({ isLogin, setIsLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login({
        email, password
      })
      if (res) {
        setErrors()
        toast(`Welcome ${res.display_name}!`)
      }

    } catch (error) {
      for (const k in error.response.data) {
        setErrors(error.response.data[k].join("/n"))
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-black rounded-lg p-6 border border-gray-800">
        <div className="flex justify-center mb-6">
          <FaXTwitter size={40} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in to X
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors ? <p className="text-red-500 text-sm mt-1">{errors}</p> : ''}
          <div className="relative">
            <AtSign className="absolute top-3 left-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Log in
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don't have an account?
            <button
              onClick={toggleForm}
              className="text-blue-500 hover:underline ml-1"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-4">
          <button className="w-full text-blue-500 hover:underline text-sm">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}