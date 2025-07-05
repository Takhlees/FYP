"use client";

import { useState, useEffect } from "react";
import {
  
  PlusIcon,
  MinusIcon,
  Mail,
  FileText,
  Clock,
  Users,
  Search,
  Shield,
  Building,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { PulseLoader } from "react-spinners";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export default function AboutPage() {
  const [activeFeature, setActiveFeature] = useState("smart");
  const [isLoading, setIsLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);

  const features = [
    {
      id: "smart",
      title: "Smart Document Routing",
      description: "Automatically route documents to the correct department based on your selection.",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      id: "search",
      title: "Powerful Search",
      description: "Locate any document quickly with advanced search",
      icon: <Search className="h-6 w-6" />,
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      id: "automation",
      title: "Workflow Automation",
      description: "Streamline approvals and document processing",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-gradient-to-br from-[#3B5FE3] to-blue-600",
    },
    {
      id: "security",
      title: "Enterprise Security",
      description: "Keep university documents secure and compliant",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-gradient-to-br from-[#3B5FE3] to-red-600",
    },
  ];

  const departments = [
    {
      name: "Academic Affairs",
      description: "Upload and manage faculty-related communications, notices, and official documents.",
      icon: <BookOpen className="h-6 w-6 text-[#3B5FE3]" />,
    },
    {
      name: "Administration",
      description: "Handle institutional correspondence, internal memos, and department-level documentation.",
      icon: <Building className="h-6 w-6 text-[#3B5FE3]" />,
    },
    {
      name: "Student Services",
      description: "Maintain internal records, student correspondence, and departmental notices — managed only by authorized admins.",
      icon: <Users className="h-6 w-6 text-[#3B5FE3]" />,
    },
    {
      name: "Research Departments",
      description: "Organize research-related files, approvals, and communication logs — securely stored and easily searchable.",
      icon: <Mail className="h-6 w-6 text-[#3B5FE3]" />,
    },
  ];

  const faqs = [
    {
      question: "Who can access this system?",
      answer:
        "Only authorized admins can access the system. Admins are provided with a pre-assigned email and password. There is no public sign-up option.",
    },
    {
      question: "Can admins reset or change their password?",
      answer:
        "Yes. The system provides a Forgot Password feature to reset password and Change Password feature to change password.",
    },
    {
      question: "What kind of files can be uploaded or scanned?",
      answer:
        "The system supports PDF files. Admins can either upload existing PDF documents or use the Scan feature to convert documents into PDF using a mobile device.",
    },
    {
      question: "What is the purpose of the Overdue Mails section?",
      answer:
        "This section shows all files with an open status. Admins can click on a specific file to view details and change its status (e.g., to closed). Once the status is updated, the file no longer appears in this section.",
    },
  ];

  useEffect(() => {
    // This timeout simulates loading - replace with your actual loading checks
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <PulseLoader color="#d2d4d6" size={17} speedMultiplier={0.7} />
        </div>
      )}
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <header className="relative overflow-hidden">

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Modern Document Management for{" "}
                <span className="bg-gradient-to-r from-black via-mid to-light bg-clip-text text-transparent">Universities</span>
              </h1>
              <p className="text-xl text-gray-600 mt-8 mb-8">
              Doculus provides an intuitive, efficient solution for managing academic and administrative documents. From uploading and scanning to organizing and retrieving your files — everything is simplified.
              </p>
             
            </div>
          </div>
        </header>

        <main>
          {/* Features Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mb-3">
                  Powerful Features
                </h2>
                <p className="text-[#6B7280] max-w-2xl mx-auto">
                Smart, secure, and efficient document management for universities.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className={`${feature.color} p-6 flex justify-center items-center`}
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#111827] mb-2 group-hover:text-[#3B5FE3] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[#6B7280]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Departments Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mb-3">
                  Serving All University Departments
                </h2>
                <p className="text-[#6B7280] max-w-2xl mx-auto">
                  Our system streamlines document management across various departments while maintaining a centralized, secure platform.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-[#3B5FE3] border border-[#F3F4F6] group"
                  >
                    <div className="p-3 rounded-lg bg-[#F3F4F6] inline-flex mb-4 group-hover:bg-[#3B5FE3]/10 transition-colors">
                      {dept.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-[#6B7280]">{dept.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-[#6B7280] max-w-2xl mx-auto">
                  Everything you need to know about our mailing system.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="mb-4 bg-gray-100 rounded-lg shadow-sm overflow-hidden transition-all duration-200"
                  >
                    <button
                      className="flex justify-between items-center w-full text-left p-6"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={openFAQ === index}
                    >
                      <h3 className="text-lg font-semibold text-[#111827]">
                        {faq.question}
                      </h3>
                      <div
                        className={`p-1 rounded-full ${
                          openFAQ === index ? "bg-[#3B5FE3]/10" : "bg-white"
                        } transition-colors`}
                      >
                        {openFAQ === index ? (
                          <MinusIcon className="h-5 w-5 text-[#3B5FE3]" />
                        ) : (
                          <PlusIcon className="h-5 w-5 text-[#6B7280]" />
                        )}
                      </div>
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-6 text-[#6B7280] animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
                
        </main>

        <Footer />
      </div>
    </>
  );
}
