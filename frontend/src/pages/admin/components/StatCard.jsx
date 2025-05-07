import React from 'react';

export default function StatCard({ icon, value, label }) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg flex flex-col">
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}
