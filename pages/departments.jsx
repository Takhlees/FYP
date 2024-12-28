"use client";

// pages/departments.js
import Departments from "@components/Departments";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

const DepartmentPage = () => {
  return (
    <>
      <Navbar />
      <div>
        <Departments />
      </div>
      <Footer />
    </>
  );
};

export default DepartmentPage;
