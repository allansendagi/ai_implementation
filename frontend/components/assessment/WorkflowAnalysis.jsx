import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WorkflowAnalysis = ({ initialData, strategy, onSave, onNext }) => {
  const [workflows, setWorkflows] = useState(initialData?.workflows || []);
  const [currentWorkflow, setCurrentWorkflow] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    complexity: 'medium',
    dataReadiness: 'medium'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const categories = [
    'Marketing & Sales',
    'Customer Service',
    'Operations',
    'Finance',
    'Human Resources',
    'Product Development',
    'IT & Infrastructure',
    'Research & Development',
    'Supply Chain',
    'Other'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentWorkflow(prev => ({
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
  
  const handleComplexityChange = (value) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      complexity: value
    }));
  };
  
  const handleDataReadinessChange = (value) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      dataReadiness: value
    }));
  };
  
  const validateWorkflow = () => {
    const newErrors = {};
    
    if (!currentWorkflow.name.trim()) {
      newErrors.name = 'Workflow name is required';
    }
    
    if (!currentWorkflow.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!currentWorkflow.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddWorkflow = () => {
    if (!validateWorkflow()) {
      return;
    }
    
    const newWorkflow = {
      ...currentWorkflow,
      id: Date.now().toString()
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setCurrentWorkflow({
      id: '',
      name: '',
      category: '',
      description: '',
      complexity: 'medium',
      dataReadiness: 'medium'
    });
  };
  
  const handleEditWorkflow = (index) => {
    setCurrentWorkflow(workflows[index]);
    setIsEditing(true);
    setEditIndex(index);
  };
  
  const handleUpdateWorkflow = () => {
    if (!validateWorkflow()) {
      return;
    }
    
    const updatedWorkflows = [...workflows];
    updatedWorkflows[editIndex] = currentWorkflow;
    
    setWorkflows(updatedWorkflows);
    setCurrentWorkflow({
      id: '',
      name: '',
      category: '',
      description: '',
      complexity: 'medium',
      dataReadiness: 'medium'
    });
    setIsEditing(false);
    setEditIndex(-1);
  };
  
  const handleDeleteWorkflow = (index) => {
    const updatedWorkflows = [...workflows];
    updatedWorkflows.splice(index, 1);
    setWorkflows(updatedWorkflows);
  };
  
  const handleCancel = () => {
    setCurrentWorkflow({
      id: '',
      name: '',
      category: '',
      description: '',
      complexity: 'medium',
      dataReadiness: 'medium'
    });
    setIsEditing(false);
    setEditIndex(-1);
    setErrors({});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (workflows.length === 0) {
      setErrors({ general: 'Please add at least one workflow before continuing' });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave({ workflows });
      onNext();
    } catch (error) {
      console.error('Error saving workflows:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Workflow Analysis</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {strategy === 'evolutionary' 
            ? 'Identify 1-3 high-impact workflows to start with'
            : 'Map all relevant workflows across departments'}
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    {strategy === 'evolutionary' 
                      ? 'For the Evolutionary strategy, focus on identifying a few high-impact workflows where AI can make an immediate difference.'
                      : 'For the Revolutionary strategy, map all relevant workflows across departments to create a comprehensive transformation plan.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Your Workflows</h4>
              
              {workflows.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Complexity</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data Readiness</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {workflows.map((workflow, index) => (
                        <tr key={workflow.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {workflow.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{workflow.category}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              workflow.complexity === 'low' ? 'bg-green-100 text-green-800' :
                              workflow.complexity === 'high' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {workflow.complexity === 'low' ? 'Low' :
                               workflow.complexity === 'high' ? 'High' : 'Medium'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              workflow.dataReadiness === 'low' ? 'bg-red-100 text-red-800' :
                              workflow.dataReadiness === 'high' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {workflow.dataReadiness === 'low' ? 'Low' :
                               workflow.dataReadiness === 'high' ? 'High' : 'Medium'}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              onClick={() => handleEditWorkflow(index)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteWorkflow(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  No workflows added yet. Use the form below to add your first workflow.
                </div>
              )}
              
              {errors.general && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {isEditing ? 'Edit Workflow' : 'Add New Workflow'}
              </h4>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Workflow Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={currentWorkflow.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      value={currentWorkflow.category}
                      onChange={handleInputChange}
                      className={`form-select ${errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={currentWorkflow.description}
                      onChange={handleInputChange}
                      className={`form-input ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Describe the workflow and its importance to your organization"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Complexity
                  </label>
                  <div className="mt-1 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleComplexityChange('low')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        currentWorkflow.complexity === 'low'
                          ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => handleComplexityChange('medium')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        currentWorkflow.complexity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => handleComplexityChange('high')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        currentWorkflow.complexity === 'high'
                          ? 'bg-red-100 text-red-800 ring-1 ring-red-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      High
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How complex is this workflow in terms of steps, decisions, and variables?
                  </p>
                </div>
                
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Data Readiness
                  </label>
                  <div className="mt-1 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleDataReadinessChange('low')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        currentWorkflow.dataReadiness === 'low'
                          ? 'bg-red-100 text-red-800 ring-1 ring-red-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDataReadinessChange('medium')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        currentWorkflow.dataReadiness === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDataReadinessChange('high')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                        currentWorkflow.dataReadiness === 'high'
                          ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      High
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How ready is your data for this workflow to be enhanced with AI?
                  </p>
                </div>
              </div>
              
              <div className="mt-5 flex justify-end">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={isEditing ? handleUpdateWorkflow : handleAddWorkflow}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isEditing ? 'Update Workflow' : 'Add Workflow'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
};

export default WorkflowAnalysis;
