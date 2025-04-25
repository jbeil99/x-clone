// LoginPage.jsx
import { useState } from 'react';
import { AtSign, Lock } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import RegisterForm from './RegisterForm';
import Login from './Login';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);


    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    if (!isLogin) {
        return <RegisterForm toggleForm={toggleForm} />;
    }

    return <Login isLogin={isLogin} setIsLogin={setIsLogin} toggleForm={toggleForm} />
}