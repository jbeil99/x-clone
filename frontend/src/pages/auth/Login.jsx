import { useState } from 'react';
import { AtSign, Lock } from 'lucide-react';
import { login } from "../../api/users"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export default function Login({ closeModals, openRegisterModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login({
        email, password
      })
      if (res) {
        setErrors()
        toast(`Welcome ${res.display_name}!`)
        navigate("/")
      }

    } catch (error) {
      for (const k in error.response.data) {
        setErrors(error.response.data[k].join("/n"))
      }
    }
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">
      {errors ? <p className="text-red-500 text-sm mt-1">{errors}</p> : ''}
      <div className="relative">
        <AtSign className="absolute top-3 left-3 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
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
          className="w-full p-2 pl-10  border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
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

  );
}