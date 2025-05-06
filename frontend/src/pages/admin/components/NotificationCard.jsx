import React from 'react';
import { Bell, AlertTriangle, Info } from 'lucide-react';

export default function NotificationCard({ notification }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'info':
        return <Info className="text-blue-500" size={18} />;
      default:
        return <Bell className="text-gray-400" size={18} />;
    }
  };

  return (
    <div className="bg-gray-900 p-3 rounded-lg mb-2 flex items-start">
      <div className="mr-3 mt-1">{getIcon()}</div>
      <div>
        <div className="font-semibold">{notification.title}</div>
        <div className="text-gray-400 text-sm">{notification.message}</div>
        <div className="text-gray-500 text-xs mt-1">{notification.time}</div>
      </div>
    </div>
  );
}
