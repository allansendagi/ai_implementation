import React from 'react';
import { useRouter } from 'next/router';

export default function AffiliateTools() {
  const router = useRouter();
  const { category } = router.query;
  
  // Mock affiliate tool data - in a real app, this would come from an API
  const affiliateTools = {
    'ai-assistants': [
      {
        id: 'assistant-1',
        name: 'AI Assistant Pro',
        description: 'Enterprise-grade AI assistant for business automation',
        commission: '30%',
        logo: '/ai-assistant-pro.png',
        category: 'AI Assistants',
        features: [
          'Natural language processing',
          'Task automation',
          'Integration with business tools',
          'Custom training capabilities'
        ],
        pricing: 'From $49/month',
        affiliateLink: 'https://ai-assistant-pro.example.com/ref=aijourney'
      },
      {
        id: 'assistant-2',
        name: 'VoiceGenius AI',
        description: 'Voice-enabled AI assistant for hands-free operation',
        commission: '25%',
        logo: '/voice-genius.png',
        category: 'AI Assistants',
        features: [
          'Advanced speech recognition',
          'Multi-language support',
          'Voice command customization',
          'Noise cancellation technology'
        ],
        pricing: 'From $39/month',
        affiliateLink: 'https://voicegenius.example.com/ref=aijourney'
      }
    ],
    'data-analysis': [
      {
        id: 'data-1',
        name: 'DataSense AI',
        description: 'Advanced data analysis and visualization platform',
        commission: '25%',
        logo: '/datasense.png',
        category: 'Data Analysis',
        features: [
          'Automated data cleaning',
          'Predictive analytics',
          'Interactive dashboards',
          'Custom report generation'
        ],
        pricing: 'From $99/month',
        affiliateLink: 'https://datasense.example.com/ref=aijourney'
      },
      {
        id: 'data-2',
        name: 'InsightMiner',
        description: 'AI-powered business intelligence platform',
        commission: '20%',
        logo: '/insightminer.png',
        category: 'Data Analysis',
        features: [
          'Trend identification',
          'Anomaly detection',
          'Automated insights',
          'Data integration hub'
        ],
        pricing: 'From $79/month',
        affiliateLink: 'https://insightminer.example.com/ref=aijourney'
      }
    ],
    'workflow-automation': [
      {
        id: 'workflow-1',
        name: 'WorkflowAI',
        description: 'Intelligent workflow automation solution',
        commission: '20%',
        logo: '/workflowai.png',
        category: 'Workflow Automation',
        features: [
          'Visual workflow builder',
          'AI-powered optimization',
          'Process analytics',
          'Integration with 100+ apps'
        ],
        pricing: 'From $59/month',
        affiliateLink: 'https://workflowai.example.com/ref=aijourney'
      },
      {
        id: 'workflow-2',
        name: 'AutomateNow',
        description: 'No-code automation platform with AI capabilities',
        commission: '22%',
        logo: '/automatenow.png',
        category: 'Workflow Automation',
        features: [
          'Drag-and-drop interface',
          'Smart workflow suggestions',
          'Error detection and handling',
          'Performance monitoring'
        ],
        pricing: 'From $69/month',
        affiliateLink: 'https://automatenow.example.com/ref=aijourney'
      }
    ],
    'content-generation': [
      {
        id: 'content-1',
        name: 'ContentForge AI',
        description: 'AI-powered content creation and optimization platform',
        commission: '28%',
        logo: '/contentforge.png',
        category: 'Content Generation',
        features: [
          'Multi-format content creation',
          'SEO optimization',
          'Brand voice customization',
          'Content performance analytics'
        ],
        pricing: 'From $49/month',
        affiliateLink: 'https://contentforge.example.com/ref=aijourney'
      },
      {
        id: 'content-2',
        name: 'CreativeAI',
        description: 'AI creative assistant for marketing and design teams',
        commission: '24%',
        logo: '/creativeai.png',
        category: 'Content Generation',
        features: [
          'Image generation',
          'Copywriting assistance',
          'Design suggestions',
          'Brand consistency tools'
        ],
        pricing: 'From $59/month',
        affiliateLink: 'https://creativeai.example.com/ref=aijourney'
      }
    ]
  };
  
  // Get tools for the selected category or all tools if no category is selected
  const tools = category ? affiliateTools[category] || [] : Object.values(affiliateTools).flat();
  
  // Get category name for display
  const getCategoryName = () => {
    if (!category) return 'All AI Tools';
    
    const categoryMap = {
      'ai-assistants': 'AI Assistants',
      'data-analysis': 'Data Analysis Tools',
      'workflow-automation': 'Workflow Automation Solutions',
      'content-generation': 'Content Generation Tools'
    };
    
    return categoryMap[category] || 'AI Tools';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{getCategoryName()}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Earn commissions by recommending these AI tools to your clients
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => router.push('/affiliate-tools')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${!category ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                All Categories
              </button>
              <button
                onClick={() => router.push('/affiliate-tools?category=ai-assistants')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${category === 'ai-assistants' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                AI Assistants
              </button>
              <button
                onClick={() => router.push('/affiliate-tools?category=data-analysis')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${category === 'data-analysis' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Data Analysis
              </button>
              <button
                onClick={() => router.push('/affiliate-tools?category=workflow-automation')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${category === 'workflow-automation' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Workflow Automation
              </button>
              <button
                onClick={() => router.push('/affiliate-tools?category=content-generation')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${category === 'content-generation' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Content Generation
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {tools.length > 0 ? (
              tools.map((tool) => (
                <div key={tool.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-500">{tool.logo ? 'Logo' : tool.name.substring(0, 2)}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{tool.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{tool.description}</p>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {tool.commission} Commission
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">{tool.pricing}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-2">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div>
                      <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                        View details
                      </a>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={() => {
                          navigator.clipboard.writeText(tool.affiliateLink);
                          alert('Affiliate link copied to clipboard!');
                        }}
                      >
                        Copy Affiliate Link
                      </button>
                      <a
                        href={tool.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Promote Tool
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white shadow overflow-hidden sm:rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tools found</h3>
                <p className="mt-1 text-sm text-gray-500">No tools available for this category.</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                How to Promote AI Tools
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Follow these best practices to maximize your affiliate earnings:</p>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">1. Understand your client's needs</div>
                      <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                        <div>
                          Recommend tools that genuinely solve your client's problems. This builds trust and increases conversion rates.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">2. Highlight specific benefits</div>
                      <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                        <div>
                          Focus on how the tool addresses specific pain points rather than generic features.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 sm:mt-0 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">3. Provide implementation guidance</div>
                      <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                        <div>
                          Offer support on how to integrate the tool into their existing workflows for maximum value.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
