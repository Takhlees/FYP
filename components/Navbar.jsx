"use client"
import { useState } from 'react'
import Link from 'next/link'
import '@styles/globals.css'
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Doculus
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                Home
              </Link>
              <Link href="/departments?type=uni" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                Department
              </Link>
              <Link href="/departments?type=admin" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                Admin
              </Link>
             
              <Link href="/about" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                About
              </Link>
             
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </button>
              </div>
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Profile</Link>
                  <Link href="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Change Password</Link>
                  <Link href="/forgot-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Forgot Password</Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="departments" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Department
            </Link>
            <Link href="/admin" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Admin
            </Link>
            <Link href="/about" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">User Name</div>
                <div className="text-sm font-medium text-gray-500">user@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Profile
              </Link>
              <Link href="/change-password" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Change Password
              </Link>
              <Link href="/forgot-password" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

