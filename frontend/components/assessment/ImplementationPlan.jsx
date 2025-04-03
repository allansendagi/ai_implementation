import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ImplementationPlan = ({ initialData, workflows, tasks, onSave, onNext }) => {
  const [plan, setPlan] = useState(initialData?.implementationPlan || {
    phases: [],
    timeline: 'medium',
    resources: 'medium',
    budget: 'medium'
  });
  const [currentPhase, setCurrentPhase] = useState({
    id: '',
    name: '',
    description: '',
    duration: 4,
    tasks: [],
    status: 'planned'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Get high-potential tasks
  const getHighPotentialTasks = () => {
    return tasks.filter(task => task.aiPotential >= 7);
  };
  
  // Get medium-potential tasks
  const getMediumPotentialTasks = () => {
    return tasks.filter(task => task.aiPotential >= 4 && task.aiPotential < 7);
  };
  
  // Get low-potential tasks
  const getLowPotentialTasks = () => {
    return tasks.filter(task => task.aiPotential < 4);
  };
  
  // Get task name by ID
  const getTaskName = (id) => {
    const task = tasks.find(t => t.id === id);
    return task ? task.name : 'Unknown Task';
  };
  
  // Get workflow name by task ID
  const getWorkflowByTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown Workflow';
    
    const workflow = workflows.find(w => w.id === task.workflowId);
    return workflow ? workflow.name : 'Unknown Workflow';
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPhase(prev => ({
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
  
  // Handle duration change
  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCurrentPhase(prev => ({
      ...prev,
      duration: value
    }));
  };
  
  // Handle task selection
  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };
  
  // Handle plan parameter change
  const handlePlanParamChange = (param, value) => {
    setPlan(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Validate phase
  const validatePhase = () => {
    const newErrors = {};
    
    if (!currentPhase.name.trim()) {
      newErrors.name = 'Phase name is required';
    }
    
    if (!currentPhase.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (selectedTasks.length === 0) {
      newErrors.tasks = 'Please select at least one task for this phase';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle add phase
  const handleAddPhase = () => {
    if (!validatePhase()) {
      return;
    }
    
    const newPhase = {
      ...currentPhase,
      id: Date.now().toString(),
      tasks: [...selectedTasks]
    };
    
    setPlan(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }));
    
    setCurrentPhase({
      id: '',
      name: '',
      description: '',
      duration: 4,
      tasks: [],
      status: 'planned'
    });
    
    setSelectedTasks([]);
  };
  
  // Handle edit phase
  const handleEditPhase = (index) => {
    const phase = plan.phases[index];
    setCurrentPhase(phase);
    setSelectedTasks(phase.tasks);
    setIsEditing(true);
    setEditIndex(index);
  };
  
  // Handle update phase
  const handleUpdatePhase = () => {
    if (!validatePhase()) {
      return;
    }
    
    const updatedPhase = {
      ...currentPhase,
      tasks: [...selectedTasks]
    };
    
    setPlan(prev => {
      const updatedPhases = [...prev.phases];
      updatedPhases[editIndex] = updatedPhase;
      return {
        ...prev,
        phases: updatedPhases
      };
    });
    
    setCurrentPhase({
      id: '',
      name: '',
      description: '',
      duration: 4,
      tasks: [],
      status: 'planned'
    });
    
    setSelectedTasks([]);
    setIsEditing(false);
    setEditIndex(-1);
  };
  
  // Handle delete phase
  const handleDeletePhase = (index) => {
    setPlan(prev => {
      const updatedPhases = [...prev.phases];
      updatedPhases.splice(index, 1);
      return {
        ...prev,
        phases: updatedPhases
      };
    });
  };
  
  // Handle cancel
  const handleCancel = () => {
    setCurrentPhase({
      id: '',
      name: '',
      description: '',
      duration: 4,
      tasks: [],
      status: 'planned'
    });
    
    setSelectedTasks([]);
    setIsEditing(false);
    setEditIndex(-1);
    setErrors({});
  };
  
  // Calculate total duration
  const calculateTotalDuration = () => {
    return plan.phases.reduce((total, phase) => total + phase.duration, 0);
  };
  
  // Validate plan
  const validatePlan = () => {
    const newErrors = {};
    
    if (plan.phases.length === 0) {
      newErrors.phases = 'Please add at least one implementation phase';
      setErrors(newErrors);
      return false;
    }
    
    // Check if all high-potential tasks are included
    const highPotentialTasks = getHighPotentialTasks();
    const allTasksInPlan = plan.phases.flatMap(phase => phase.tasks);
    
    const missingHighPotentialTasks = highPotentialTasks.filter(
      task => !allTasksInPlan.includes(task.id)
    );
    
    if (missingHighPotentialTasks.length > 0) {
      newErrors.highPotential = `${missingHighPotentialTasks.length} high-potential tasks are not included in any phase`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePlan()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave({ implementationPlan: plan });
      onNext();
    } catch (error) {
      console.error('Error saving implementation plan:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get AI potential class based on score
  const getAIPotentialClass = (score) => {
    if (score >= 7) return 'bg-green-100 text-green-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Implementation Plan</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Create a phased implementation plan for your AI journey
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
                    Create a phased implementation plan by organizing tasks into logical phases. Start with high-potential tasks for quick wins, then progress to more complex implementations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Timeline
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('timeline', 'short')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.timeline === 'short'
                        ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Short
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('timeline', 'medium')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.timeline === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('timeline', 'long')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.timeline === 'long'
                        ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Long
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {plan.timeline === 'short' ? '3-6 months' : plan.timeline === 'medium' ? '6-12 months' : '12+ months'}
                </p>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Resources
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('resources', 'low')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.resources === 'low'
                        ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Minimal
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('resources', 'medium')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.resources === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Moderate
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('resources', 'high')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.resources === 'high'
                        ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Extensive
                  </button>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Budget
                </label>
                <div className="mt-1 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('budget', 'low')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.budget === 'low'
                        ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Conservative
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('budget', 'medium')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.budget === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlanParamChange('budget', 'high')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      plan.budget === 'high'
                        ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Aggressive
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">Implementation Phases</h4>
                <span className="text-sm text-gray-500">Total Duration: {calculateTotalDuration()} weeks</span>
              </div>
              
              {plan.phases.length > 0 ? (
                <div className="space-y-4">
                  {plan.phases.map((phase, index) => (
                    <div key={phase.id} className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-md font-medium text-gray-900">{phase.name}</h5>
                          <p className="mt-1 text-sm text-gray-500">{phase.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {phase.duration} weeks
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEditPhase(index)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePhase(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h6 className="text-sm font-medium text-gray-700">Tasks:</h6>
                        <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {phase.tasks.map(taskId => (
                            <li key={taskId} className="flex items-center text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-700">{getTaskName(taskId)}</span>
                              <span className="ml-1 text-xs text-gray-500">({getWorkflowByTask(taskId)})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  No implementation phases added yet. Use the form below to add your first phase.
                </div>
              )}
              
              {errors.phases && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.phases}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {errors.highPotential && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">{errors.highPotential}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {isEditing ? 'Edit Phase' : 'Add New Phase'}
              </h4>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Phase Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={currentPhase.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="e.g., Quick Wins, Core Implementation, Advanced Features"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (weeks)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      min="1"
                      max="52"
                      value={currentPhase.duration}
                      onChange={handleDurationChange}
                      className="form-input"
                    />
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
                      rows={2}
                      value={currentPhase.description}
                      onChange={handleInputChange}
                      className={`form-input ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Describe the goals and focus of this implementation phase"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tasks for this Phase
                  </label>
                  {errors.tasks && (
                    <p className="mb-2 text-sm text-red-600">{errors.tasks}</p>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-green-700 flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        High AI Potential Tasks
                      </h5>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {getHighPotentialTasks().length > 0 ? (
                          getHighPotentialTasks().map(task => (
                            <div key={task.id} className="flex items-center">
                              <input
                                id={`task-${task.id}`}
                                name={`task-${task.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={selectedTasks.includes(task.id)}
                                onChange={() => handleTaskSelection(task.id)}
                              />
                              <label htmlFor={`task-${task.id}`} className="ml-2 text-sm text-gray-700">
                                {task.name}
                                <span className="ml-1 text-xs text-gray-500">({getWorkflowByTask(task.id)})</span>
                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAIPotentialClass(task.aiPotential)}`}>
                                  {task.aiPotential}/10
                                </span>
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No high-potential tasks available</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-yellow-700 flex items-center">
                        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        Medium AI Potential Tasks
                      </h5>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {getMediumPotentialTasks().length > 0 ? (
                          getMediumPotentialTasks().map(task => (
                            <div key={task.id} className="flex items-center">
                              <input
                                id={`task-${task.id}`}
                                name={`task-${task.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={selectedTasks.includes(task.id)}
                                onChange={() => handleTaskSelection(task.id)}
                              />
                              <label htmlFor={`task-${task.id}`} className="ml-2 text-sm text-gray-700">
                                {task.name}
                                <span className="ml-1 text-xs text-gray-500">({getWorkflowByTask(task.id)})</span>
                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAIPotentialClass(task.aiPotential)}`}>
                                  {task.aiPotential}/10
                                </span>
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No medium-potential tasks available</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-red-700 flex items-center">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        Low AI Potential Tasks
                      </h5>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {getLowPotentialTasks().length > 0 ? (
                          getLowPotentialTasks().map(task => (
                            <div key={task.id} className="flex items-center">
                              <input
                                id={`task-${task.id}`}
                                name={`task-${task.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                checked={selectedTasks.includes(task.id)}
                                onChange={() => handleTaskSelection(task.id)}
                              />
                              <label htmlFor={`task-${task.id}`} className="ml-2 text-sm text-gray-700">
                                {task.name}
                                <span className="ml-1 text-xs text-gray-500">({getWorkflowByTask(task.id)})</span>
                                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAIPotentialClass(task.aiPotential)}`}>
                                  {task.aiPotential}/10
                                </span>
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No low-potential tasks available</p>
                        )}
                      </div>
                    </div>
                  </div>
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
                  onClick={isEditing ? handleUpdatePhase : handleAddPhase}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isEditing ? 'Update Phase' : 'Add Phase'}
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

export default ImplementationPlan;
