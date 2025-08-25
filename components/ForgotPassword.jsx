import "@styles/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from "@/utils/toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Show loading toast
    const loadingToastId = showLoadingToast("Sending reset link", "Please wait while we process your request...");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.error || "User with this email doesn't exist.";
        setError(errorMessage);
        
        // Update loading toast to error
        updateToast(loadingToastId, "error", "Reset link failed", errorMessage);
        setLoading(false);
        return;
      }

      // Update loading toast to success
      updateToast(loadingToastId, "success", "Reset link sent!", "Check your email for password reset instructions.");
      
      // Clear form and redirect after a short delay
      setTimeout(() => {
        setEmail("");
        router.push("/");
      }, 2000);

    } catch (error) {
      const errorMessage = "An unexpected error occurred. Please try again later.";
      setError(errorMessage);
      
      // Update loading toast to error
      updateToast(loadingToastId, "error", "Reset link failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button - Fixed in left corner */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}{" "}
          {/* Show error below input */}
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </form>
    </div>
  );
}

