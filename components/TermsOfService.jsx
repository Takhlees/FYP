import "../styles/globals.css";
import React from 'react';
import { FileText, AlertTriangle, Shield, Users, Settings, Scale, Clock, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with back navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="relative">
          <Link
            href="/home"
            className="absolute top-3 left-3 md:top-6 md:left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-lg font-bold p-2 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-16 md:pt-6 pb-4 md:pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
              <Scale className="w-7 h-7 md:w-8 md:h-8 text-gray-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Terms of Service</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Rules and guidelines for using our document management system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
          {/* Last Updated */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-5 md:p-6 mb-8 md:mb-10">
            <div className="flex items-center gap-2 text-gray-800 text-sm md:text-base">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Last Updated: January 15, 2025</span>
            </div>
            <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
              These terms may be updated periodically. Continued use of the service constitutes acceptance of any changes.
            </p>
          </div>

          {/* Agreement */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Agreement to Terms</span>
            </h2>
            <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 sm:p-6">
              <p className="text-gray-900 font-medium mb-2">Important Notice</p>
              <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                By accessing and using our Document Management System, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any part of these terms, you may not 
                use our service.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Service Description</span>
            </h2>
            <div className="space-y-5 md:space-y-6">
              <div className="border-l-4 border-gray-500 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Core Features</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Document scanning and uploading capabilities</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>AI-powered OCR (Optical Character Recognition)</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Document storage, organization, and retrieval</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Multi-user access with role-based permissions</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Search and categorization functionality</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>PDF generation and optimization</span></li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-400 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">System Capabilities</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Support for JPEG, PNG, and PDF file formats</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Advanced image enhancement and processing</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Automatic subject detection and metadata extraction</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Department-based document organization</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Real-time document preview and processing</span></li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-600 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Access & Availability</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Web-based interface accessible 24/7</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Multi-device compatibility (desktop, tablet, mobile)</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Secure user authentication and session management</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Regular system maintenance and updates</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>User Responsibilities</span>
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-yellow-800 font-medium mb-2">Acceptable Use</h3>
                    <p className="text-yellow-700 text-sm">
                      Users must only upload and process documents they have the legal right to handle. 
                      The system is intended for legitimate business and educational purposes only.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="text-gray-700 space-y-2 text-sm md:text-base pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Maintain the confidentiality of your account credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Ensure uploaded documents comply with applicable laws and regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Report any security concerns or suspicious activity immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Use the system in accordance with your organization's policies</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Prohibited Activities</span>
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm mb-3">
                The following activities are strictly prohibited and may result in account termination:
              </p>
              <ul className="text-red-700 space-y-1 text-sm pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Uploading malicious software, viruses, or harmful content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Attempting to gain unauthorized access to the system or other users' data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Using the service for illegal activities or to store illegal content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Sharing account credentials with unauthorized individuals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Attempting to reverse engineer or compromise system security</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Privacy & Security */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Data Privacy & Security</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                We are committed to protecting your data and maintaining the highest security standards:
              </p>
              <ul className="text-gray-700 space-y-2 text-sm md:text-base pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>All data transmission is encrypted using industry-standard protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Access to documents is restricted to authorized users only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Regular security audits and vulnerability assessments are conducted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Data backups are performed regularly to ensure business continuity</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Service Availability */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Service Availability</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                While we strive to maintain 99.9% uptime, the service may be temporarily unavailable due to:
              </p>
              <ul className="text-gray-700 space-y-2 text-sm md:text-base pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Scheduled maintenance and system updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Unforeseen technical issues or outages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span>Force majeure events beyond our control</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                We will provide advance notice for scheduled maintenance whenever possible.
              </p>
            </div>
          </section>

          {/* Contact & Support */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Contact & Support</span>
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-3">
                For questions about these terms or technical support:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Email:</strong> support@documentmanagement.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

