
"use client";

// pages/departments.js
import Departments from "@components/Departments";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

const DepartmentPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900"></h1>
          <Departments />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DepartmentPage;

