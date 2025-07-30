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
            className="absolute top-3 left-3 md:top-6 md:left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-lg font-bold p-2 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-16 md:pt-6 pb-4 md:pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-gray-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Privacy Policy</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">How we protect and handle your information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">

          {/* Last Updated */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-5 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2 text-gray-800 text-sm md:text-base">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Last Updated: January 15, 2025</span>
            </div>
            <p className="text-gray-700 mt-3 text-sm md:text-base leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes.
            </p>
          </div>

          {/* Overview */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Overview</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              This Privacy Policy describes how our Document Management System collects, uses, and protects 
              your personal information when you use our document scanning, uploading, and management services. 
              We are committed to protecting your privacy and ensuring the security of your documents and data.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Information We Collect</span>
            </h2>
            <div className="space-y-5 md:space-y-6">
              <div className="border-l-4 border-gray-500 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Document Content</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Scanned documents and uploaded files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Extracted text content from OCR processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Document metadata (file names, subjects, dates)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Enhanced and processed document versions</span>
                  </li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-400 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Account Information</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Name and email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Department and role within organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>User preferences and settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Authentication credentials (encrypted)</span>
                  </li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-600 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Usage Data</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Login times and session information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Features used and documents accessed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>System interactions and navigation patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Error logs and performance metrics</span>
                  </li>
                </ul>
              </div>
              <div className="border-l-4 border-gray-500 pl-4 md:pl-6 py-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">Technical Information</h3>
                <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>IP addresses and device information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Browser type and operating system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Network connection details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Cookies and similar technologies</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>How We Use Your Information</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Core Services</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Document processing and OCR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>File storage and retrieval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>User authentication and access control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Search and categorization features</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">System Operations</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Performance monitoring and optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Security and fraud prevention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Technical support and troubleshooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>System maintenance and updates</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Legal Compliance</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Record keeping and audit requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Regulatory compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Legal proceedings if required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Data retention policies</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-base md:text-lg">Service Improvement</h3>
                <ul className="text-gray-700 text-sm md:text-base space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Feature development and enhancement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>User experience improvements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Bug fixes and performance optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span>Analytics and usage insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Data Security & Protection</span>
            </h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-base md:text-lg">Security Measures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-700">
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Encryption</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>AES-256 encryption for data at rest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>TLS 1.3 for data in transit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Encrypted database storage</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Access Controls</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Multi-factor authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Role-based permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Regular access reviews</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Infrastructure</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Secure cloud hosting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Regular security audits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>24/7 monitoring</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm md:text-base">Data Backup</h4>
                  <ul className="text-sm md:text-base space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Automated daily backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Geographic redundancy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>Disaster recovery plans</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Data Sharing & Disclosure</span>
            </h2>
            <div className="space-y-4 md:space-y-5">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Internal Sharing</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Your documents are only accessible to authorized users within your organization 
                  based on role-based permissions and department access controls.
                </p>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Third-Party Services</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  We may use trusted third-party services for OCR processing and cloud storage. 
                  These providers are bound by strict confidentiality agreements and security requirements.
                </p>
              </div>
              <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">Legal Requirements</h3>
                <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                  We may disclose information when required by law, court order, or regulatory 
                  requirements. We will notify you unless legally prohibited from doing so.
                </p>
              </div>
              <div className="bg-white border border-gray-400 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">No Commercial Use</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  We do not sell, rent, or use your documents for commercial purposes or marketing. 
                  Your data is used solely for providing and improving our services.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Your Privacy Rights</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Access & Review</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  You can access and review all your stored documents and personal information 
                  through your account dashboard.
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Correction</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  You can update or correct your personal information and document metadata 
                  at any time through the system interface.
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Deletion</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  You can request deletion of your documents or account. Some data may be 
                  retained for legal compliance purposes.
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 md:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">Portability</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  You can export your documents in standard formats (PDF, text) for use 
                  with other systems or services.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">Data Retention</h2>
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-300">
              <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="text-gray-700 space-y-2 md:space-y-3 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span><strong>Active Documents:</strong> Retained while your account is active</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span><strong>Account Data:</strong> Retained for 7 years after account closure for compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span><strong>Usage Logs:</strong> Retained for 2 years for security and performance analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  <span><strong>Backup Data:</strong> Automatically purged after 90 days</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">Contact Us</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 md:p-6">
              <p className="text-gray-800 mb-4 text-sm md:text-base leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-gray-700 space-y-2 md:space-y-3 text-sm md:text-base">
                <p className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <strong className="min-w-[60px]">Email:</strong>
                  <span className="break-all">projectfyp@gmail.com</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <strong className="min-w-[120px]">Privacy Officer:</strong>
                  <span>Available Monday-Friday, 9 AM - 5 PM</span>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;