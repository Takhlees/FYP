"use client";

import "../styles/globals.css";
import React from 'react';
import { Shield, Lock, Eye, Database, Users, FileText, Clock, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with back navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="relative">
          <Link
            href="/home"
            className="absolute top-2 left-2 md:top-6 md:left-6 flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-lg font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 pt-10 md:pt-6 pb-4 md:pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">How we protect and handle your information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-8">

          {/* Last Updated */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2 text-gray-800 text-sm md:text-base">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Last Updated: January 15, 2025</span>
            </div>
            <p className="text-gray-700 mt-2 text-xs sm:text-sm md:text-base">
              We may update this Privacy Policy from time to time. We will notify you of any material changes.
            </p>
          </div>

          {/* Overview */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              Overview
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              This Privacy Policy describes how our Document Management System collects, uses, and protects 
              your personal information when you use our document scanning, uploading, and management services. 
              We are committed to protecting your privacy and ensuring the security of your documents and data.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              Information We Collect
            </h2>
            <div className="space-y-4 md:space-y-6">
              <div className="border-l-4 border-gray-500 pl-3 md:pl-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Document Content</h3>
                <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                  <li>• Scanned documents and uploaded files</li>
                  <li>• Extracted text content from OCR processing</li>
                  <li>• Document metadata (file names, subjects, dates)</li>
                  <li>• Enhanced and processed document versions</li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-400 pl-3 md:pl-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Account Information</h3>
                <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                  <li>• Name and email address</li>
                  <li>• Department and role within organization</li>
                  <li>• User preferences and settings</li>
                  <li>• Authentication credentials (encrypted)</li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-600 pl-3 md:pl-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Usage Data</h3>
                <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                  <li>• Login times and session information</li>
                  <li>• Features used and documents accessed</li>
                  <li>• System interactions and navigation patterns</li>
                  <li>• Error logs and performance metrics</li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-500 pl-3 md:pl-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Technical Information</h3>
                <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                  <li>• IP addresses and device information</li>
                  <li>• Browser type and operating system</li>
                  <li>• Network connection details</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              How We Use Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Core Services</h3>
                <ul className="text-gray-700 text-xs md:text-sm space-y-1">
                  <li>• Document processing and OCR</li>
                  <li>• File storage and retrieval</li>
                  <li>• User authentication and access control</li>
                  <li>• Search and categorization features</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">System Operations</h3>
                <ul className="text-gray-700 text-xs md:text-sm space-y-1">
                  <li>• Performance monitoring and optimization</li>
                  <li>• Security and fraud prevention</li>
                  <li>• Technical support and troubleshooting</li>
                  <li>• System maintenance and updates</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Legal Compliance</h3>
                <ul className="text-gray-700 text-xs md:text-sm space-y-1">
                  <li>• Record keeping and audit requirements</li>
                  <li>• Regulatory compliance</li>
                  <li>• Legal proceedings if required</li>
                  <li>• Data retention policies</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Service Improvement</h3>
                <ul className="text-gray-700 text-xs md:text-sm space-y-1">
                  <li>• Feature development and enhancement</li>
                  <li>• User experience improvements</li>
                  <li>• Bug fixes and performance optimization</li>
                  <li>• Analytics and usage insights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              Data Security & Protection
            </h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Security Measures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-gray-700">
                <div>
                  <h4 className="font-medium mb-1 md:mb-2 text-xs md:text-sm">Encryption</h4>
                  <ul className="text-xs md:text-sm space-y-1">
                    <li>• AES-256 encryption for data at rest</li>
                    <li>• TLS 1.3 for data in transit</li>
                    <li>• Encrypted database storage</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1 md:mb-2 text-xs md:text-sm">Access Controls</h4>
                  <ul className="text-xs md:text-sm space-y-1">
                    <li>• Multi-factor authentication</li>
                    <li>• Role-based permissions</li>
                    <li>• Regular access reviews</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1 md:mb-2 text-xs md:text-sm">Infrastructure</h4>
                  <ul className="text-xs md:text-sm space-y-1">
                    <li>• Secure cloud hosting</li>
                    <li>• Regular security audits</li>
                    <li>• 24/7 monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1 md:mb-2 text-xs md:text-sm">Data Backup</h4>
                  <ul className="text-xs md:text-sm space-y-1">
                    <li>• Automated daily backups</li>
                    <li>• Geographic redundancy</li>
                    <li>• Disaster recovery plans</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              Data Sharing & Disclosure
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Internal Sharing</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  Your documents are only accessible to authorized users within your organization 
                  based on role-based permissions and department access controls.
                </p>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Third-Party Services</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  We may use trusted third-party services for OCR processing and cloud storage. 
                  These providers are bound by strict confidentiality agreements and security requirements.
                </p>
              </div>
              <div className="bg-gray-200 border border-gray-400 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Legal Requirements</h3>
                <p className="text-gray-800 text-xs md:text-sm">
                  We may disclose information when required by law, court order, or regulatory 
                  requirements. We will notify you unless legally prohibited from doing so.
                </p>
              </div>
              <div className="bg-white border border-gray-400 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">No Commercial Use</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  We do not sell, rent, or use your documents for commercial purposes or marketing. 
                  Your data is used solely for providing and improving our services.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              Your Privacy Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="border border-gray-300 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Access & Review</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  You can access and review all your stored documents and personal information 
                  through your account dashboard.
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Correction</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  You can update or correct your personal information and document metadata 
                  at any time through the system interface.
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Deletion</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  You can request deletion of your documents or account. Some data may be 
                  retained for legal compliance purposes.
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Portability</h3>
                <p className="text-gray-700 text-xs md:text-sm">
                  You can export your documents in standard formats (PDF, text) for use 
                  with other systems or services.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">Data Retention</h2>
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-300">
              <p className="text-gray-700 mb-3 md:mb-4 text-xs md:text-base">
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="text-gray-700 space-y-1 md:space-y-2 text-xs md:text-base">
                <li>• <strong>Active Documents:</strong> Retained while your account is active</li>
                <li>• <strong>Account Data:</strong> Retained for 7 years after account closure for compliance</li>
                <li>• <strong>Usage Logs:</strong> Retained for 2 years for security and performance analysis</li>
                <li>• <strong>Backup Data:</strong> Automatically purged after 90 days</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">Contact Us</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 md:p-6">
              <p className="text-gray-800 mb-3 md:mb-4 text-xs md:text-base">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-gray-700 space-y-1 md:space-y-2 text-xs md:text-base">
                <p><strong>Email:</strong> projectfyp@gmail.com</p>
                <p><strong>Privacy Officer:</strong> Available Monday-Friday, 9 AM - 5 PM</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;