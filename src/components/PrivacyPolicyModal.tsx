'use client';

import { useState, useEffect } from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className={`fixed inset-0 transition-opacity duration-150 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div 
          className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all duration-150 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ${
            isVisible ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          }`}
        >
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Privacy Policy & Data Protection
              </h3>
              <div className="mt-2">
                <div className="text-sm text-gray-500 max-h-96 overflow-y-auto space-y-3">
                  <p className="font-semibold text-gray-700">
                    TripEase Expense Management System - Privacy Notice
                  </p>
                  
                  <p>
                    <strong>Data Collection:</strong> We collect personal and financial information including employee details, 
                    expense amounts, business purposes, and payment card information to process your expense reimbursements 
                    efficiently and securely.
                  </p>
                  
                  <p>
                    <strong>Processing Purpose:</strong> Your information is used exclusively for expense report processing, 
                    verification, reimbursement, and compliance with corporate financial policies. We may also use anonymized 
                    data for system improvement and fraud prevention.
                  </p>
                  
                  <p>
                    <strong>Data Security:</strong> All sensitive information is encrypted using industry-standard AES-256 
                    encryption both in transit and at rest. Credit card information is processed through PCI DSS compliant 
                    systems and is never stored in plaintext format.
                  </p>
                  
                  <p>
                    <strong>Third-Party Sharing:</strong> We do not sell or share your personal information with third parties 
                    except as required for payment processing (secure banking partners) or legal compliance. All partners 
                    maintain equivalent security standards.
                  </p>
                  
                  <p>
                    <strong>Data Retention:</strong> Financial records are retained for 7 years as required by tax regulations. 
                    Personal information is deleted within 30 days after the retention period unless legally required otherwise.
                  </p>
                  
                  <p>
                    <strong>Your Rights:</strong> You have the right to access, correct, or delete your personal information. 
                    Contact privacy@tripease.com for data requests or concerns.
                  </p>
                  
                  <p className="text-xs text-gray-400 mt-4">
                    Last updated: January 2025 | Version 2.1
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={handleClose}
            >
              I Accept & Continue
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}