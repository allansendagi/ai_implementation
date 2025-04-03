import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AIToolsSelection = ({ initialData, tasks, implementationPlan, onSave, onNext }) => {
  const [selectedTools, setSelectedTools] = useState(initialData?.selectedTools || []);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toolCategories, setToolCategories] = useState([]);
  
  // AI tools database
  const aiTools = [
    {
      id: 'tool-1',
      name: 'OpenAI GPT-4',
      description: 'Advanced language model for natural language processing, content generation, and conversational AI',
      category: 'Language Models',
      capabilities: ['Text Generation', 'Summarization', 'Translation', 'Question Answering'],
      useCases: ['Customer Support', 'Content Creation', 'Data Analysis'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/openai.png'
    },
    {
      id: 'tool-2',
      name: 'Google Vertex AI',
      description: 'Unified ML platform for building and deploying ML models and AI applications',
      category: 'ML Platforms',
      capabilities: ['Custom Model Training', 'AutoML', 'Model Deployment', 'MLOps'],
      useCases: ['Predictive Analytics', 'Computer Vision', 'NLP'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'high',
      integrationOptions: ['API', 'SDK', 'Console'],
      dataPrivacy: 'GDPR compliant',
      logoUrl: '/images/tools/google.png'
    },
    {
      id: 'tool-3',
      name: 'Microsoft Azure Cognitive Services',
      description: 'Suite of AI services and APIs for vision, speech, language, and decision making',
      category: 'AI Services',
      capabilities: ['Computer Vision', 'Speech Recognition', 'Language Understanding', 'Decision Support'],
      useCases: ['Document Processing', 'Speech Interfaces', 'Image Analysis'],
      pricingModel: 'Tiered',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK', 'No-code'],
      dataPrivacy: 'ISO 27001 certified',
      logoUrl: '/images/tools/microsoft.png'
    },
    {
      id: 'tool-4',
      name: 'Hugging Face Transformers',
      description: 'Open-source library providing thousands of pre-trained models for NLP, vision, and audio',
      category: 'Open Source',
      capabilities: ['Text Classification', 'Named Entity Recognition', 'Translation', 'Summarization'],
      useCases: ['Research', 'Prototyping', 'Custom NLP Solutions'],
      pricingModel: 'Free (Open Source)',
      implementationComplexity: 'medium',
      integrationOptions: ['Python Library', 'API'],
      dataPrivacy: 'Self-hosted option available',
      logoUrl: '/images/tools/huggingface.png'
    },
    {
      id: 'tool-5',
      name: 'IBM Watson',
      description: 'Enterprise AI platform with pre-built applications and tools for building AI solutions',
      category: 'Enterprise AI',
      capabilities: ['Natural Language Understanding', 'Speech to Text', 'Text to Speech', 'Visual Recognition'],
      useCases: ['Enterprise Search', 'Customer Service', 'Risk Management'],
      pricingModel: 'Subscription',
      implementationComplexity: 'high',
      integrationOptions: ['API', 'SDK', 'Cloud'],
      dataPrivacy: 'HIPAA compliant',
      logoUrl: '/images/tools/ibm.png'
    },
    {
      id: 'tool-6',
      name: 'TensorFlow',
      description: 'Open-source machine learning framework for building and deploying ML models',
      category: 'Open Source',
      capabilities: ['Deep Learning', 'Neural Networks', 'Model Training', 'Deployment'],
      useCases: ['Computer Vision', 'NLP', 'Predictive Analytics'],
      pricingModel: 'Free (Open Source)',
      implementationComplexity: 'high',
      integrationOptions: ['Python Library', 'JavaScript', 'Mobile'],
      dataPrivacy: 'Self-hosted option available',
      logoUrl: '/images/tools/tensorflow.png'
    },
    {
      id: 'tool-7',
      name: 'Amazon SageMaker',
      description: 'Fully managed service to build, train, and deploy machine learning models',
      category: 'ML Platforms',
      capabilities: ['Model Training', 'Automated ML', 'Model Deployment', 'MLOps'],
      useCases: ['Fraud Detection', 'Demand Forecasting', 'Recommendation Systems'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'high',
      integrationOptions: ['API', 'SDK', 'Console'],
      dataPrivacy: 'AWS compliance programs',
      logoUrl: '/images/tools/amazon.png'
    },
    {
      id: 'tool-8',
      name: 'Anthropic Claude',
      description: 'AI assistant focused on helpfulness, harmlessness, and honesty',
      category: 'Language Models',
      capabilities: ['Text Generation', 'Summarization', 'Question Answering', 'Content Moderation'],
      useCases: ['Customer Support', 'Content Creation', 'Research'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'medium',
      integrationOptions: ['API'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/anthropic.png'
    },
    {
      id: 'tool-9',
      name: 'Databricks',
      description: 'Unified analytics platform for big data processing and machine learning',
      category: 'Data Platforms',
      capabilities: ['Data Processing', 'ML Workflows', 'Collaborative Notebooks', 'Model Serving'],
      useCases: ['Data Engineering', 'Data Science', 'Business Analytics'],
      pricingModel: 'Subscription',
      implementationComplexity: 'high',
      integrationOptions: ['API', 'SDK', 'Console'],
      dataPrivacy: 'GDPR compliant',
      logoUrl: '/images/tools/databricks.png'
    },
    {
      id: 'tool-10',
      name: 'Dataiku',
      description: 'End-to-end data science and machine learning platform',
      category: 'Data Platforms',
      capabilities: ['Data Preparation', 'Visual ML', 'Model Deployment', 'Collaboration'],
      useCases: ['Business Intelligence', 'Risk Analysis', 'Customer Intelligence'],
      pricingModel: 'Subscription',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK', 'No-code'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/dataiku.png'
    },
    {
      id: 'tool-11',
      name: 'Snowflake',
      description: 'Cloud data platform with AI and ML capabilities',
      category: 'Data Platforms',
      capabilities: ['Data Warehousing', 'Data Sharing', 'Data Engineering', 'ML Integration'],
      useCases: ['Data Analytics', 'Business Intelligence', 'Data Sharing'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK', 'Console'],
      dataPrivacy: 'HIPAA compliant',
      logoUrl: '/images/tools/snowflake.png'
    },
    {
      id: 'tool-12',
      name: 'Labelbox',
      description: 'Data labeling platform for machine learning',
      category: 'Data Tools',
      capabilities: ['Data Labeling', 'Model Training Data', 'Annotation', 'Quality Management'],
      useCases: ['Computer Vision', 'NLP', 'Data Preparation'],
      pricingModel: 'Subscription',
      implementationComplexity: 'low',
      integrationOptions: ['API', 'SDK', 'Web Interface'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/labelbox.png'
    },
    {
      id: 'tool-13',
      name: 'Weights & Biases',
      description: 'MLOps platform for experiment tracking, model management, and collaboration',
      category: 'MLOps',
      capabilities: ['Experiment Tracking', 'Model Management', 'Collaboration', 'Visualization'],
      useCases: ['ML Research', 'Model Development', 'Team Collaboration'],
      pricingModel: 'Freemium',
      implementationComplexity: 'low',
      integrationOptions: ['API', 'SDK', 'Python Library'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/wandb.png'
    },
    {
      id: 'tool-14',
      name: 'Roboflow',
      description: 'Computer vision platform for image and video annotation, model training, and deployment',
      category: 'Computer Vision',
      capabilities: ['Image Annotation', 'Model Training', 'Model Deployment', 'Data Augmentation'],
      useCases: ['Object Detection', 'Image Classification', 'Segmentation'],
      pricingModel: 'Freemium',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK', 'Web Interface'],
      dataPrivacy: 'GDPR compliant',
      logoUrl: '/images/tools/roboflow.png'
    },
    {
      id: 'tool-15',
      name: 'Pinecone',
      description: 'Vector database for similarity search and AI applications',
      category: 'Data Tools',
      capabilities: ['Vector Search', 'Semantic Search', 'Recommendation Systems', 'Anomaly Detection'],
      useCases: ['Similarity Search', 'Recommendation Engines', 'Content Discovery'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/pinecone.png'
    },
    {
      id: 'tool-16',
      name: 'Langchain',
      description: 'Framework for developing applications powered by language models',
      category: 'Development Frameworks',
      capabilities: ['LLM Integration', 'Prompt Management', 'Chain of Thought', 'Agent Development'],
      useCases: ['Chatbots', 'Document Processing', 'Knowledge Management'],
      pricingModel: 'Free (Open Source)',
      implementationComplexity: 'medium',
      integrationOptions: ['Python Library', 'JavaScript Library'],
      dataPrivacy: 'Self-hosted option available',
      logoUrl: '/images/tools/langchain.png'
    },
    {
      id: 'tool-17',
      name: 'Streamlit',
      description: 'Open-source app framework for Machine Learning and Data Science',
      category: 'Development Frameworks',
      capabilities: ['Data Visualization', 'Interactive Apps', 'Model Deployment', 'Prototyping'],
      useCases: ['Data Apps', 'ML Demos', 'Internal Tools'],
      pricingModel: 'Free (Open Source)',
      implementationComplexity: 'low',
      integrationOptions: ['Python Library', 'Cloud Deployment'],
      dataPrivacy: 'Self-hosted option available',
      logoUrl: '/images/tools/streamlit.png'
    },
    {
      id: 'tool-18',
      name: 'Gradio',
      description: 'Open-source Python library for creating customizable UI components for ML models',
      category: 'Development Frameworks',
      capabilities: ['UI Components', 'Model Demos', 'API Generation', 'Sharing'],
      useCases: ['Model Demos', 'Prototyping', 'User Testing'],
      pricingModel: 'Free (Open Source)',
      implementationComplexity: 'low',
      integrationOptions: ['Python Library', 'Cloud Deployment'],
      dataPrivacy: 'Self-hosted option available',
      logoUrl: '/images/tools/gradio.png'
    },
    {
      id: 'tool-19',
      name: 'Cohere',
      description: 'Platform for building with language AI, offering embeddings and language models',
      category: 'Language Models',
      capabilities: ['Text Generation', 'Text Embeddings', 'Semantic Search', 'Classification'],
      useCases: ['Content Generation', 'Search Enhancement', 'Customer Support'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK'],
      dataPrivacy: 'SOC 2 compliant',
      logoUrl: '/images/tools/cohere.png'
    },
    {
      id: 'tool-20',
      name: 'Stability AI',
      description: 'Open AI systems focusing on image, language, audio, video, and 3D generation',
      category: 'Generative AI',
      capabilities: ['Image Generation', 'Text-to-Image', 'Image Editing', 'Style Transfer'],
      useCases: ['Creative Content', 'Design', 'Marketing'],
      pricingModel: 'Usage-based',
      implementationComplexity: 'medium',
      integrationOptions: ['API', 'SDK'],
      dataPrivacy: 'GDPR compliant',
      logoUrl: '/images/tools/stability.png'
    }
  ];
  
  // Extract unique categories
  useEffect(() => {
    const categories = [...new Set(aiTools.map(tool => tool.category))];
    setToolCategories(categories);
  }, []);
  
  // Handle tool selection
  const handleToolSelection = (toolId) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };
  
  // Filter tools by category
  const getFilteredTools = () => {
    let filtered = [...aiTools];
    
    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(tool => tool.category === filter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.capabilities.some(cap => cap.toLowerCase().includes(query)) ||
        tool.useCases.some(useCase => useCase.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  // Get recommended tools based on tasks and implementation plan
  const getRecommendedTools = () => {
    // This is a simplified recommendation algorithm
    // In a real application, this would be more sophisticated
    
    const highPotentialTasks = tasks.filter(task => task.aiPotential >= 7);
    const taskCategories = new Set();
    
    // Extract categories from high potential tasks
    highPotentialTasks.forEach(task => {
      if (task.predictability >= 4) taskCategories.add('Language Models');
      if (task.complexity >= 4) taskCategories.add('ML Platforms');
      if (task.dataAvailability <= 2) taskCategories.add('Data Tools');
      if (task.frequency >= 4) taskCategories.add('MLOps');
    });
    
    // Get tools that match the categories
    return aiTools.filter(tool => 
      taskCategories.has(tool.category) || 
      tool.implementationComplexity === (implementationPlan?.resources || 'medium')
    ).map(tool => tool.id);
  };
  
  // Validate selection
  const validateSelection = () => {
    const newErrors = {};
    
    if (selectedTools.length === 0) {
      newErrors.tools = 'Please select at least one AI tool';
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSelection()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get full tool objects for selected tools
      const selectedToolObjects = aiTools.filter(tool => selectedTools.includes(tool.id));
      
      await onSave({ 
        selectedTools,
        selectedToolObjects
      });
      onNext();
    } catch (error) {
      console.error('Error saving AI tools selection:', error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get tool by ID
  const getToolById = (id) => {
    return aiTools.find(tool => tool.id === id);
  };
  
  // Get complexity class
  const getComplexityClass = (complexity) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">AI Tools Selection</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Select the AI tools and platforms that best fit your implementation plan
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
                    Based on your tasks and implementation plan, we've highlighted recommended tools. Select the tools that best fit your organization's needs and technical capabilities.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-md font-medium text-gray-900">Available AI Tools</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedTools.length} tools selected
                  </p>
                </div>
                <div className="mt-4 flex sm:mt-0 sm:ml-4">
                  <div className="flex space-x-4">
                    <div>
                      <label htmlFor="filter" className="sr-only">Filter by Category</label>
                      <select
                        id="filter"
                        name="filter"
                        className="form-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {toolCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="search" className="sr-only">Search</label>
                      <input
                        type="text"
                        name="search"
                        id="search"
                        className="form-input"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {errors.tools && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.tools}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getFilteredTools().map(tool => {
                  const isSelected = selectedTools.includes(tool.id);
                  const isRecommended = getRecommendedTools().includes(tool.id);
                  
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative rounded-lg border ${
                        isSelected
                          ? 'border-primary-500 ring-2 ring-primary-500'
                          : isRecommended
                            ? 'border-yellow-300 ring-2 ring-yellow-300'
                            : 'border-gray-300'
                      } bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 cursor-pointer`}
                      onClick={() => handleToolSelection(tool.id)}
                    >
                      {isRecommended && !isSelected && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Recommended
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {/* Placeholder for logo */}
                          <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <a href="#" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                            <p className="text-sm text-gray-500 truncate">{tool.category}</p>
                          </a>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={isSelected}
                            onChange={() => {}} // Handled by div click
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {tool.capabilities.slice(0, 3).map((capability, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {capability}
                            </span>
                          ))}
                          {tool.capabilities.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{tool.capabilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getComplexityClass(tool.implementationComplexity)}`}>
                          {tool.implementationComplexity.charAt(0).toUpperCase() + tool.implementationComplexity.slice(1)} Complexity
                        </span>
                        <span className="text-gray-500">{tool.pricingModel}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {getFilteredTools().length === 0 && (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  No tools match your current filters. Try adjusting your search or category filter.
                </div>
              )}
            </div>
            
            {selectedTools.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-md font-medium text-gray-900 mb-4">Selected Tools Summary</h4>
                
                <div className="space-y-4">
                  {selectedTools.map(toolId => {
                    const tool = getToolById(toolId);
                    return (
                      <div key={toolId} className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {/* Placeholder for logo */}
                          <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-900">{tool.name}</h5>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToolSelection(toolId);
                              }}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                          <div className="mt-2">
                            <h6 className="text-xs font-medium text-gray-700">Use Cases:</h6>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {tool.useCases.map((useCase, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {useCase}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-2">
                            <h6 className="text-xs font-medium text-gray-700">Integration Options:</h6>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {tool.integrationOptions.map((option, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                'Save & Complete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsSelection;
