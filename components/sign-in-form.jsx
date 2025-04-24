// 'use client'
// import { useState, useEffect } from 'react'
// import { Eye, EyeOff } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import {signIn} from "next-auth/react"
// import Link from '@node_modules/next/link'


// export default function SignInForm({ onSignInSuccess }) {
   
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState({
//     email: '',
//     password: ''
//   })
//   const router = useRouter()

//   const [signInStatus, setSignInStatus] = useState(null)

//   useEffect(() => {
//     const rememberedEmail = localStorage.getItem('rememberedEmail')
//     if (rememberedEmail) {
//       setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }))
//     }
//   }, [])

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return emailRegex.test(email)
//   }

//   const validatePassword = (password) => {
//     const hasUpperCase = /[A-Z]/.test(password)
//     const hasLowerCase = /[a-z]/.test(password)
//     const hasNumbers = /\d/.test(password)
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
//     const isLongEnough = password.length >= 8

//     return (
//       hasUpperCase &&
//       hasLowerCase &&
//       hasNumbers &&
//       hasSpecialChar &&
//       isLongEnough
//     )
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setErrors({ email: '', password: '', global: '' })
//     const newErrors = {}

//     //fetching api
//     try {
//       const res = await signIn("credentials",{
//         email: formData.email,
//         password: formData.password,
//         redirect:false
//       });


//       if(res.error){
//         setErrors((prev) => ({ ...prev, global: res.error }))
//         return
//       }
//         router.push("/home")
      
      
//       if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address'
//     }
    
//     if (!validatePassword(formData.password)) {
//       newErrors.password = 
//       'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
//     }
    
//     setErrors(newErrors)
    
//     if (Object.keys(newErrors).length === 0) {
//       setSignInStatus('signing-in')
//       setTimeout(() => {
//         setSignInStatus('success')
//         if (formData.rememberMe) {
//           localStorage.setItem('rememberedEmail', formData.email)
//         } else {
//           localStorage.removeItem('rememberedEmail')
//         }
//         console.log('Form submitted:', formData)
//         onSignInSuccess()
//       }, 2000)
//     }
//   }catch(error){
//     console.error('Sign-in failed:', error);
//           setErrors((prev) => ({
//         ...prev,
//         global: 'An unexpected error occurred. Please try again later.',
//       }))
//   }


//   }

//   return (
//     <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
//       <div className="text-center mb-8">
//         <h1 className="text-2xl font-bold mb-2">Welcome to GCU Mailbox</h1>
//         <p className="text-gray-600">Sign in to access your university email</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//        {/* Global error message */}
//        {errors.global && (
//           <p className="bg-red-100 text-red-700 border border-red-400 rounded-md px-4 py-3 text-sm text-center mb-4">
//             {errors.global}
//           </p>
//         )}
//         <div className="space-y-2">
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email address
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-md ${
//               errors.email ? 'border-red-500' : 'border-gray-300'
//             } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               id="password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 border rounded-md ${
//                 errors.password ? 'border-red-500' : 'border-gray-300'
//               } focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-4 w-4 text-gray-500" />
//               ) : (
//                 <Eye className="h-4 w-4 text-gray-500" />
//               )}
//             </button>
//           </div>
//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//           )}
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <input
//               id="remember"
//               name="rememberMe"
//               type="checkbox"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
//               Remember me
//             </label>
//           </div>
//           <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
//             Forgot your password?
//           </Link>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           disabled={signInStatus === 'signing-in'}
//         >
//           {signInStatus === 'signing-in' ? 'Signing in...' : 'Sign in'}
//         </button>
//         {signInStatus === 'signing-in' && (
//           <p className="mt-2 text-sm text-blue-600">Signing in...</p>
//         )}
//         {signInStatus === 'success' && (
//           <p className="mt-2 text-sm text-green-600">Sign-in successful!</p>
//         )}
//       </form>
//     </div>
//   )
// }






// test code

// shariq code


// 'use client';
// import { useState, useEffect } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';
// import Link from 'next/link';

// export default function SignInForm({ onSignInSuccess }) {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({
//     email: '',
//     password: '',
//     global: '',
//   });
//   const [signInStatus, setSignInStatus] = useState(null);
//   const router = useRouter();

//   // Load remembered email and password from localStorage on component mount
//   useEffect(() => {
//     const rememberedEmail = localStorage.getItem('rememberedEmail');
//     const rememberedPassword = localStorage.getItem('rememberedPassword');
//     if (rememberedEmail) {
//       setFormData((prev) => ({ ...prev, email: rememberedEmail }));
//     }
//     if (rememberedPassword) {
//       setFormData((prev) => ({ ...prev, password: rememberedPassword }));
//     }
//   }, []);

//   // Handle input focus to show remembered email and password
//   const handleEmailFocus = () => {
//     const rememberedEmail = localStorage.getItem('rememberedEmail');
//     if (rememberedEmail && !formData.email) {
//       setFormData((prev) => ({ ...prev, email: rememberedEmail }));
//     }
//   };

//   const handlePasswordFocus = () => {
//     const rememberedPassword = localStorage.getItem('rememberedPassword');
//     if (rememberedPassword && !formData.password) {
//       setFormData((prev) => ({ ...prev, password: rememberedPassword }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({ email: '', password: '', global: '' });

//     if (!formData.email.includes('@')) {
//       setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
//       return;
//     }
//     if (formData.password.length < 8) {
//       setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters long' }));
//       return;
//     }

//     setSignInStatus('signing-in');

//     try {
//       const res = await signIn('credentials', {
//         email: formData.email,
//         password: formData.password,
//         redirect: false,
//       });

//       if (res.error) {
//         setErrors((prev) => ({ ...prev, global: res.error }));
//         setSignInStatus(null);
//         return;
//       }

//       // Handle "Remember Me" functionality
//       if (formData.rememberMe) {
//         localStorage.setItem('rememberedEmail', formData.email);
//         localStorage.setItem('rememberedPassword', formData.password);
//       } else {
//         localStorage.removeItem('rememberedEmail');
//         localStorage.removeItem('rememberedPassword');
//       }

//       router.push('/home');
//     } catch (error) {
//       setErrors((prev) => ({ ...prev, global: 'An error occurred. Please try again.' }));
//       setSignInStatus(null);
//     }
//   };

//   return (
//     // <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="w-full max-w-md p-12 bg-white rounded-xl shadow-lg">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold mb-2 text-black">Welcome to GCU Mailbox</h1>
//           <p className="text-gray-600">Sign in to access your university email</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {errors.global && <p className="text-red-600">{errors.global}</p>}

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               onFocus={handleEmailFocus} // Show remembered email on focus
//               autoComplete="email"
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white"
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={handleChange}
//                 onFocus={handlePasswordFocus} // Show remembered password on focus
//                 autoComplete="new-password"
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 bg-white"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
//               </button>
//             </div>
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//           </div>

//           {/* Remember Me */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center bg-white">
//               <input
//                 id="remember"
//                 name="rememberMe"
//                 type="checkbox"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white"
//               />
//               <label htmlFor="remember" className="ml-2 text-sm text-gray-900">
//                 Remember me
//               </label>
//             </div>
//             <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
//               Forgot your password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2"
//             disabled={signInStatus === 'signing-in'}
//           >
//             {signInStatus === 'signing-in' ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//   );
// }





"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function SignInForm({ onSignInSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    global: "",
  })
  const [signInStatus, setSignInStatus] = useState(null)
  const router = useRouter()

  // Load remembered email and password from localStorage on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    // const rememberedPassword = localStorage.getItem("rememberedPassword")
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }))
    }
    // if (rememberedPassword) {
    //   setFormData((prev) => ({ ...prev, password: rememberedPassword }))
    // }
  }, [])

  useEffect(() => {
    localStorage.removeItem("rememberedEmail")
    localStorage.removeItem("rememberedPassword")
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    })
  }, [])
  

  // Handle input focus to show remembered email and password
  const handleEmailFocus = () => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }))
    }
  }

  const handlePasswordFocus = () => {
    const rememberedPassword = localStorage.getItem("rememberedPassword")
    if (rememberedPassword && !formData.password) {
      setFormData((prev) => ({ ...prev, password: rememberedPassword }))
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: "", password: "", global: "" })

    if (!formData.email.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }))
      return
    }
    if (formData.password.length < 8) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters long" }))
      return
    }

    setSignInStatus("signing-in")

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl:"/home"
      })

      if (res.error) {
        setErrors((prev) => ({ ...prev, global: res.error }))
        setSignInStatus(null)
        return
      }

      // Handle "Remember Me" functionality
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email)
        localStorage.setItem("rememberedPassword", formData.password)
      } else {
        localStorage.removeItem("rememberedEmail")
        localStorage.removeItem("rememberedPassword")
      }

      router.push("/home")
    } catch (error) {
      setErrors((prev) => ({ ...prev, global: "An error occurred. Please try again." }))
      setSignInStatus(null)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden fixed inset-0 bg-gray-100">
      <div className="container mx-auto my-auto max-w-5xl h-[90vh] flex shadow-2xl rounded-3xl overflow-hidden">
        {/* Left side - Image background with GCU Mailbox */}
        <div
          className="w-1/2 relative rounded-l-3xl overflow-hidden"
          style={{
            backgroundImage: "url('/images.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Darker gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/60 to-pink-800/60"></div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full bg-white/40 blur-xl"></div>
            <div className="absolute bottom-[20%] right-[10%] w-40 h-40 rounded-full bg-pink-200/40 blur-xl"></div>
          </div>

          {/* Content positioned above the overlay with lighter text for contrast */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-8">
            <div className="mb-6 p-4 rounded-full bg-indigo-600/70 backdrop-blur-md shadow-xl">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">GCU Mailbox</h1>
            <p className="text-white text-lg max-w-md text-center font-medium drop-shadow-md">
              Access your university email and stay connected with your academic community
            </p>
            {/* <div className="mt-8 p-4 bg-white/20 backdrop-blur-md rounded-xl max-w-sm border border-white/40 shadow-lg">
              <p className="text-white italic text-sm drop-shadow-sm">
                "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
              </p>
              <p className="text-white text-sm mt-2 font-medium">— Malcolm X</p>
            </div> */}
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="w-1/2 bg-white flex items-center justify-center rounded-r-3xl">
          <div className="w-full max-w-md px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 text-sm mt-1">Sign in to access your university email</p>
            </div>

            {errors.global && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center">
                <span className="mr-2">⚠️</span>
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleEmailFocus}
                    autoComplete="new-email"
                    placeholder="your.email@gcu.edu"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handlePasswordFocus}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-xs text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                disabled={signInStatus === "signing-in"}
              >
                {signInStatus === "signing-in" ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-gray-500 text-xs">
              <p>© {new Date().getFullYear()} GCU University. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
















