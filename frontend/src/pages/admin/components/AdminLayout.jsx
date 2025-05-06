import React from 'react';
import { Home, Users, Flag, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';

export default function AdminLayout({ children, activeTab, setActiveTab, onLogout }) {
    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <div className="w-16 md:w-64 bg-gray-900 flex flex-col">
                <div className="p-4 flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="ml-2 text-xl font-bold hidden md:block">Admin Panel</span>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <SidebarItem
                        icon={<Home size={20} />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label="Users"
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                    <SidebarItem
                        icon={<Flag size={20} />}
                        label="Reports"
                        active={activeTab === 'reports'}
                        onClick={() => setActiveTab('reports')}
                    />
                </div>
                <div className="p-4">
                    <SidebarItem
                        icon={<LogOut size={20} />}
                        label="Logout"
                        onClick={onLogout}
                    />
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {children}
            </div>
        </div>
    );
}