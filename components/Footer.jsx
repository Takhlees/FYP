// "use client";
// import { useState } from "react";

// export default function Footer() {
//   const [showContact, setShowContact] = useState(false);
//   const [alertMessage, setAlertMessage] = useState(null);

//   const showAlert = (message) => {
//     setAlertMessage(message);
//     setTimeout(() => {
//       setAlertMessage(null);
//     }, 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const data = new FormData(form);

//     const response = await fetch("https://formspree.io/f/xblyknep", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//       },
//       body: data,
//     });

//     if (response.ok) {
//       showAlert("Your message has been submitted!");
//       form.reset();
//       setShowContact(false); // if you want to close the modal
//     } else {
//       showAlert("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <>
//       {alertMessage && (
//         <div className="fixed m-3 top-0 left-0 right-0 z-50 bg-gray-200 border border-gray-300  text-black text-center py-3 rounded-lg shadow-md transition-opacity duration-300">
//           {alertMessage}
//         </div>
//       )}
//       <footer className="w-full bg-deep py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-bold">Your Website</h3>
//               <p className="mt-2 text-sm text-secondary">
//                 © {new Date().getFullYear()} All rights reserved.
//               </p>
//             </div>
//             <div>
//               <ul className="flex space-x-4">
//                 <li>
//                   <Link href="#" className="hover:text-gray-600">
//                     Privacy Policy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-gray-600">
//                     Terms of Service
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setShowContact(!showContact)}
//                     className="hover:text-gray-600">
//                     Contact
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </footer>

//       {showContact && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Contact Information */}
//             <div className="bg-deep text-black p-6">
//               <h2 className="text-xl font-bold mb-4 border-b border-black pb-2">
//                 CONTACT US
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Name Field */}
//                 <div>
//                   <label
//                     htmlFor="UserName"
//                     className="block text-sm font-medium text-gray-700 mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     name="UserName"
//                     id="UserName"
//                     placeholder="Enter your name..."
//                     required
//                     autoComplete="off"
//                     className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   />
//                 </div>

//                 {/* Email Field */}
//                 <div>
//                   <label
//                     htmlFor="Email"
//                     className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="Email"
//                     id="Email"
//                     placeholder="Enter your email..."
//                     required
//                     autoComplete="off"
//                     className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   />
//                 </div>

//                 {/* Message Field */}
//                 <div>
//                   <label
//                     htmlFor="Message"
//                     className="block text-sm font-medium text-gray-700 mb-1">
//                     Message
//                   </label>
//                   <textarea
//                     name="Message"
//                     id="Message"
//                     rows="4"
//                     placeholder="Write your message..."
//                     required
//                     autoComplete="off"
//                     className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
//                 </div>

//                 {/* Buttons */}
//                 <div className="mt-10 flex justify-center gap-4">
//                   <button
//                     type="submit"
//                     className="bg-black px-10 py-2 text-white py-2 rounded-md font-medium transition-transform transform hover:scale-110 duration-300">
//                     Send Message
//                   </button>
//                   <button
//                     onClick={() => setShowContact(false)}
//                     className="bg-gray-200 px-10 py-2 bg-gray-300 text-black py-2 rounded-md font-medium transition-transform transform hover:scale-110 duration-300">
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import React, { useState } from "react";
import {
  Shield,
  Scale,
  Cookie,
  Lock,
  FileText,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const [showContact, setShowContact] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

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
      showAlert("Your message has been submitted!");
      form.reset();
      setShowContact(false);
    } else {
      showAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {alertMessage && (
        <div className="fixed m-3 top-0 left-0 right-0 z-50 bg-green-100 border border-green-300 text-green-800 text-center py-3 rounded-lg shadow-md transition-opacity duration-300">
          {alertMessage}
        </div>
      )}

      <footer className="bg-gray-200 text-black border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-black">Doculus</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Secure document management and scanning solution for modern
                organizations.
              </p>
            </div>

            {/* Legal Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4 text-black">Legal & Privacy</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-700 hover:text-black hover:pl-2 transition-all duration-300 ease-in-out flex items-center gap-2 text-sm group cursor-pointer"
                  >
                    <Shield className="w-4 h-4 group-hover:text-blue-400 transition-colors duration-300" />
                    <span className="group-hover:underline">
                      Privacy Policy
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-gray-700 hover:text-black hover:pl-2 transition-all duration-300 ease-in-out flex items-center gap-2 text-sm group cursor-pointer"
                  >
                    <Scale className="w-4 h-4 group-hover:text-blue-400 transition-colors duration-300" />
                    <span className="group-hover:underline">
                      Terms of Service
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4 text-black">Support</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setShowContact(true)}
                    className="text-gray-700 hover:text-black hover:pl-2 transition-all duration-300 ease-in-out text-sm block cursor-pointer hover:underline text-left"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-black hover:pl-2 transition-all duration-300 ease-in-out text-sm block cursor-pointer hover:underline"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4 text-black">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 group">
                  <Mail className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" />
                  <Link
                    href="mailto:projectfyp@gmail.com"
                    className="text-gray-700 hover:text-black transition-colors duration-300 cursor-pointer hover:underline"
                  >
                    projectfyp@gmail.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Consent Banner */}
        <CookieConsentBanner />
      </footer>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Contact Information */}
            <div className="bg-gray-50 text-black p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2">
                  CONTACT US
                </h2>
                <button
                  onClick={() => setShowContact(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="UserName"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="Message"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="mt-10 flex justify-center gap-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className={`bg-black px-10 py-2 text-white rounded-md font-medium transition-transform transform hover:scale-110 duration-300 ${
                      sending ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="bg-gray-200 px-10 py-2 text-black rounded-md font-medium transition-transform transform hover:scale-110 duration-300"
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
};

// Cookie Consent Banner Component
const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-700 border-t border-gray-600 p-4 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-gray-200">
          <Cookie className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p>
            We use cookies to improve your experience and analyze usage.
            <Link
              href="/cookie-policy"
              className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300 ml-1 cursor-pointer"
            >
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-500 hover:border-gray-400 rounded-lg transition-all duration-300 hover:bg-gray-600 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
