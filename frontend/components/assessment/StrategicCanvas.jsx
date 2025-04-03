import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StrategicCanvas = ({ initialData, onSave, onNext }) => {
  const [formData, setFormData] = useState({
    businessGoal: initialData?.businessGoal || '',
    useCase: initialData?.useCase || '',
    expectedOutcomes: initialData?.expectedOutcomes || '',
    successCriteria: initialData?.successCriteria || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.businessGoal.trim()) {
      newErrors.businessGoal = 'Business goal is required';
    }
    
    if (!formData.useCase.trim()) {
      newErrors.useCase = 'Use case is required';
    }
    
    if (!formData.expectedOutcomes.trim()) {
      newErrors.expectedOutcomes = 'Expected outcomes are required';
    }
    
    if (!formData.successCriteria.trim()) {
      newErrors.successCriteria = 'Success criteria are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave(formData);
      onNext();
    } catch (error) {
      console.error('Error saving strategic canvas:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Strategic Canvas</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Define your business goals and success criteria for AI implementation
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="businessGoal" className="block text-sm font-medium text-gray-700">
                Business Goal
              </label>
              <div className="mt-1">
                <textarea
                  id="businessGoal"
                  name="businessGoal"
                  rows={3}
                  className={`form-input ${errors.businessGoal ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="What overarching objective do you want to achieve with AI?"
                  value={formData.businessGoal}
                  onChange={handleChange}
                />
                {errors.businessGoal && (
                  <p className="mt-2 text-sm text-red-600">{errors.businessGoal}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Example: "Increase customer retention by 15% through personalized experiences"
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label htmlFor="useCase" className="block text-sm font-medium text-gray-700">
                Use Case
              </label>
              <div className="mt-1">
                <textarea
                  id="useCase"
                  name="useCase"
                  rows={3}
                  className={`form-input ${errors.useCase ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="What specific application area are you targeting for AI?"
                  value={formData.useCase}
                  onChange={handleChange}
                />
                {errors.useCase && (
                  <p className="mt-2 text-sm text-red-600">{errors.useCase}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Example: "Customer service chatbot for handling routine inquiries"
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label htmlFor="expectedOutcomes" className="block text-sm font-medium text-gray-700">
                Expected Outcomes
              </label>
              <div className="mt-1">
                <textarea
                  id="expectedOutcomes"
                  name="expectedOutcomes"
                  rows={3}
                  className={`form-input ${errors.expectedOutcomes ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="What do you hope to accomplish with AI implementation?"
                  value={formData.expectedOutcomes}
                  onChange={handleChange}
                />
                {errors.expectedOutcomes && (
                  <p className="mt-2 text-sm text-red-600">{errors.expectedOutcomes}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Example: "Reduce customer service response time by 50% and improve customer satisfaction scores"
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label htmlFor="successCriteria" className="block text-sm font-medium text-gray-700">
                Success Criteria
              </label>
              <div className="mt-1">
                <textarea
                  id="successCriteria"
                  name="successCriteria"
                  rows={3}
                  className={`form-input ${errors.successCriteria ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="How will you measure success?"
                  value={formData.successCriteria}
                  onChange={handleChange}
                />
                {errors.successCriteria && (
                  <p className="mt-2 text-sm text-red-600">{errors.successCriteria}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Example: "Average response time under 30 seconds, CSAT score above 4.5/5, 30% reduction in support tickets"
                </p>
              </div>
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

export default StrategicCanvas;
