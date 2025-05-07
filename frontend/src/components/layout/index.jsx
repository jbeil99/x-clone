import Navigations from './Navigations';
import Recomendations from './Recomendations';
import MessagesBox from './MessagesBox';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchCurrentUser } from '../../store/slices/auth';
import { is } from 'date-fns/locale';


export default function Layout({ children }) {
    const isMessagesPage = location.pathname === '/messages';
    const isAiChat = location.pathname === '/grok';
    console.log("asad", isAiChat)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentUser())
    }, [dispatch])
    return (
        <div className="min-h-screen bg-black text-white flex justify-center relative">
            <div className="flex w-full max-w-[1280px]">
                {/* Left Sidebar - Always visible */}
                <div className="block">
                    <div className="sticky top-0 h-screen flex flex-col justify-between">
                        <Navigations />
                    </div>
                </div>

                {/* Main Content */}
                <main className={`flex-1 min-w-0 flex`}>
                    <div className={`w-full border-r border-gray-800 ${!isMessagesPage && !isAiChat ? 'lg:max-w-[600px] lg:mr-16' : ''}`}>
                        {children}
                    </div>
                </main>

                {/* Right Sidebar - Hidden on small screens and Messages page */}
                {!isMessagesPage && !isAiChat && (
                    <div className="hidden lg:block">
                        <div className="sticky top-0 h-screen overflow-y-auto">
                            <Recomendations />
                        </div>
                    </div>
                )}
            </div>

            {/* Messages Tab at bottom */}
             {!isMessagesPage && (
                <MessagesBox isMessagesPage={isMessagesPage} />
            )} 
        </div>
    );
}