"use client";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Departments from "@components/Departments";

const AdminDep = () => {
  return (
    <>
      <Navbar />
      <div >
        <Departments />
      </div>
      <Footer />
    </>
  );
};

export default AdminDep;

