// LoginPage.jsx
import { useState } from 'react';
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