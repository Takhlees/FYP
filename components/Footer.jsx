

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Globe, Phone, Shield, FileText } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [sending, setSending] = useState(false);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (showContact) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showContact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    setSending(true);
    const response = await fetch("https://formspree.io/f/xblyknep", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    });
    setSending(false);

    if (response.ok) {
      showSuccessToast("Message Sent!", "Your message has been submitted successfully.");
      form.reset();
      setShowContact(false);
    } else {
      showErrorToast("Submission Failed", "Something went wrong. Please try again.");
    }
  }

  return (
    <>
    <footer className="w-full bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Doculus
            </h3>
              </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced document management system for universities and administrative departments.
              </p>
            </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ease-in-out flex items-center gap-2 group cursor-pointer"
                >
                    <span className="group-hover:underline">
                  About Us
                    </span>
                </Link>
              </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ease-in-out flex items-center gap-2 group cursor-pointer"
                  >
                    <Shield className="w-4 h-4 group-hover:text-blue-400 transition-colors duration-300" />
                    <span className="group-hover:underline">
                      Privacy Policy
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
              Contact
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowContact(true)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    Contact Support
                  </button>
                </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  GCU Lahore
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-600">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Doculus. All rights reserved.
          </p>
        </div>
      </div>

    </footer>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 dark:bg-gray-700 text-black dark:text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">
                  CONTACT US
                </h2>
                <button
                  onClick={() => setShowContact(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="UserName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="UserName"
                    id="UserName"
                    placeholder="Enter your name..."
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    id="Email"
                    placeholder="Enter your email..."
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="Message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="Message"
                    id="Message"
                    rows="4"
                    placeholder="Write your message..."
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
                <div className="mt-10 flex justify-center gap-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className={`bg-black dark:bg-blue-600 px-10 py-2 text-white rounded-md font-medium transition-transform transform hover:scale-110 duration-300 ${
                      sending ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="bg-gray-200 dark:bg-gray-600 px-10 py-2 text-black dark:text-white rounded-md font-medium transition-transform transform hover:scale-110 duration-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

