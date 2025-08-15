"use client";

import "../styles/globals.css";
import React from 'react';
import { Shield, Lock, Eye, Database, Users, FileText, Clock, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicy = () => {
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
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>How We Use Information</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
              We use the information we collect to:
            </p>
            <ul className="text-gray-700 space-y-2 text-sm md:text-base pl-6">
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Provide and maintain our document management services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Process and enhance documents using OCR and image processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Organize and categorize documents by department and type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Enable search and retrieval of documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Send notifications about document status and updates</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Data Security</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="text-gray-700 space-y-2 text-sm md:text-base pl-6">
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>End-to-end encryption for data transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Secure storage with access controls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Regular security audits and updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">•</span>
                <span>Limited access to authorized personnel only</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Data Retention</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              We retain your documents and data for as long as your account is active and as needed to provide our services. 
              You may request deletion of your data at any time, subject to legal and regulatory requirements.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-600 flex-shrink-0" />
              <span>Contact Information</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm md:text-base">
                <strong>Email:</strong> privacy@documentmanagement.com<br />
                <strong>Phone:</strong> +1 (555) 123-4567<br />
                <strong>Address:</strong> 123 University Ave, City, State 12345
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

