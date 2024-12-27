"use client"
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Your Website</h3>
              <p className="mt-2 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-300">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  
  
  