
import { useEffect } from 'react';
import Navigations from './Navigations';
import Recomendations from './Recomendations';
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/auth";

export default function Layout({ children }) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCurrentUser())
    }, [dispatch])

    return (
        <div className="min-h-screen bg-black text-white flex justify-center">
            <div className="flex w-full max-w-[1280px]">
                <Navigations />

                <main className="flex-1 min-w-0 border-r border-gray-800 flex justify-center">
                    <div className="w-full max-w-[750px] px-4">
                        {children}
                    </div>
                </main>

                <Recomendations />
            </div>
        </div>
    );
} 