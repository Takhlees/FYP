'use client'
import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {signIn} from "next-auth/react"
import Link from '@node_modules/next/link'


export default function SignInForm({ onSignInSuccess }) {
   
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  const [signInStatus, setSignInStatus] = useState(null)

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }))
    }
  }, [])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      isLongEnough
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', password: '', global: '' })
    const newErrors = {}

    //fetching api
    try {
      const res = await signIn("credentials",{
        email: formData.email,
        password: formData.password,
        redirect:false
      });


      if(res.error){
        setErrors((prev) => ({ ...prev, global: res.error }))
        return
      }
        router.push("/home")
      
      
      if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 
      'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      setSignInStatus('signing-in')
      setTimeout(() => {
        setSignInStatus('success')
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }
        console.log('Form submitted:', formData)
        onSignInSuccess()
      }, 2000)
    }
  }catch(error){
    console.error('Sign-in failed:', error);
          setErrors((prev) => ({
        ...prev,
        global: 'An unexpected error occurred. Please try again later.',
      }))
  }


  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome to GCU Mailbox</h1>
        <p className="text-gray-600">Sign in to access your university email</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
       {/* Global error message */}
       {errors.global && (
          <p className="bg-red-100 text-red-700 border border-red-400 rounded-md px-4 py-3 text-sm text-center mb-4">
            {errors.global}
          </p>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={signInStatus === 'signing-in'}
        >
          {signInStatus === 'signing-in' ? 'Signing in...' : 'Sign in'}
        </button>
        {signInStatus === 'signing-in' && (
          <p className="mt-2 text-sm text-blue-600">Signing in...</p>
        )}
        {signInStatus === 'success' && (
          <p className="mt-2 text-sm text-green-600">Sign-in successful!</p>
        )}
      </form>
    </div>
  )
}



