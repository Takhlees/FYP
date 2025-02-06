
"use client"
import { useState } from "react"

export default function Footer() {
  const [showContact, setShowContact] = useState(false)

  return (
    <>
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Your Website</h3>
              <p className="mt-2 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="hover:text-blue-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <button onClick={() => setShowContact(!showContact)} className="hover:text-blue-200">
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
            <div className="bg-blue-900 text-white p-6">
              <h2 className="text-xl font-bold mb-4 border-b border-blue-800 pb-2">CONTACT US</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>cantt, Lahore, Pakistan</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a href="mailto:info@gcu.edu.pk" className="hover:text-blue-200">
                    info@gcu.edu.pk
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <div>+ 92 3258783249</div>
                    <div>+ 92 3024936848</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowContact(false)}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


  
  
  
  