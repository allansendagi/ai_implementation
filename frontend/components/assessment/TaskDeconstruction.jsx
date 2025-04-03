import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TaskDeconstruction = ({ initialData, workflows, onSave, onNext }) => {
  const [tasks, setTasks] = useState(initialData?.workflowTasks || []);
  const [currentTask, setCurrentTask] = useState({
    id: '',
    workflowId: '',
    name: '',
    description: '',
    predictability: 3,
    dataAvailability: 3,
    complexity: 3,
    frequency: 3,
    aiPotential: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  
  // Calculate AI Potential score based on task metrics
  const calculateAIPotential = (task) => {
    // Predictability and data availability increase AI potential
    // Complexity decreases AI potential
    // Frequency increases AI potential for repetitive tasks
    
    const predictabilityScore = task.predictability * 1.5; // 0-15
    const dataAvailabilityScore = task.dataAvailability * 1.5; // 0-15
    const complexityScore = (6 - task.complexity) * 1.0; // 5-0 (inverse)
    const frequencyScore = task.frequency * 1.0; // 0-10
    
    let score = predictabilityScore + dataAvailabilityScore + complexityScore + frequencyScore;
    score = Math.round(score / 4); // Normalize to 0-10 scale
    
    return Math.min(Math.max(score, 0), 10); // Ensure between 0-10
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
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
  
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    setCurrentTask(prev => {
      const updated = {
        ...prev,
        [name]: numValue
      };
      
      // Recalculate AI potential
      updated.aiPotential = calculateAIPotential(updated);
      
      return updated;
    });
  };
  
  const handleWorkflowChange = (e) => {
    const workflowId = e.target.value;
    setSelectedWorkflow(workflowId);
    setCurrentTask(prev => ({
      ...prev,
      workflowId
    }));
    
    // Clear error when user selects
    if (errors.workflowId) {
      setErrors(prev => ({
        ...prev,
        workflowId: null
      }));
    }
  };
  
  const validateTask = () => {
    const newErrors = {};
    
    if (!currentTask.workflowId) {
      newErrors.workflowId = 'Workflow is required';
    }
    
    if (!currentTask.name.trim()) {
      newErrors.name = 'Task name is required';
    }
    
    if (!currentTask.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddTask = () => {
    if (!validateTask()) {
      return;
    }
    
    const newTask = {
      ...currentTask,
      id: Date.now().toString()
    };
    
    setTasks(prev => [...prev, newTask]);
    setCurrentTask({
      id: '',
      workflowId: selectedWorkflow, // Keep the selected workflow
      name: '',
      description: '',
      predictability: 3,
      dataAvailability: 3,
      complexity: 3,
      frequency: 3,
      aiPotential: 0
    });
  };
  
  const handleEditTask = (index) => {
    setCurrentTask(tasks[index]);
    setSelectedWorkflow(tasks[index].workflowId);
    setIsEditing(true);
    setEditIndex(index);
  };
  
  const handleUpdateTask = () => {
    if (!validateTask()) {
      return;
    }
    
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = currentTask;
    
    setTasks(updatedTasks);
    setCurrentTask({
      id: '',
      workflowId: selectedWorkflow, // Keep the selected workflow
      name: '',
      description: '',
      predictability: 3,
      dataAvailability: 3,
      complexity: 3,
      frequency: 3,
      aiPotential: 0
    });
    setIsEditing(false);
    setEditIndex(-1);
  };
  
  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };
  
  const handleCancel = () => {
    setCurrentTask({
      id: '',
      workflowId: selectedWorkflow, // Keep the selected workflow
      name: '',
      description: '',
      predictability: 3,
      dataAvailability: 3,
      complexity: 3,
      frequency: 3,
      aiPotential: 0
    });
    setIsEditing(false);
    setEditIndex(-1);
    setErrors({});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (tasks.length === 0) {
      setErrors({ general: 'Please add at least one task before continuing' });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave({ workflowTasks: tasks });
      onNext();
    } catch (error) {
      console.error('Error saving tasks:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get workflow name by ID
  const getWorkflowName = (id) => {
    const workflow = workflows.find(w => w.id === id);
    return workflow ? workflow.name : 'Unknown Workflow';
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Task Deconstruction</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Break down workflows into specific tasks and assess their AI potential
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
                    Break down each workflow into specific tasks. Rate each task on predictability, data availability, complexity, and frequency to calculate its AI potential.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Your Tasks</h4>
              
              {tasks.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Task Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Workflow</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">AI Potential</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {tasks.map((task, index) => (
                        <tr key={task.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {task.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getWorkflowName(task.workflowId)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAIPotentialClass(task.aiPotential)}`}>
                              {task.aiPotential}/10
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              onClick={() => handleEditTask(index)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(index)}
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
                  No tasks added yet. Use the form below to add your first task.
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
                {isEditing ? 'Edit Task' : 'Add New Task'}
              </h4>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="workflowId" className="block text-sm font-medium text-gray-700">
                    Workflow
                  </label>
                  <div className="mt-1">
                    <select
                      id="workflowId"
                      name="workflowId"
                      value={currentTask.workflowId}
                      onChange={handleWorkflowChange}
                      className={`form-select ${errors.workflowId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">Select a workflow</option>
                      {workflows.map(workflow => (
                        <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                      ))}
                    </select>
                    {errors.workflowId && (
                      <p className="mt-2 text-sm text-red-600">{errors.workflowId}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Task Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={currentTask.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
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
                      rows={2}
                      value={currentTask.description}
                      onChange={handleInputChange}
                      className={`form-input ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Describe the task and its role in the workflow"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="predictability" className="block text-sm font-medium text-gray-700">
                      Predictability
                    </label>
                    <span className="text-sm text-gray-500">{currentTask.predictability}/5</span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="range"
                      id="predictability"
                      name="predictability"
                      min="1"
                      max="5"
                      value={currentTask.predictability}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How consistent and predictable is this task? (1 = Highly variable, 5 = Very consistent)
                  </p>
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="dataAvailability" className="block text-sm font-medium text-gray-700">
                      Data Availability
                    </label>
                    <span className="text-sm text-gray-500">{currentTask.dataAvailability}/5</span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="range"
                      id="dataAvailability"
                      name="dataAvailability"
                      min="1"
                      max="5"
                      value={currentTask.dataAvailability}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Is data readily available for this task? (1 = No data available, 5 = Comprehensive data available)
                  </p>
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="complexity" className="block text-sm font-medium text-gray-700">
                      Complexity
                    </label>
                    <span className="text-sm text-gray-500">{currentTask.complexity}/5</span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="range"
                      id="complexity"
                      name="complexity"
                      min="1"
                      max="5"
                      value={currentTask.complexity}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How complex is this task? (1 = Very simple, 5 = Extremely complex)
                  </p>
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                      Frequency
                    </label>
                    <span className="text-sm text-gray-500">{currentTask.frequency}/5</span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="range"
                      id="frequency"
                      name="frequency"
                      min="1"
                      max="5"
                      value={currentTask.frequency}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How frequently is this task performed? (1 = Rarely, 5 = Very frequently)
                  </p>
                </div>
                
                <div className="sm:col-span-6 bg-gray-100 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-900">AI Potential Score</h5>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAIPotentialClass(currentTask.aiPotential)}`}>
                      {currentTask.aiPotential}/10
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-700">
                    This score indicates how well-suited this task is for AI implementation. Tasks with higher scores should be prioritized.
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
                  onClick={isEditing ? handleUpdateTask : handleAddTask}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isEditing ? 'Update Task' : 'Add Task'}
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

export default TaskDeconstruction;
