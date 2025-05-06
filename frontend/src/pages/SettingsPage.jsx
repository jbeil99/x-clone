// SettingsPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>



      <nav>
        <ul className="space-y-3">
          <li>
            <Link
              to="/settings/your-account"
              className="block py-2 px-4  hover:bg-gray-700 rounded transition-colors"
            >
              Your Account
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SettingsPage;