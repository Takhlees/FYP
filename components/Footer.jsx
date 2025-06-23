"use client";
import { useState } from "react";

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const response = await fetch("https://formspree.io/f/xblyknep", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    });

    if (response.ok) {
      showAlert("Your message has been submitted!");
      form.reset();
      setShowContact(false); // if you want to close the modal
    } else {
      showAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {alertMessage && (
        <div className="fixed m-3 top-0 left-0 right-0 z-50 bg-gray-200 border border-gray-300  text-black text-center py-3 rounded-lg shadow-md transition-opacity duration-300">
          {alertMessage}
        </div>
      )}
      <footer className="w-full bg-deep py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Doculus</h3>
              <p className="mt-2 text-sm text-secondary">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="hover:text-gray-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setShowContact(!showContact)}
                    className="hover:text-gray-600">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Contact Information */}
            <div className="bg-deep text-black p-6">
              <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">
                CONTACT US
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="UserName"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="UserName"
                    id="UserName"
                    placeholder="Enter your name..."
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    id="Email"
                    placeholder="Enter your email..."
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="Message"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="Message"
                    id="Message"
                    rows="4"
                    placeholder="Write your message..."
                    required
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
                </div>

                {/* Buttons */}
                <div className="mt-10 flex justify-center gap-4">
                  <button
                    type="submit"
                    className="bg-black px-10 py-2 text-white py-2 rounded-md font-medium transition-transform transform hover:scale-110 duration-300">
                    Send Message
                  </button>
                  <button
                    onClick={() => setShowContact(false)}
                    className="bg-gray-200 px-10 py-2 bg-gray-300 text-black py-2 rounded-md font-medium transition-transform transform hover:scale-110 duration-300">
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
