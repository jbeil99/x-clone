import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [showModal, setShowModal] = useState(null); // can be: 'info', 'password', 'download', 'delete'
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/account')
      .then(response => {
        setAccountInfo(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch account info:', error);
      });
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit change password
  const handleChangePassword = (e) => {
    e.preventDefault();
    axios.post('/api/account/change-password', formData)
      .then(response => {
        alert('Password changed successfully');
        setShowModal(null);
      })
      .catch(error => {
        alert('Failed to change password');
        console.error('Error changing password:', error);
      });
  };

  // Trigger account deactivation
  const handleDeactivateAccount = () => {
    axios.post('/api/account/deactivate')
      .then(response => {
        alert('Your account has been deleted.');
        navigate('/login');
      })
      .catch(error => {
        alert('Failed to delete your account.');
        console.error('Error deleting account:', error);
      })
      .finally(() => {
        setShowModal(null);
      });
  };

  // Trigger data download
  const handleDownloadData = () => {
    axios.get('/api/account/download-data', { responseType: 'blob' }) // assuming it returns a downloadable file
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'account-data.zip'); // filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        alert('Failed to download data');
        console.error('Error downloading data:', error);
      });
  };

  return (
    <div className="account-settings bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Your Account</h1>

      <p className="mb-6 text-gray-400">
        See information about your account, download an archive of your data, or learn about your account deactivation options.
      </p>

      {/* Settings List */}
      <ul className="space-y-3">
        <li
          onClick={() => setShowModal('info')}
          className="block py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
        >
          Account Information
        </li>

        <li
          onClick={() => setShowModal('password')}
          className="block py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
        >
          Change Your Password
        </li>

        <li
          onClick={() => handleDownloadData()}
          className="block py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
        >
          Download an Archive of Your Data
        </li>

        <li
          onClick={() => setShowModal('delete')}
          className="block py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer text-red-500"
        >
          Delete Your Account
        </li>
      </ul>

      {/* Modal for Account Info */}
      {showModal === 'info' && accountInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <p><strong>Email:</strong> {accountInfo.email}</p>
            <p><strong>Phone:</strong> {accountInfo.phone || 'Not provided'}</p>
            <button
              onClick={() => setShowModal(null)}
              className="mt-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Change Password */}
      {showModal === 'password' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                name="oldPassword"
                placeholder="Current Password"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full p-2 mb-3 bg-gray-800 border border-gray-700 rounded"
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-2 mb-3 bg-gray-800 border border-gray-700 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Delete Account */}
      {showModal === 'delete' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-500">Delete Your Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal(null)}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;