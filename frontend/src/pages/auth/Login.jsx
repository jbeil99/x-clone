import { useState } from 'react';
import { AtSign, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast(`Welcome ${user.display_name}!`);
      navigate('/');
    }

    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    console.log(loading, error, isAuthenticated, user)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {loading && <p className="text-gray-500 text-sm mt-1">Logging in...</p>}
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
        disabled={loading}
      >
        Log in
      </button>
    </form>
  );
}