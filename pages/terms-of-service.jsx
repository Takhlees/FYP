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
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-bold">Back to Home</span>
          </Link>
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-gray-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-600 mt-1">Rules and guidelines for using our document management system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Last Updated */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-gray-800">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Last Updated: January 15, 2025</span>
            </div>
            <p className="text-gray-700 mt-2 text-sm">
              These terms may be updated periodically. Continued use of the service constitutes acceptance of any changes.
            </p>
          </div>

          {/* Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-600" />
              Agreement to Terms
            </h2>
            <div className="bg-gray-100 border border-gray-400 rounded-lg p-6">
              <p className="text-gray-900 font-medium mb-2">Important Notice</p>
              <p className="text-gray-800">
                By accessing and using our Document Management System, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any part of these terms, you may not 
                use our service.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-600" />
              Service Description
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-gray-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Core Features</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Document scanning and uploading capabilities</li>
                  <li>• AI-powered OCR (Optical Character Recognition)</li>
                  <li>• Document storage, organization, and retrieval</li>
                  <li>• Multi-user access with role-based permissions</li>
                  <li>• Search and categorization functionality</li>
                  <li>• PDF generation and optimization</li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">System Capabilities</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Support for JPEG, PNG, and PDF file formats</li>
                  <li>• Advanced image enhancement and processing</li>
                  <li>• Automatic subject detection and metadata extraction</li>
                  <li>• Department-based document organization</li>
                  <li>• Real-time document preview and processing</li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Access & Availability</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Web-based interface accessible 24/7</li>
                  <li>• Multi-device compatibility (desktop, tablet, mobile)</li>
                  <li>• Secure user authentication and session management</li>
                  <li>• Regular system maintenance and updates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-600" />
              User Responsibilities
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3">Account Security</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Create strong, unique passwords</li>
                  <li>• Keep login credentials confidential</li>
                  <li>• Report unauthorized access immediately</li>
                  <li>• Log out from shared or public devices</li>
                  <li>• Enable two-factor authentication when available</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3">Appropriate Use</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Use system for legitimate business purposes only</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Maintain professional conduct</li>
                  <li>• Follow organizational policies and procedures</li>
                  <li>• Report technical issues promptly</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3">Content Compliance</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Upload only authentic, legitimate documents</li>
                  <li>• Ensure you have rights to uploaded content</li>
                  <li>• Verify document accuracy and completeness</li>
                  <li>• Comply with data classification requirements</li>
                  <li>• Follow retention and disposal policies</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <h3 className="font-semibold text-gray-800 mb-3">System Resources</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Use reasonable amounts of storage space</li>
                  <li>• Avoid excessive automated uploads</li>
                  <li>• Respect file size limitations (10MB max)</li>
                  <li>• Delete unnecessary or outdated documents</li>
                  <li>• Report performance issues</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-gray-700" />
              Prohibited Activities
            </h2>
            
            <div className="bg-gray-200 border border-gray-400 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Strictly Prohibited</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <h4 className="font-medium mb-2">Security Violations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Attempting to access other users' documents</li>
                    <li>• Sharing login credentials with others</li>
                    <li>• Circumventing security measures</li>
                    <li>• Attempting to hack or exploit the system</li>
                    <li>• Installing malicious software or scripts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Content Violations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Uploading illegal or harmful content</li>
                    <li>• Sharing copyrighted material without permission</li>
                    <li>• Uploading viruses, malware, or corrupted files</li>
                    <li>• Storing personal or non-business documents</li>
                    <li>• Creating fake or fraudulent documents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">System Abuse</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Overloading servers with excessive requests</li>
                    <li>• Using automated tools for bulk operations</li>
                    <li>• Attempting to disrupt service availability</li>
                    <li>• Reverse engineering system components</li>
                    <li>• Data mining or scraping activities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Privacy Violations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Accessing documents without authorization</li>
                    <li>• Sharing confidential information externally</li>
                    <li>• Collecting personal data without consent</li>
                    <li>• Violating privacy laws and regulations</li>
                    <li>• Using data for unauthorized purposes</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Service Limitations */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Limitations & Disclaimers</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-400 bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">OCR Accuracy</h3>
                <p className="text-gray-800 text-sm">
                  While our OCR technology is highly advanced, text extraction may contain errors. Users should 
                  review and verify extracted text for accuracy, especially for critical documents.
                </p>
              </div>

              <div className="border border-gray-300 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">File Limitations</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Maximum file size: 10MB per upload</li>
                  <li>• Supported formats: JPEG, PNG, PDF</li>
                  <li>• Processing time varies based on file size and complexity</li>
                  <li>• Storage quotas may apply per user or department</li>
                </ul>
              </div>

              <div className="border border-gray-300 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Service Availability</h3>
                <p className="text-gray-700 text-sm">
                  While we strive for 99.9% uptime, the service may occasionally be unavailable due to 
                  maintenance, updates, or technical issues. We will provide advance notice when possible.
                </p>
              </div>

              <div className="border border-gray-300 bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Third-Party Dependencies</h3>
                <p className="text-gray-700 text-sm">
                  Our service relies on third-party components (OCR engines, cloud storage). We are not 
                  responsible for third-party service outages or performance issues.
                </p>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Management</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Account Creation</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Valid email address required</li>
                  <li>• Must be authorized by organization administrator</li>
                  <li>• Account verification may be required</li>
                  <li>• One account per person policy</li>
                  <li>• Accurate information must be provided</li>
                </ul>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Account Suspension</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Violation of terms may result in suspension</li>
                  <li>• Security concerns or suspicious activity</li>
                  <li>• Non-compliance with organizational policies</li>
                  <li>• Excessive resource usage</li>
                  <li>• Appeal process available</li>
                </ul>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Account Termination</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Users may request account deletion</li>
                  <li>• Serious violations may result in permanent ban</li>
                  <li>• Employment termination triggers account closure</li>
                  <li>• Data retention policies apply after termination</li>
                  <li>• No refunds for terminated accounts</li>
                </ul>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Data After Closure</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Documents may be retained for compliance</li>
                  <li>• Personal data deleted according to privacy policy</li>
                  <li>• Backup data purged after 90 days</li>
                  <li>• Access to documents permanently removed</li>
                  <li>• Export options available before closure</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Liability & Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-gray-600" />
              Liability & Disclaimers
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-100 border border-gray-400 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Service Warranty</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>

              <div className="bg-gray-200 border border-gray-400 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="text-gray-800 text-sm leading-relaxed mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="text-gray-800 text-sm space-y-1">
                  <li>• Direct, indirect, incidental, or consequential damages</li>
                  <li>• Loss of data, profits, business, or goodwill</li>
                  <li>• Service interruptions or technical failures</li>
                  <li>• Third-party actions or content</li>
                  <li>• Any damages exceeding the amount paid for services</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">User Indemnification</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You agree to indemnify and hold harmless our organization from any claims, damages, 
                  or expenses arising from your use of the service, violation of these terms, or 
                  infringement of any third-party rights.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Data Backup Responsibility</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  While we maintain regular backups, users are responsible for maintaining their own 
                  copies of critical documents. We recommend regular downloads of important files.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-gray-600" />
              Contact Information
            </h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <p className="text-gray-800 mb-4">
                For questions about these Terms of Service or to report violations:
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">General Inquiries</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Email:</strong> projectfyp@gmail.com</li>
                    <li><strong>Hours:</strong> Monday-Friday, 8 AM - 6 PM EST</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Legal Department</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Email:</strong> projectfyp@gmail.com</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-8">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-800 mb-3">Acknowledgment</h3>
              <p className="text-gray-700">
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