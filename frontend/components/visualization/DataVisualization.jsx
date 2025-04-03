import React, { useState, useEffect } from 'react';
import { Bar, Pie, Radar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { generateVisualizationData } from '../lib/ai-engine';

// Register ChartJS components
ChartJS.register(...registerables);

const DataVisualization = ({ projectData }) => {
  const { workflows, tasks, implementationPlan } = projectData;
  const [activeTab, setActiveTab] = useState('workflow');
  
  // Generate chart data
  const workflowPotentialData = generateVisualizationData.workflowPotentialChart(workflows, tasks);
  const taskDistributionData = generateVisualizationData.taskDistributionChart(tasks);
  const implementationTimelineData = generateVisualizationData.implementationTimelineChart(implementationPlan);
  
  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'AI Potential by Workflow'
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Distribution by AI Potential'
      }
    }
  };
  
  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Duration (weeks)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Implementation Timeline'
      }
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Data Visualization</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Visual insights from your AI implementation assessment
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="workflow">Workflow Potential</option>
                <option value="tasks">Task Distribution</option>
                <option value="timeline">Implementation Timeline</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('workflow')}
                    className={`${
                      activeTab === 'workflow'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Workflow Potential
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`${
                      activeTab === 'tasks'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Task Distribution
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`${
                      activeTab === 'timeline'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Implementation Timeline
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {activeTab === 'workflow' && workflowPotentialData && (
              <div className="h-80">
                <Bar data={workflowPotentialData} options={barOptions} />
              </div>
            )}
            
            {activeTab === 'tasks' && taskDistributionData && (
              <div className="h-80">
                <Pie data={taskDistributionData} options={pieOptions} />
              </div>
            )}
            
            {activeTab === 'timeline' && implementationTimelineData && (
              <div className="h-80">
                <Bar data={implementationTimelineData} options={timelineOptions} />
              </div>
            )}
            
            {!workflowPotentialData && activeTab === 'workflow' && (
              <div className="text-center py-10 text-gray-500">
                No workflow data available for visualization. Please complete the workflow analysis step.
              </div>
            )}
            
            {!taskDistributionData && activeTab === 'tasks' && (
              <div className="text-center py-10 text-gray-500">
                No task data available for visualization. Please complete the task deconstruction step.
              </div>
            )}
            
            {!implementationTimelineData && activeTab === 'timeline' && (
              <div className="text-center py-10 text-gray-500">
                No implementation plan data available for visualization. Please complete the implementation plan step.
              </div>
            )}
          </div>
          
          {activeTab === 'workflow' && workflowPotentialData && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 mb-2">Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Workflows with higher AI potential scores are better candidates for AI implementation.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Automation potential indicates the percentage of tasks within a workflow that can be automated with AI.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Focus on workflows with both high AI potential and high automation potential for maximum impact.</span>
                </li>
              </ul>
            </div>
          )}
          
          {activeTab === 'tasks' && taskDistributionData && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 mb-2">Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>High potential tasks (7-10) should be prioritized in your implementation plan.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Medium potential tasks (4-6.5) may require more customization or human oversight.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Low potential tasks (0-3.5) may not be suitable for AI implementation or may require process redesign.</span>
                </li>
              </ul>
            </div>
          )}
          
          {activeTab === 'timeline' && implementationTimelineData && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 mb-2">Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>The implementation timeline shows the duration of each phase in your AI implementation plan.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Early phases typically focus on quick wins and high-potential tasks with lower complexity.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Later phases address more complex tasks and may require more resources and expertise.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
