import React from 'react';
import { useRouter } from 'next/router';

export default function AffiliateProgram() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Tools Affiliate Program</h1>
            <p className="mt-2 text-sm text-gray-500">
              Earn commissions by recommending AI tools to your clients
            </p>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Affiliate Program Overview
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Partner with leading AI tool providers and earn commissions on successful referrals.
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Competitive Commissions</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Earn up to 30% commission on each successful referral.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Trusted Partners</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Partner with vetted, high-quality AI tool providers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Easy Integration</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Seamlessly integrate affiliate links into your recommendations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Featured AI Tool Partners
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-500">AI-1</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">AI Assistant Pro</h4>
                      <p className="text-sm text-gray-500">Enterprise-grade AI assistant for business automation</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          30% Commission
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Join Program
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-500">AI-2</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">DataSense AI</h4>
                      <p className="text-sm text-gray-500">Advanced data analysis and visualization platform</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          25% Commission
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Join Program
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-500">AI-3</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">WorkflowAI</h4>
                      <p className="text-sm text-gray-500">Intelligent workflow automation solution</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          20% Commission
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Join Program
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                How It Works
              </h3>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-lg font-medium text-gray-900">
                    Simple 3-Step Process
                  </span>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                    <span className="text-xl font-bold text-primary-600">1</span>
                  </div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Join Partner Programs</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Apply to partner programs for AI tools that match your clients' needs.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                    <span className="text-xl font-bold text-primary-600">2</span>
                  </div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Recommend Tools</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Recommend AI tools to your clients using your unique affiliate links.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                    <span className="text-xl font-bold text-primary-600">3</span>
                  </div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Earn Commissions</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Earn commissions when your clients purchase through your affiliate links.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ready to become an affiliate partner?
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-gray-500">
                    Join our affiliate program today and start earning commissions on AI tool recommendations.
                  </p>
                </div>
                <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
