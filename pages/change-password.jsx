"use client";
import { useState } from 'react';
import Navbar from '@components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Separate visibility states for each field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState({});
  const Router = useRouter();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!currentPassword) validationErrors.currentPassword = 'Current password is required.';
    if (!newPassword) validationErrors.newPassword = 'New password is required.';
    else if (!validatePassword(newPassword)) {
      validationErrors.newPassword = 'Password must be at least 8 characters long, with uppercase, lowercase, number, and special character.';
    }
    if (!confirmPassword) validationErrors.confirmPassword = 'Confirm password is required.';
    else if (confirmPassword !== newPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors:", validationErrors);
      return;
    }

    try {
      const response = await fetch(`/api/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmPassword,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        setError({ apiError: responseData.message });
        return;
      } 

      alert("password updated successfully")
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError({});
      Router.push('/');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
      {error.apiError && <p className="text-red-500 text-sm mb-4">{error.apiError}</p>}
        
        {/* Current Password */}
        <div className="relative">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error.currentPassword && <p className="text-red-500 text-sm mt-1">{error.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div className="relative">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error.newPassword && <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
