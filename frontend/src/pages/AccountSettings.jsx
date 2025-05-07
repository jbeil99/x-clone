import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAxios } from '../api/useAxios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountSettings = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [showModal, setShowModal] = useState(null); // can be: 'info', 'password', 'download', 'delete'
  const [formData, setFormData] = useState({ new_password: '', current_password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    try {
      const response = await authAxios.get('/auth/users/me/');
      setAccountInfo(response.data);
    } catch (error) {
      toast.error('Failed to fetch account info');
      console.error('Failed to fetch account info:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAxios.post('/auth/users/reset_password/', formData);
      toast.success('Password reset email sent. Please check your inbox.');
      setShowModal(null);
    } catch (error) {
      toast.error('Failed to send password reset email.');
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async (e) => {
    e.preventDefault();

    const confirmDeactivation = window.confirm(
      "Are you sure you want to deactivate your account? This action cannot be undone."
    );

    if (confirmDeactivation) {
      setLoading(true);
      try {
        await authAxios.delete("/auth/users/me/", {
          data: { current_password: formData.current_password }
        });

        toast.success("Your account has been deactivated.");
        // Clear any auth tokens or user data from local storage
        localStorage.removeItem('authTokens');
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      } catch (error) {
        const errorMessage = error.response?.data?.detail ||
          "Failed to deactivate your account. Make sure your password is correct.";
        toast.error(errorMessage);
        console.error("Error deactivating account:", error);
      } finally {
        setLoading(false);
        setShowModal(null);
      }
    }
  };

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get('/api/account/download-data', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'account-data.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download data');
      console.error('Error downloading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-settings bg-black text-white min-h-screen p-6">
      <ToastContainer position="top-right" theme="dark" />
      <h1 className="text-2xl font-bold mb-6">Your Account</h1>

      <p className="mb-6 text-gray-400">
        See information about your account, change your password, download an archive of your data, or learn about your account deactivation options.
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
                name="new_password"
                placeholder="New Password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full p-2 mb-3 bg-gray-800 border border-gray-700 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
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
            <p>Are you sure you want to delete your account? This action cannot be undone. You must enter your current password to confirm.</p>
            <form onSubmit={handleDeactivateAccount}>
              <input
                type="password"
                name="current_password"
                placeholder="Current Password"
                value={formData.current_password}
                onChange={handleChange}
                className="w-full p-2 mb-3 bg-gray-800 border border-gray-700 rounded"
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;