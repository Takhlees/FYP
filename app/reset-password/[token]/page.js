"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword({ params }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false); //check user token is valid or not
  const [user, setUser] = useState(null);
  const router = useRouter();

  const getParams = use(params);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      isLongEnough
    );
  };

  useEffect(() => {
    const verifiedToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: await getParams.token,
          }),
        });

        // const data = await res.json() // Extract response data
        if (res.status === 400) {
          setError("Token is invalid or expired.");
          setVerified(true); //process of checking a validation
        }
        if (res.status === 200) {
          setError("");
          setVerified(true);
          const userData = await res.json();
          setUser(userData);
        }

        if (!res.ok) {
          setError(res.error || "user with this email dont exists.");
          return;
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        setError("An unexpected error occurred. Please try again later.");
      }
    };
    verifiedToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target[0].value;

    //validate password format
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
      );
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json(); // Extract response data
        setError(data.error || "user with this email dont exists.");
        return;
      } else {
        setError("");
        setVerified(true);
        router.push("/"); // Redirect if successful
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error.global && (
          <p className="bg-red-100 text-red-700 border border-red-400 rounded-md px-4 py-3 text-sm text-center mb-4">
            {error.global}
          </p>
        )}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-12 
                 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* Eye Icon Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {/* Show error below input */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={error.length > 0}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}
