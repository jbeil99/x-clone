import React from 'react';

export default function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div 
      className={`flex items-center p-4 ${active ? 'bg-blue-600' : 'hover:bg-gray-800'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="mr-4">{icon}</div>
      <span className="hidden md:block">{label}</span>
    </div>
  );
}
