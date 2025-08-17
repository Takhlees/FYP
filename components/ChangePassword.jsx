"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { showLoadingToast, updateToast, showSuccessToast, showErrorToast } from "@/utils/toast"

export default function ChangePassword() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Password validation
  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required"
    }
    
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required"
    } else {
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        newErrors.newPassword = "Password must meet all requirements"
      }
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (currentPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    const loadingToast = showLoadingToast("Changing Password")
    
    try {
      const response = await fetch("/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        updateToast(loadingToast, 'success', "Password Changed!", "Your password has been updated successfully.")
        
        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setErrors({})
        
        // Show success message
        setTimeout(() => {
          showSuccessToast("Password Updated", "Your password has been changed successfully. Please log in again with your new password.")
        }, 1000)
      } else {
        updateToast(loadingToast, 'error', "Failed to Change Password", data.message || "An error occurred while changing your password.")
      }
    } catch (error) {
      console.error("Password change error:", error)
      updateToast(loadingToast, 'error', "Error Occurred", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const passwordValidation = validatePassword(newPassword)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-md p-8 md:p-12 lg:p-16">
        
        {/* Back Button - Top Left */}
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center space-y-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <Lock className="h-10 w-10 text-indigo-600" />
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
            <p className="text-gray-600">Update your account password securely</p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.currentPassword ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.newPassword ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.newPassword}
              </p>
            )}
            
            {/* Password Requirements */}
            {newPassword && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className={`flex items-center text-xs ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}>
                    {passwordValidation.minLength ? <CheckCircle className="h-3 w-3 mr-2" /> : <div className="h-3 w-3 mr-2 rounded-full border border-gray-300" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
                    {passwordValidation.hasUpperCase ? <CheckCircle className="h-3 w-3 mr-2" /> : <div className="h-3 w-3 mr-2 rounded-full border border-gray-300" />}
                    One uppercase letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500"}`}>
                    {passwordValidation.hasLowerCase ? <CheckCircle className="h-3 w-3 mr-2" /> : <div className="h-3 w-3 mr-2 rounded-full border border-gray-300" />}
                    One lowercase letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasNumbers ? "text-green-600" : "text-gray-500"}`}>
                    {passwordValidation.hasNumbers ? <CheckCircle className="h-3 w-3 mr-2" /> : <div className="h-3 w-3 mr-2 rounded-full border border-gray-300" />}
                    One number
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                    {passwordValidation.hasSpecialChar ? <CheckCircle className="h-3 w-3 mr-2" /> : <div className="h-3 w-3 mr-2 rounded-full border border-gray-300" />}
                    One special character
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}









