import "../styles/globals.css";
import React from 'react';
import { FileText, AlertTriangle, Shield, Users, Settings, Scale, Clock, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const TermsOfServicePage = () => {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Account Security</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Create strong, unique passwords</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Keep login credentials confidential</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Report unauthorized access immediately</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Log out from shared or public devices</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Enable two-factor authentication when available</span></li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 md:p-5 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Appropriate Use</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Use system for legitimate business purposes only</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Respect intellectual property rights</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Maintain professional conduct</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Follow organizational policies and procedures</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Report technical issues promptly</span></li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Content Compliance</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Upload only authentic, legitimate documents</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Ensure you have rights to uploaded content</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Verify document accuracy and completeness</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Comply with data classification requirements</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Follow retention and disposal policies</span></li>
                </ul>
              </div>
              <div className="bg-gray-100 p-4 md:p-5 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">System Resources</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Use reasonable amounts of storage space</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Avoid excessive automated uploads</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Respect file size limitations (10MB max)</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Delete unnecessary or outdated documents</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Report performance issues</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-gray-700 flex-shrink-0" />
              <span>Prohibited Activities</span>
            </h2>
            <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-base md:text-lg">Strictly Prohibited</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 text-gray-800">
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Security Violations</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Attempting to access other users' documents</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Sharing login credentials with others</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Circumventing security measures</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Attempting to hack or exploit the system</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Installing malicious software or scripts</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Content Violations</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Uploading illegal or harmful content</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Sharing copyrighted material without permission</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Uploading viruses, malware, or corrupted files</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Storing personal or non-business documents</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Creating fake or fraudulent documents</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">System Abuse</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Overloading servers with excessive requests</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Using automated tools for bulk operations</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Attempting to disrupt service availability</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Reverse engineering system components</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Data mining or scraping activities</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Privacy Violations</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Accessing documents without authorization</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Sharing confidential information externally</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Collecting personal data without consent</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Violating privacy laws and regulations</span></li>
                    <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Using data for unauthorized purposes</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Service Limitations */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">Service Limitations & Disclaimers</h2>
            <div className="space-y-5 md:space-y-6">
              <div className="border border-gray-400 bg-gray-100 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">OCR Accuracy</h3>
                <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                  While our OCR technology is highly advanced, text extraction may contain errors. Users should 
                  review and verify extracted text for accuracy, especially for critical documents.
                </p>
              </div>
              <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">File Limitations</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Maximum file size: 10MB per upload</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Supported formats: JPEG, PNG, PDF</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Processing time varies based on file size and complexity</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Storage quotas may apply per user or department</span></li>
                </ul>
              </div>
              <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Service Availability</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  While we strive for 99.9% uptime, the service may occasionally be unavailable due to 
                  maintenance, updates, or technical issues. We will provide advance notice when possible.
                </p>
              </div>
              <div className="border border-gray-300 bg-white rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Third-Party Dependencies</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Our service relies on third-party components (OCR engines, cloud storage). We are not 
                  responsible for third-party service outages or performance issues.
                </p>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">Account Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Account Creation</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Valid email address required</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Must be authorized by organization administrator</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Account verification may be required</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>One account per person policy</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Accurate information must be provided</span></li>
                </ul>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Account Suspension</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Violation of terms may result in suspension</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Security concerns or suspicious activity</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Non-compliance with organizational policies</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Excessive resource usage</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Appeal process available</span></li>
                </ul>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Account Termination</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Users may request account deletion</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Serious violations may result in permanent ban</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Employment termination triggers account closure</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Data retention policies apply after termination</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>No refunds for terminated accounts</span></li>
                </ul>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Data After Closure</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Documents may be retained for compliance</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Personal data deleted according to privacy policy</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Backup data purged after 90 days</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Access to documents permanently removed</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Export options available before closure</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Liability & Disclaimers */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Liability & Disclaimers</span>
            </h2>
            <div className="space-y-6 md:space-y-8">
              <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Service Warranty</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>
              <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-base md:text-lg">Limitation of Liability</h3>
                <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="text-gray-800 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Direct, indirect, incidental, or consequential damages</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Loss of data, profits, business, or goodwill</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Service interruptions or technical failures</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Third-party actions or content</span></li>
                  <li className="flex items-start gap-2"><span className="text-gray-500 mt-1">•</span><span>Any damages exceeding the amount paid for services</span></li>
                </ul>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">User Indemnification</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  You agree to indemnify and hold harmless our organization from any claims, damages, 
                  or expenses arising from your use of the service, violation of these terms, or 
                  infringement of any third-party rights.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Data Backup Responsibility</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  While we maintain regular backups, users are responsible for maintaining their own 
                  copies of critical documents. We recommend regular downloads of important files.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Contact Information</span>
            </h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-6">
              <p className="text-gray-800 mb-4 text-sm md:text-base leading-relaxed">
                For questions about these Terms of Service or to report violations:
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2 text-base md:text-lg">General Inquiries</h3>
                  <ul className="space-y-2 text-sm md:text-base">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1"><strong className="min-w-[60px]">Email:</strong><span className="break-all">projectfyp@gmail.com</span></li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1"><strong className="min-w-[60px]">Hours:</strong><span>Monday-Friday, 8 AM - 6 PM EST</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-base md:text-lg">Legal Department</h3>
                  <ul className="space-y-2 text-sm md:text-base">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1"><strong className="min-w-[60px]">Email:</strong><span className="break-all">projectfyp@gmail.com</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-8 md:mb-10">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Acknowledgment</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                By using our Document Management System, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Thank you for using our service responsibly and in compliance with these terms.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;