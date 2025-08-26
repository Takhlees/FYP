"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { showErrorToast, showLoadingToast, updateToast, dismissToast } from "@/utils/toast";

export default function SignInForm({ onSignInSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    global: "",
  });
  const [signInStatus, setSignInStatus] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  
  // Load remembered email and password from localStorage on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    // const rememberedPassword = localStorage.getItem("rememberedPassword")
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
    }
    // if (rememberedPassword) {
    //   setFormData((prev) => ({ ...prev, password: rememberedPassword }))
    // }
  }, []);

  useEffect(() => {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
  }, []);

  // Handle input focus to show remembered email and password
  const handleEmailFocus = () => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
    }
  };

  const handlePasswordFocus = () => {
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedPassword && !formData.password) {
      setFormData((prev) => ({ ...prev, password: rememberedPassword }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", global: "" });

    if (!formData.email.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      return;
    }
    if (formData.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
      return;
    }

    setSignInStatus("signing-in");

    // Show loading toast
    const loadingToastId = showLoadingToast("Signing in", "Please wait while we authenticate you...");

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: "/home",
      });

      if (res.error) {
        setErrors((prev) => ({ ...prev, global: res.error }));
        setSignInStatus(null);
        
        updateToast(loadingToastId, "error", "Sign in failed", res.error);
        return;
      }

      // Handle "Remember Me" functionality
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedPassword", formData.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      // Dismiss the loading toast since we don't want any toast during success
      // The success will be shown on the home page instead
      dismissToast(loadingToastId);

      // Set success state
      setLoginSuccess(true);

      // Redirect to home page
      setTimeout(() => {
        router.push("/home?from=login");
      }, 2000);

    } catch (error) {
      const errorMessage = "An error occurred. Please try again.";
      setErrors((prev) => ({ ...prev, global: errorMessage }));
      setSignInStatus(null);
      
      updateToast(loadingToastId, "error", "Sign in failed", errorMessage);
    }
  };

  return (
    <div className="flex h-screen w-full p-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row h-full shadow-2xl rounded-2xl overflow-hidden">
        <div
          className="hidden md:block w-1/2 relative overflow-hidden rounded-l-2xl"
          style={{
            backgroundImage: "url('/new.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="absolute inset-0 bg-gray-600/70"></div>

          <div className="relative z-10 flex flex-col justify-center items-center h-full p-8">
            <div className="mb-6 p-4 rounded-full bg-indigo-600/70 backdrop-blur-md shadow-xl">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">
              DOCULUS
            </h1>
            <p className="text-white text-lg max-w-md text-center font-medium drop-shadow-md">
              Step into seamless digital file management system.
            </p>
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 flex items-center justify-center rounded-r-2xl">
          <div className="w-full max-w-md px-6 md:px-8 py-6 md:py-0">
            {/* Mobile Header - Show on mobile only */}
            <div className="md:hidden text-center mb-8">
              <div className="mb-4 p-3 rounded-full bg-indigo-600/70 backdrop-blur-md shadow-xl w-fit mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                DOCULUS
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Digital file management system
              </p>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Welcome To Doculus!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Sign in to manage, upload, and scan your documents effortlessly.
              </p>
            </div>

            {errors.global && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center">
                <span className="mr-2">⚠️</span>
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
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
                    className="w-full pl-9 pr-3 py-3 md:py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
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
                    className="w-full pl-9 pr-9 py-3 md:py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm dark:text-white dark:placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:bg-gray-700"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-medium py-3 md:py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={signInStatus === "signing-in" || loginSuccess}>
                {loginSuccess ? (
                  <>
                    Success!
                  </>
                ) : signInStatus === "signing-in" ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 text-gray-500 dark:text-gray-400 text-xs">
              <p>
                © {new Date().getFullYear()} GCU University. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
