import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ProcessMapping = ({ initialData, workflows, tasks, onSave, onNext }) => {
  const [processMap, setProcessMap] = useState(initialData?.processMap || {
    nodes: [],
    edges: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const [errors, setErrors] = useState({});
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCreatingEdge, setIsCreatingEdge] = useState(false);
  const [edgeStart, setEdgeStart] = useState(null);
  const [currentEdge, setCurrentEdge] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  
  // Node types and their colors
  const nodeTypes = {
    start: { label: 'Start', color: 'bg-green-500' },
    end: { label: 'End', color: 'bg-red-500' },
    task: { label: 'Task', color: 'bg-blue-500' },
    decision: { label: 'Decision', color: 'bg-yellow-500' },
    subprocess: { label: 'Subprocess', color: 'bg-purple-500' }
  };
  
  // Filter tasks by selected workflow
  const getWorkflowTasks = () => {
    if (!selectedWorkflow) return [];
    return tasks.filter(task => task.workflowId === selectedWorkflow);
  };
  
  // Get workflow name by ID
  const getWorkflowName = (id) => {
    const workflow = workflows.find(w => w.id === id);
    return workflow ? workflow.name : 'Unknown Workflow';
  };
  
  // Get task name by ID
  const getTaskName = (id) => {
    const task = tasks.find(t => t.id === id);
    return task ? task.name : 'Unknown Task';
  };
  
  // Handle canvas click to add node
  const handleCanvasClick = (e) => {
    if (isCreatingEdge || isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setNodePosition({ x, y });
    setShowTaskSelector(true);
  };
  
  // Handle node selection for adding
  const handleAddNode = (type, taskId = null) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      x: nodePosition.x,
      y: nodePosition.y,
      taskId
    };
    
    setProcessMap(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    
    setShowTaskSelector(false);
  };
  
  // Handle node click
  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    
    if (isCreatingEdge) {
      // Complete edge creation
      if (edgeStart !== nodeId) {
        const newEdge = {
          id: `edge-${Date.now()}`,
          source: edgeStart,
          target: nodeId
        };
        
        setProcessMap(prev => ({
          ...prev,
          edges: [...prev.edges, newEdge]
        }));
        
        setIsCreatingEdge(false);
        setEdgeStart(null);
      }
    } else {
      // Start edge creation
      setIsCreatingEdge(true);
      setEdgeStart(nodeId);
      
      const node = processMap.nodes.find(n => n.id === nodeId);
      setCurrentEdge({
        x1: node.x,
        y1: node.y,
        x2: node.x,
        y2: node.y
      });
    }
  };
  
  // Handle node drag start
  const handleNodeDragStart = (e, nodeId) => {
    e.stopPropagation();
    
    if (isCreatingEdge) return;
    
    const node = processMap.nodes.find(n => n.id === nodeId);
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - node.x;
    const offsetY = e.clientY - rect.top - node.y;
    
    setIsDragging(true);
    setDraggedNodeId(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  // Handle mouse move for dragging and edge creation
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDragging && draggedNodeId) {
      // Update node position
      setProcessMap(prev => {
        const updatedNodes = prev.nodes.map(node => {
          if (node.id === draggedNodeId) {
            return {
              ...node,
              x: x - dragOffset.x,
              y: y - dragOffset.y
            };
          }
          return node;
        });
        
        return {
          ...prev,
          nodes: updatedNodes
        };
      });
    } else if (isCreatingEdge) {
      // Update edge preview
      setCurrentEdge(prev => ({
        ...prev,
        x2: x,
        y2: y
      }));
    }
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedNodeId(null);
    }
  };
  
  // Handle node deletion
  const handleDeleteNode = (nodeId) => {
    // Remove node
    const updatedNodes = processMap.nodes.filter(node => node.id !== nodeId);
    
    // Remove connected edges
    const updatedEdges = processMap.edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    
    setProcessMap({
      nodes: updatedNodes,
      edges: updatedEdges
    });
  };
  
  // Handle edge deletion
  const handleDeleteEdge = (edgeId) => {
    const updatedEdges = processMap.edges.filter(edge => edge.id !== edgeId);
    
    setProcessMap(prev => ({
      ...prev,
      edges: updatedEdges
    }));
  };
  
  // Cancel edge creation
  const handleCancelEdgeCreation = () => {
    setIsCreatingEdge(false);
    setEdgeStart(null);
  };
  
  // Handle workflow selection
  const handleWorkflowChange = (e) => {
    setSelectedWorkflow(e.target.value);
    
    // Clear process map when changing workflow
    setProcessMap({
      nodes: [],
      edges: []
    });
  };
  
  // Validate process map
  const validateProcessMap = () => {
    const newErrors = {};
    
    if (!selectedWorkflow) {
      newErrors.workflow = 'Please select a workflow';
      return false;
    }
    
    if (processMap.nodes.length === 0) {
      newErrors.nodes = 'Please add at least one node to the process map';
      setErrors(newErrors);
      return false;
    }
    
    // Check for start and end nodes
    const hasStart = processMap.nodes.some(node => node.type === 'start');
    const hasEnd = processMap.nodes.some(node => node.type === 'end');
    
    if (!hasStart) {
      newErrors.start = 'Process map must have a start node';
    }
    
    if (!hasEnd) {
      newErrors.end = 'Process map must have an end node';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProcessMap()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save process map with workflow ID
      await onSave({
        processMap: {
          ...processMap,
          workflowId: selectedWorkflow
        }
      });
      onNext();
    } catch (error) {
      console.error('Error saving process map:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render node
  const renderNode = (node) => {
    const nodeType = nodeTypes[node.type];
    
    return (
      <div
        key={node.id}
        className={`absolute cursor-move rounded-md shadow-md p-2 ${nodeType.color} text-white`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: node.type === 'decision' ? '120px' : '100px',
          height: node.type === 'decision' ? '80px' : '60px',
          transform: 'translate(-50%, -50%)',
          zIndex: isDragging && draggedNodeId === node.id ? 10 : 1
        }}
        onMouseDown={(e) => handleNodeDragStart(e, node.id)}
        onClick={(e) => handleNodeClick(e, node.id)}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-xs font-bold">{nodeType.label}</div>
          {node.taskId && (
            <div className="text-xs truncate max-w-full">
              {getTaskName(node.taskId)}
            </div>
          )}
        </div>
        <button
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNode(node.id);
          }}
        >
          ×
        </button>
      </div>
    );
  };
  
  // Render edge
  const renderEdge = (edge) => {
    const sourceNode = processMap.nodes.find(n => n.id === edge.source);
    const targetNode = processMap.nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    return (
      <g key={edge.id}>
        <line
          x1={sourceNode.x}
          y1={sourceNode.y}
          x2={targetNode.x}
          y2={targetNode.y}
          stroke="black"
          strokeWidth="2"
        />
        <polygon
          points={`${targetNode.x},${targetNode.y} ${targetNode.x-5},${targetNode.y-5} ${targetNode.x-5},${targetNode.y+5}`}
          transform={`rotate(${Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x) * 180 / Math.PI + 90}, ${targetNode.x}, ${targetNode.y})`}
          fill="black"
        />
        <circle
          cx={(sourceNode.x + targetNode.x) / 2}
          cy={(sourceNode.y + targetNode.y) / 2}
          r="8"
          fill="white"
          stroke="black"
          strokeWidth="1"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteEdge(edge.id);
          }}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={(sourceNode.x + targetNode.x) / 2}
          y={(sourceNode.y + targetNode.y) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteEdge(edge.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          ×
        </text>
      </g>
    );
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Process Mapping</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Create visual process maps for your workflows to identify AI integration points
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
                    Create a process map by selecting a workflow and clicking on the canvas to add nodes. Connect nodes by clicking on them in sequence. Your map should include start and end points.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="sm:col-span-3">
                <label htmlFor="workflow" className="block text-sm font-medium text-gray-700">
                  Select Workflow to Map
                </label>
                <div className="mt-1">
                  <select
                    id="workflow"
                    name="workflow"
                    value={selectedWorkflow}
                    onChange={handleWorkflowChange}
                    className={`form-select ${errors.workflow ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="">Select a workflow</option>
                    {workflows.map(workflow => (
                      <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                    ))}
                  </select>
                  {errors.workflow && (
                    <p className="mt-2 text-sm text-red-600">{errors.workflow}</p>
                  )}
                </div>
              </div>
              
              {selectedWorkflow && (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-900">Process Map for {getWorkflowName(selectedWorkflow)}</h4>
                    <div className="flex space-x-2">
                      {isCreatingEdge && (
                        <button
                          type="button"
                          onClick={handleCancelEdgeCreation}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel Connection
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative border border-gray-300 rounded-md bg-gray-50" style={{ height: `${canvasSize.height}px` }}>
                    <div
                      ref={canvasRef}
                      className="absolute inset-0 overflow-hidden"
                      onClick={handleCanvasClick}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      <svg width="100%" height="100%" className="absolute inset-0">
                        {/* Render edges */}
                        {processMap.edges.map(renderEdge)}
                        
                        {/* Render edge being created */}
                        {isCreatingEdge && (
                          <line
                            x1={currentEdge.x1}
                            y1={currentEdge.y1}
                            x2={currentEdge.x2}
                            y2={currentEdge.y2}
                            stroke="black"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        )}
                      </svg>
                      
                      {/* Render nodes */}
                      {processMap.nodes.map(renderNode)}
                    </div>
                  </div>
                  
                  {/* Node type selector */}
                  {showTaskSelector && (
                    <div
                      className="absolute bg-white shadow-lg rounded-md p-4 z-20"
                      style={{
                        left: `${nodePosition.x}px`,
                        top: `${nodePosition.y + 30}px`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-900">Add Node</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddNode('start')}
                            className="px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
                          >
                            Start
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddNode('end')}
                            className="px-3 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                          >
                            End
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddNode('decision')}
                            className="px-3 py-2 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600"
                          >
                            Decision
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddNode('subprocess')}
                            className="px-3 py-2 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600"
                          >
                            Subprocess
                          </button>
                        </div>
                        
                        {getWorkflowTasks().length > 0 && (
                          <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Add Task Node
                            </label>
                            <select
                              className="form-select text-xs"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddNode('task', e.target.value);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="">Select a task</option>
                              {getWorkflowTasks().map(task => (
                                <option key={task.id} value={task.id}>{task.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowTaskSelector(false)}
                            className="px-3 py-1 text-xs text-gray-700 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(errors.nodes || errors.start || errors.end) && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <ul className="text-sm text-red-700">
                            {errors.nodes && <li>{errors.nodes}</li>}
                            {errors.start && <li>{errors.start}</li>}
                            {errors.end && <li>{errors.end}</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h5>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                      <li>Click on the canvas to add nodes</li>
                      <li>Click on a node and then another node to create a connection</li>
                      <li>Drag nodes to reposition them</li>
                      <li>Click the × button on nodes or connections to delete them</li>
                      <li>Your process map must include at least one Start and one End node</li>
                    </ul>
                  </div>
                </>
              )}
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

export default ProcessMapping;
