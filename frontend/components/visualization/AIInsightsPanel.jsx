import React, { useState, useEffect } from 'react';
import { calculateAIPotential, analyzeWorkflowForAIPotential } from '../lib/ai-engine';

const AIInsightsPanel = ({ projectData }) => {
  const { workflows, tasks } = projectData;
  const [workflowInsights, setWorkflowInsights] = useState([]);
  const [highPotentialTasks, setHighPotentialTasks] = useState([]);
  const [quickWins, setQuickWins] = useState([]);
  
  useEffect(() => {
    if (workflows && tasks) {
      // Generate workflow insights
      const insights = workflows.map(workflow => 
        analyzeWorkflowForAIPotential(workflow, tasks)
      ).sort((a, b) => b.averagePotential - a.averagePotential);
      
      setWorkflowInsights(insights);
      
      // Find high potential tasks
      const highPotential = tasks
        .filter(task => calculateAIPotential(task) >= 7)
        .sort((a, b) => calculateAIPotential(b) - calculateAIPotential(a));
      
      setHighPotentialTasks(highPotential);
      
      // Find quick wins
      const wins = tasks
        .filter(task => calculateAIPotential(task) >= 7 && task.complexity <= 3)
        .sort((a, b) => calculateAIPotential(b) - calculateAIPotential(a));
      
      setQuickWins(wins);
    }
  }, [workflows, tasks]);
  
  // Get workflow name by task ID
  const getWorkflowName = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown Workflow';
    
    const workflow = workflows.find(w => w.id === task.workflowId);
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">AI Implementation Insights</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Key insights and recommendations for your AI implementation journey
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Based on your assessment, we've identified {highPotentialTasks.length} high-potential tasks across {workflowInsights.length} workflows. 
                    {quickWins.length > 0 && ` There are ${quickWins.length} quick wins that can provide immediate value.`}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Workflow Insights */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Workflow Insights</h4>
              
              {workflowInsights.length > 0 ? (
                <div className="space-y-4">
                  {workflowInsights.slice(0, 3).map((insight) => (
                    <div key={insight.workflowId} className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-md font-medium text-gray-900">{insight.workflowName}</h5>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAIPotentialClass(insight.averagePotential)}`}>
                              AI Potential: {insight.averagePotential}/10
                            </span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Automation: {insight.automationPotential}%
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {insight.highPotentialTaskCount} / {insight.totalTaskCount} high-potential tasks
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">{insight.recommendation}</p>
                        <p className="mt-1 text-sm text-gray-600">Suggested approach: <span className="font-medium">{insight.approach}</span></p>
                      </div>
                      
                      {insight.quickWinCount > 0 && (
                        <div className="mt-3">
                          <h6 className="text-xs font-medium text-gray-700">Quick Wins:</h6>
                          <ul className="mt-1 text-xs text-gray-600">
                            {tasks
                              .filter(task => insight.quickWins.includes(task.id))
                              .slice(0, 2)
                              .map(task => (
                                <li key={task.id} className="flex items-center">
                                  <svg className="h-3 w-3 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  {task.name}
                                </li>
                              ))}
                            {insight.quickWinCount > 2 && (
                              <li className="text-xs text-gray-500">+{insight.quickWinCount - 2} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {workflowInsights.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{workflowInsights.length - 3} more workflows
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  No workflow insights available. Please complete the workflow analysis step.
                </div>
              )}
            </div>
            
            {/* High Potential Tasks */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">High-Potential Tasks</h4>
              
              {highPotentialTasks.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Task</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Workflow</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">AI Potential</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Complexity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {highPotentialTasks.slice(0, 5).map((task) => (
                        <tr key={task.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{task.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getWorkflowName(task.id)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAIPotentialClass(calculateAIPotential(task))}`}>
                              {calculateAIPotential(task)}/10
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.complexity <= 2 
                                ? 'bg-green-100 text-green-800' 
                                : task.complexity <= 4 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {task.complexity}/5
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {highPotentialTasks.length > 5 && (
                    <div className="px-4 py-2 text-sm text-gray-500 text-center border-t border-gray-200">
                      +{highPotentialTasks.length - 5} more high-potential tasks
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  No high-potential tasks identified. Consider reviewing your task assessments.
                </div>
              )}
            </div>
            
            {/* Key Recommendations */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 mb-4">Key Recommendations</h4>
              
              <ul className="space-y-3">
                {quickWins.length > 0 && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">Start with quick wins: Implement the {quickWins.length} identified tasks with high AI potential and low complexity to demonstrate value quickly.</p>
                    </div>
                  </li>
                )}
                
                {workflowInsights.filter(w => w.averagePotential >= 7).length > 0 && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">Prioritize high-potential workflows: Focus on the {workflowInsights.filter(w => w.averagePotential >= 7).length} workflows with the highest AI potential scores.</p>
                    </div>
                  </li>
                )}
                
                {workflowInsights.filter(w => w.bottleneckCount > 0).length > 0 && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">Address bottlenecks: Consider process redesign for frequent tasks with low AI potential to improve overall workflow efficiency.</p>
                    </div>
                  </li>
                )}
                
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Follow the implementation plan: Use the phased approach to systematically implement AI solutions, starting with the highest-value opportunities.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Select appropriate AI tools: Choose tools that match your specific task requirements, implementation complexity preferences, and budget constraints.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
