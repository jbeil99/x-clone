import Navigations from './Navigations';
import Recomendations from './Recomendations';
import MessagesBox from './MessagesBox';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchCurrentUser } from '../../store/slices/auth';


export default function Layout({ children }) {
    const isMessagesPage = location.pathname === '/messages';
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentUser())
    }, [dispatch])
    return (
        <div className="min-h-screen bg-black text-white flex justify-center relative">
            <div className="flex w-full max-w-[1280px]">
                {/* Left Sidebar */}
                <Navigations />

                {/* Main Content */}
                <main className={`flex-1 min-w-0 ${!isMessagesPage ? 'border-r border-gray-800' : ''} flex justify-center`}>
                    <div className={`w-full ${!isMessagesPage ? 'max-w-[600px]' : ''}`}>
                        {children}
                    </div>
                </main>

                {/* Right Sidebar - Hidden on Messages page */}
                {!isMessagesPage && (
                    <Recomendations />
                )}
            </div>

            {/* Messages Tab at bottom */}
            {!isMessagesPage && (
                <MessagesBox isMessagesPage={isMessagesPage} />
            )} 
        </div>
    );
}