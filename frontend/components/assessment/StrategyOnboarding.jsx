import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StrategyOnboarding = ({ initialData, onSave, onNext }) => {
  const [formData, setFormData] = useState({
    scope: initialData?.scope || 'medium',
    dataReadiness: initialData?.dataReadiness || 'medium',
    timeline: initialData?.timeline || 'medium',
    budget: initialData?.budget || 'medium',
    teamSize: initialData?.teamSize || 'medium'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    try {
      await onSave({ strategyPreferences: formData });
      onNext();
    } catch (error) {
      console.error('Error saving strategy preferences:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  const preferences = [
    {
      name: 'scope',
      label: 'Implementation Scope',
      description: 'How comprehensive should your AI implementation be?',
      min: 'Minimal',
      max: 'Comprehensive',
      minDescription: 'Focus on a few high-impact areas',
      maxDescription: 'Transform across the organization'
    },
    {
      name: 'dataReadiness',
      label: 'Data Readiness',
      description: 'How prepared is your data for AI implementation?',
      min: 'Basic',
      max: 'Advanced',
      minDescription: 'Limited structured data available',
      maxDescription: 'Comprehensive data infrastructure'
    },
    {
      name: 'timeline',
      label: 'Implementation Timeline',
      description: 'What is your preferred implementation timeframe?',
      min: 'Short-term',
      max: 'Long-term',
      minDescription: 'Quick wins within 3-6 months',
      maxDescription: 'Strategic transformation over 1-2 years'
    },
    {
      name: 'budget',
      label: 'Budget Allocation',
      description: 'What level of investment are you planning?',
      min: 'Conservative',
      max: 'Aggressive',
      minDescription: 'Minimal initial investment',
      maxDescription: 'Significant financial commitment'
    },
    {
      name: 'teamSize',
      label: 'Implementation Team',
      description: 'How large will your AI implementation team be?',
      min: 'Small',
      max: 'Large',
      minDescription: 'Small team with external support',
      maxDescription: 'Dedicated cross-functional team'
    }
  ];
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Strategy Onboarding</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Configure your strategy preferences to customize your AI implementation journey
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            {preferences.map((pref, index) => (
              <motion.div 
                key={pref.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-baseline">
                  <label htmlFor={pref.name} className="block text-sm font-medium text-gray-700">
                    {pref.label}
                  </label>
                  <span className="text-sm text-gray-500">{formData[pref.name] === 'low' ? pref.min : formData[pref.name] === 'high' ? pref.max : 'Balanced'}</span>
                </div>
                <p className="text-sm text-gray-500">{pref.description}</p>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">{pref.min}</span>
                  <div className="flex-1 flex items-center space-x-2">
                    <button
                      type="button"
                      className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        formData[pref.name] === 'low' ? 'bg-primary-600 ring-2 ring-primary-500' : 'bg-gray-200'
                      }`}
                      onClick={() => handleChange(pref.name, 'low')}
                      aria-label={pref.min}
                    />
                    <button
                      type="button"
                      className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        formData[pref.name] === 'medium' ? 'bg-primary-600 ring-2 ring-primary-500' : 'bg-gray-200'
                      }`}
                      onClick={() => handleChange(pref.name, 'medium')}
                      aria-label="Medium"
                    />
                    <button
                      type="button"
                      className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        formData[pref.name] === 'high' ? 'bg-primary-600 ring-2 ring-primary-500' : 'bg-gray-200'
                      }`}
                      onClick={() => handleChange(pref.name, 'high')}
                      aria-label={pref.max}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{pref.max}</span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{pref.minDescription}</span>
                  <span>{pref.maxDescription}</span>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-gray-50 p-4 rounded-md"
            >
              <h4 className="text-sm font-medium text-gray-900">Strategy Summary</h4>
              <p className="mt-1 text-sm text-gray-700">
                Based on your preferences, your AI implementation strategy will be:
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-700">
                  • <span className="font-medium">Scope:</span> {formData.scope === 'low' ? 'Focused on specific high-impact areas' : formData.scope === 'high' ? 'Comprehensive across the organization' : 'Balanced approach targeting key areas'}
                </li>
                <li className="text-sm text-gray-700">
                  • <span className="font-medium">Data Approach:</span> {formData.dataReadiness === 'low' ? 'Working with existing data sources' : formData.dataReadiness === 'high' ? 'Building advanced data infrastructure' : 'Enhancing data capabilities incrementally'}
                </li>
                <li className="text-sm text-gray-700">
                  • <span className="font-medium">Timeline:</span> {formData.timeline === 'low' ? 'Prioritizing quick wins (3-6 months)' : formData.timeline === 'high' ? 'Long-term strategic transformation (1-2 years)' : 'Balanced approach with medium-term goals (6-12 months)'}
                </li>
              </ul>
            </motion.div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSaving}
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

export default StrategyOnboarding;
