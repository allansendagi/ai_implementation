import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StrategySelection = ({ initialData, onSave, onNext }) => {
  const [selectedStrategy, setSelectedStrategy] = useState(initialData?.strategy || null);
  const [isSaving, setIsSaving] = useState(false);
  
  const strategies = [
    {
      id: 'evolutionary',
      title: 'Evolutionary',
      description: 'Gradual integration of AI into existing processes',
      benefits: [
        'Lower initial investment',
        'Reduced disruption to existing workflows',
        'Easier adoption by team members',
        'Faster initial results'
      ],
      considerations: [
        'May limit transformational potential',
        'Could require more iterations over time',
        'May not fully address fundamental issues'
      ],
      recommendedFor: 'Organizations with existing systems that work reasonably well but could benefit from AI enhancement'
    },
    {
      id: 'revolutionary',
      title: 'Revolutionary',
      description: 'Comprehensive transformation using AI',
      benefits: [
        'Maximum transformational potential',
        'Opportunity to redesign processes from the ground up',
        'Potential for significant competitive advantage',
        'Holistic approach to AI integration'
      ],
      considerations: [
        'Higher initial investment',
        'More significant organizational change',
        'Longer time to implementation',
        'Higher risk profile'
      ],
      recommendedFor: 'Organizations building new solutions or requiring major overhauls of ineffective systems'
    }
  ];
  
  const handleSelect = (strategyId) => {
    setSelectedStrategy(strategyId);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStrategy) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave({ strategy: selectedStrategy });
      onNext();
    } catch (error) {
      console.error('Error saving strategy selection:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Strategy Selection</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Choose between two strategic approaches for your AI implementation
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {strategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative rounded-lg border ${
                    selectedStrategy === strategy.id
                      ? 'border-primary-500 ring-2 ring-primary-500'
                      : 'border-gray-300'
                  } bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 cursor-pointer`}
                  onClick={() => handleSelect(strategy.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">{strategy.title}</h4>
                    {selectedStrategy === strategy.id && (
                      <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">{strategy.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Benefits:</h5>
                      <ul className="mt-2 space-y-1">
                        {strategy.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="h-4 w-4 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Considerations:</h5>
                      <ul className="mt-2 space-y-1">
                        {strategy.considerations.map((consideration, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="h-4 w-4 text-yellow-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700">{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h5 className="text-sm font-medium text-gray-900">Recommended for:</h5>
                      <p className="mt-1 text-sm text-gray-700">{strategy.recommendedFor}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {selectedStrategy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 p-4 rounded-md"
              >
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Strategy Impact</h4>
                    <p className="mt-1 text-sm text-blue-700">
                      {selectedStrategy === 'evolutionary' 
                        ? 'The Evolutionary approach will guide you through a step-by-step enhancement of your existing systems, focusing on quick wins and gradual improvements.'
                        : 'The Revolutionary approach will help you design a comprehensive AI transformation, reimagining your processes from the ground up for maximum impact.'}
                    </p>
                    <p className="mt-2 text-sm text-blue-700">
                      This choice will influence the subsequent steps in your AI implementation journey.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={!selectedStrategy || isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StrategySelection;
