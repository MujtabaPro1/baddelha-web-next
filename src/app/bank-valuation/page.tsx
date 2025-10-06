'use client';
import React from 'react';
import { CalendarClock, FileText, AlertCircle, ArrowRight } from 'lucide-react';

const BankValuation: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Hero Section */}
      <section className="bg-[#3d3d40] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bank Valuation Service
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 mb-8">
            Get your vehicle professionally valued for banking and insurance purposes
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-4xl mx-auto">
            <div className="inline-block bg-amber-100 p-4 rounded-full mb-6">
              <CalendarClock className="h-12 w-12 text-amber-500" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Coming Soon!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We are working hard to launch our new Bank Valuation service. Stay tuned for this exciting feature that will be available soon!
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">
                  Bank-Approved Valuation
                </h3>
                <p className="text-gray-600">
                  Get an official valuation for your car approved by local banks for financing and insurance purposes.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <AlertCircle className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">
                  Why You Need Bank Valuation?
                </h3>
                <p className="text-gray-600">
                  Required for bank loans, insurance documentation, and legal requirements when transferring vehicle ownership.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-3">
                Want to be notified when we launch?
              </h3>
              <p className="text-gray-600 mb-4">
                Contact us today and we'll add you to our waiting list.
              </p>
              <button 
                onClick={() => window.location.href = '/ContactUs'} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center mx-auto"
              >
                Contact Us 
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-400 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-8">Contact us today to learn more about our services</p>
          <button className="bg-white text-amber-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default BankValuation;
