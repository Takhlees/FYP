"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
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
      description: "Course materials and faculty communications",
      icon: <BookOpen className="h-6 w-6 text-[#3B5FE3]" />,
    },
    {
      name: "Administration",
      description: "Institutional correspondence and records",
      icon: <Building className="h-6 w-6 text-[#3B5FE3]" />,
    },
    {
      name: "Student Services",
      description: "Student communications and records",
      icon: <Users className="h-6 w-6 text-[#3B5FE3]" />,
    },
    {
      name: "Research Departments",
      description: "Grant documents and research correspondence",
      icon: <Mail className="h-6 w-6 text-[#3B5FE3]" />,
    },
  ];

  const faqs = [
    {
      question: "How secure is the document management system?",
      answer:
        "Our system uses role-based access controls, encryption, and comprehensive audit logs to ensure all university documents remain secure and compliant with educational data protection regulations.",
    },
    {
      question: "Can it integrate with existing university systems?",
      answer:
        "Yes, our system integrates with common university management systems, student information systems, and learning management platforms.",
    },
    {
      question: "How does it handle different department needs?",
      answer:
        "Each department can customize their workflows, document types, and access permissions while maintaining a unified system across the university.",
    },
    {
      question: "What support do you provide?",
      answer:
        "We offer training for all staff, dedicated support for administrators, and comprehensive documentation to ensure smooth implementation.",
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
              {/* <div className="flex flex-wrap gap-4">
              <a
                href="/demo"
                className="px-6 py-3 bg-[#3B5FE3] text-white rounded-lg hover:bg-[#3051C6] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Request Demo
              </a>
              <a
                href="/learn-more"
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
              Learn More
              </a>
            </div> */}
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

          {/* Benefits Section */}
          <section className="py-16 bg-[#F3F4F6]">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-[#111827] mb-6">
                    Benefits for Your University
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-[#3B5FE3]/10">
                        <CheckCircleIcon className="h-5 w-5 text-[#3B5FE3]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#111827]">
                         Faster Document Processing
                        </h3>
                        <p className="text-[#6B7280]">
                          Automated routing and approvals dramatically reduce
                          processing time
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-[#3B5FE3]/10">
                        <CheckCircleIcon className="h-5 w-5 text-[#3B5FE3]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#111827]">
                          Enhanced Interdepartmental Collaboration
                        </h3>
                        <p className="text-[#6B7280]">
                          Share documents securely between departments with
                          complete tracking
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-[#3B5FE3]/10">
                        <CheckCircleIcon className="h-5 w-5 text-[#3B5FE3]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#111827]">
                          Improved Compliance & Security
                        </h3>
                        <p className="text-[#6B7280]">
                          Meet educational data protection requirements with
                          robust security
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3B5FE3]/10 to-transparent rounded-xl"></div>
                  <div className="relative bg-white rounded-xl shadow-lg p-8 border border-[#F3F4F6]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-[#111827]">
                        Document Processing
                      </h3>
                      <span className="text-[#3B5FE3] font-bold">
                        75% Faster
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[#6B7280]">
                            Traditional Process
                          </span>
                          <span className="text-[#6B7280]">4 days</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-400 h-2 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[#6B7280]">With Doculus</span>
                          <span className="text-[#6B7280]">1 day</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#3B5FE3] h-2 rounded-full"
                            style={{ width: "25%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  Our system adapts to the unique needs of each department while
                  maintaining a unified platform
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
          <section className="py-16 bg-[#F3F4F6]">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-[#6B7280] max-w-2xl mx-auto">
                  Everything you need to know about our university mail
                  management system
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200"
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
                          openFAQ === index ? "bg-[#3B5FE3]/10" : "bg-[#F3F4F6]"
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

          {/* CTA Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="bg-[#1E213A] text-white rounded-2xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#3B5FE3]/30 to-purple-500/20 blur-3xl rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#3B5FE3]/20 to-blue-500/10 blur-3xl rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
                </div>

                {/* <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">Ready to Transform Document Management?</h2>
                  <p className="text-xl text-gray-300">
                    Join leading universities that have streamlined their administrative processes
                  </p>
                </div>
                <div>
                  <a
                    href="/demo"
                    className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#3B5FE3] rounded-lg hover:bg-[#3051C6] transition-all transform hover:scale-105 shadow-lg"
                  >
                  Schedule a Demo
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div> */}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
