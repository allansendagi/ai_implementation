import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StartingPointAnalysis = ({ initialData, onSave, onNext }) => {
  const [selectedPoint, setSelectedPoint] = useState(initialData?.startingPoint || null);
  const [isSaving, setIsSaving] = useState(false);
  
  const startingPoints = [
    {
      id: 'manual',
      title: 'Manual',
      description: 'Current processes are primarily manual with little to no automation.',
      questions: [
        'Does the problem require complex decision-making?',
        'Is this a high-workload problem?',
        'Do you know what data is needed and is the data available?'
      ],
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      id: 'existing_software',
      title: 'Existing Software',
      description: 'You have software systems but want to enhance them with AI.',
      questions: [
        'Does the problem require complex decision-making?',
        'Is this a high-workload problem?',
        'Do you know what data is needed and is the data available?',
        'Does the existing software automation have accuracy or manageability issues?'
      ],
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    {
      id: 'new_problem',
      title: 'New Problem',
      description: 'You\'re building entirely new AI-driven solutions.',
      questions: [
        'Does the problem require complex decision-making?',
        'Is this a high-workload problem?',
        'Do you know what data is needed and is the data available?'
      ],
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
    }
  ];
  
  const handleSelect = (pointId) => {
    setSelectedPoint(pointId);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPoint) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave({ startingPoint: selectedPoint });
      onNext();
    } catch (error) {
      console.error('Error saving starting point:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Starting Point Analysis</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Determine your current starting point to tailor the AI implementation strategy
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900">Select your starting point:</h4>
              <p className="text-sm text-gray-500 mb-4">
                Choose the option that best describes your current state
              </p>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {startingPoints.map((point, index) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`relative rounded-lg border ${
                      selectedPoint === point.id
                        ? 'border-primary-500 ring-2 ring-primary-500'
                        : 'border-gray-300'
                    } bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 cursor-pointer`}
                    onClick={() => handleSelect(point.id)}
                  >
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedPoint === point.id ? 'bg-primary-500' : 'bg-gray-200'
                      }`}>
                        <svg
                          className={`h-6 w-6 ${selectedPoint === point.id ? 'text-white' : 'text-gray-500'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={point.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">{point.title}</p>
                        <p className="text-sm text-gray-500 truncate">{point.description}</p>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {selectedPoint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-4 rounded-md"
              >
                <h4 className="text-md font-medium text-gray-900 mb-2">Assessment Questions:</h4>
                <ul className="space-y-2">
                  {startingPoints.find(p => p.id === selectedPoint).questions.map((question, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{question}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-gray-500">
                  These questions help determine if this starting point is appropriate for your organization.
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={!selectedPoint || isSaving}
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

export default StartingPointAnalysis;
