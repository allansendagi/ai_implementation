import { useState, useEffect } from 'react';

// AI Potential Score Calculator
export const calculateAIPotential = (task) => {
  if (!task) return 0;
  
  // Weights for different factors
  const weights = {
    predictability: 0.3,
    dataAvailability: 0.3,
    complexity: 0.2,
    frequency: 0.2
  };
  
  // Calculate weighted score (0-10 scale)
  // For predictability and data availability, higher is better
  // For complexity, lower is better (so we invert it)
  const weightedScore = (
    (task.predictability * weights.predictability) +
    (task.dataAvailability * weights.dataAvailability) +
    ((6 - task.complexity) * weights.complexity) + // Invert complexity (5 becomes 1, 1 becomes 5)
    (task.frequency * weights.frequency)
  ) * 2; // Scale to 0-10
  
  // Round to nearest 0.5
  return Math.round(weightedScore * 2) / 2;
};

// AI Tool Recommendation Engine
export const getRecommendedTools = (tasks, workflows, implementationPlan) => {
  // Extract high-potential tasks
  const highPotentialTasks = tasks.filter(task => calculateAIPotential(task) >= 7);
  
  // Analyze task characteristics
  const taskCharacteristics = analyzeTaskCharacteristics(highPotentialTasks);
  
  // Get implementation constraints
  const constraints = getImplementationConstraints(implementationPlan);
  
  // Match tools based on characteristics and constraints
  return matchToolsToNeeds(taskCharacteristics, constraints);
};

// Analyze task characteristics to determine AI needs
const analyzeTaskCharacteristics = (tasks) => {
  // Initialize characteristics with default values
  const characteristics = {
    needsNLP: false,
    needsComputerVision: false,
    needsPredictiveAnalytics: false,
    needsDecisionSupport: false,
    needsProcessAutomation: false,
    needsDataProcessing: false,
    dataVolume: 'low',
    structuredDataRatio: 'low',
    realTimeRequirements: false
  };
  
  // Analyze tasks to determine needs
  tasks.forEach(task => {
    // Check for NLP needs (text processing, language understanding)
    if (task.description && (
      task.description.toLowerCase().includes('text') ||
      task.description.toLowerCase().includes('document') ||
      task.description.toLowerCase().includes('language') ||
      task.description.toLowerCase().includes('chat') ||
      task.description.toLowerCase().includes('email')
    )) {
      characteristics.needsNLP = true;
    }
    
    // Check for Computer Vision needs
    if (task.description && (
      task.description.toLowerCase().includes('image') ||
      task.description.toLowerCase().includes('photo') ||
      task.description.toLowerCase().includes('video') ||
      task.description.toLowerCase().includes('visual') ||
      task.description.toLowerCase().includes('scan')
    )) {
      characteristics.needsComputerVision = true;
    }
    
    // Check for Predictive Analytics needs
    if (task.predictability >= 4 && task.dataAvailability >= 3) {
      characteristics.needsPredictiveAnalytics = true;
    }
    
    // Check for Decision Support needs
    if (task.complexity >= 4) {
      characteristics.needsDecisionSupport = true;
    }
    
    // Check for Process Automation needs
    if (task.frequency >= 4 && task.predictability >= 3) {
      characteristics.needsProcessAutomation = true;
    }
    
    // Check for Data Processing needs
    if (task.dataAvailability >= 4) {
      characteristics.needsDataProcessing = true;
      
      // Estimate data volume based on frequency and complexity
      if (task.frequency >= 4 && task.complexity >= 4) {
        characteristics.dataVolume = 'high';
      } else if (task.frequency >= 3 || task.complexity >= 3) {
        characteristics.dataVolume = 'medium';
      }
    }
    
    // Check for real-time requirements
    if (task.description && (
      task.description.toLowerCase().includes('real-time') ||
      task.description.toLowerCase().includes('realtime') ||
      task.description.toLowerCase().includes('immediate') ||
      task.description.toLowerCase().includes('instant')
    )) {
      characteristics.realTimeRequirements = true;
    }
  });
  
  return characteristics;
};

// Get implementation constraints from the plan
const getImplementationConstraints = (plan) => {
  if (!plan) {
    return {
      timeframe: 'medium',
      resources: 'medium',
      budget: 'medium',
      complexity: 'medium'
    };
  }
  
  // Determine implementation complexity based on plan parameters
  let complexity = 'medium';
  if (plan.timeline === 'short' && plan.resources === 'low') {
    complexity = 'low';
  } else if (plan.timeline === 'long' && (plan.resources === 'high' || plan.budget === 'high')) {
    complexity = 'high';
  }
  
  return {
    timeframe: plan.timeline || 'medium',
    resources: plan.resources || 'medium',
    budget: plan.budget || 'medium',
    complexity
  };
};

// Match tools to needs based on characteristics and constraints
const matchToolsToNeeds = (characteristics, constraints) => {
  // Tool categories needed based on characteristics
  const toolCategories = [];
  
  if (characteristics.needsNLP) {
    toolCategories.push('Language Models');
  }
  
  if (characteristics.needsComputerVision) {
    toolCategories.push('Computer Vision');
  }
  
  if (characteristics.needsPredictiveAnalytics) {
    toolCategories.push('ML Platforms');
  }
  
  if (characteristics.dataVolume === 'high' || characteristics.needsDataProcessing) {
    toolCategories.push('Data Platforms');
  }
  
  if (characteristics.needsProcessAutomation) {
    toolCategories.push('Development Frameworks');
  }
  
  // Adjust based on constraints
  if (constraints.complexity === 'low' || constraints.resources === 'low') {
    // For low complexity/resources, prioritize managed services and no-code solutions
    toolCategories.push('AI Services');
  }
  
  if (constraints.budget === 'low') {
    // For low budget, include open source options
    toolCategories.push('Open Source');
  }
  
  if (constraints.complexity === 'high' && constraints.resources === 'high') {
    // For high complexity and resources, include enterprise solutions
    toolCategories.push('Enterprise AI');
    toolCategories.push('MLOps');
  }
  
  return toolCategories;
};

// Workflow Analysis for AI Potential
export const analyzeWorkflowForAIPotential = (workflow, tasks) => {
  if (!workflow || !tasks) return null;
  
  // Get tasks for this workflow
  const workflowTasks = tasks.filter(task => task.workflowId === workflow.id);
  
  // Calculate average AI potential
  const totalPotential = workflowTasks.reduce((sum, task) => sum + calculateAIPotential(task), 0);
  const averagePotential = workflowTasks.length > 0 ? totalPotential / workflowTasks.length : 0;
  
  // Count high-potential tasks
  const highPotentialTasks = workflowTasks.filter(task => calculateAIPotential(task) >= 7);
  
  // Determine bottlenecks (tasks with high frequency but low AI potential)
  const bottlenecks = workflowTasks.filter(task => 
    task.frequency >= 4 && calculateAIPotential(task) < 5
  );
  
  // Determine quick wins (high AI potential and relatively easy to implement)
  const quickWins = workflowTasks.filter(task => 
    calculateAIPotential(task) >= 7 && task.complexity <= 3
  );
  
  // Calculate automation potential percentage
  const automationPotential = workflowTasks.length > 0 
    ? (highPotentialTasks.length / workflowTasks.length) * 100 
    : 0;
  
  // Determine overall recommendation
  let recommendation = '';
  if (averagePotential >= 7) {
    recommendation = 'High Priority for AI Implementation';
  } else if (averagePotential >= 5) {
    recommendation = 'Medium Priority for AI Implementation';
  } else {
    recommendation = 'Low Priority for AI Implementation';
  }
  
  // Determine best approach
  let approach = '';
  if (quickWins.length >= 2) {
    approach = 'Start with Quick Wins';
  } else if (bottlenecks.length >= 2) {
    approach = 'Focus on Bottlenecks';
  } else if (highPotentialTasks.length > 0) {
    approach = 'Implement High-Potential Tasks';
  } else {
    approach = 'Consider Process Redesign Before AI';
  }
  
  return {
    workflowId: workflow.id,
    workflowName: workflow.name,
    averagePotential: Math.round(averagePotential * 10) / 10,
    highPotentialTaskCount: highPotentialTasks.length,
    totalTaskCount: workflowTasks.length,
    bottleneckCount: bottlenecks.length,
    quickWinCount: quickWins.length,
    automationPotential: Math.round(automationPotential),
    recommendation,
    approach,
    quickWins: quickWins.map(task => task.id),
    bottlenecks: bottlenecks.map(task => task.id)
  };
};

// Generate Implementation Plan Recommendations
export const generateImplementationPlanRecommendations = (workflows, tasks) => {
  if (!workflows || !tasks || workflows.length === 0 || tasks.length === 0) {
    return null;
  }
  
  // Analyze each workflow
  const workflowAnalyses = workflows.map(workflow => 
    analyzeWorkflowForAIPotential(workflow, tasks)
  );
  
  // Sort workflows by priority (average potential)
  const sortedWorkflows = [...workflowAnalyses].sort((a, b) => 
    b.averagePotential - a.averagePotential
  );
  
  // Get all quick wins across workflows
  const allQuickWins = tasks.filter(task => 
    calculateAIPotential(task) >= 7 && task.complexity <= 3
  );
  
  // Get all high-potential tasks
  const allHighPotentialTasks = tasks.filter(task => 
    calculateAIPotential(task) >= 7
  );
  
  // Generate phase recommendations
  const phaseRecommendations = [];
  
  // Phase 1: Quick Wins
  if (allQuickWins.length > 0) {
    phaseRecommendations.push({
      name: 'Phase 1: Quick Wins',
      description: 'Implement high-potential, low-complexity tasks for immediate value',
      duration: Math.max(4, Math.ceil(allQuickWins.length / 2) * 2), // Estimate 2 weeks per 2 tasks
      tasks: allQuickWins.map(task => task.id)
    });
  }
  
  // Phase 2: High-Priority Workflows
  const highPriorityWorkflows = sortedWorkflows.filter(w => w.averagePotential >= 7);
  if (highPriorityWorkflows.length > 0) {
    // Get high-potential tasks from high-priority workflows that aren't already in phase 1
    const phase2Tasks = allHighPotentialTasks.filter(task => 
      highPriorityWorkflows.some(w => w.workflowId === task.workflowId) &&
      !allQuickWins.some(qw => qw.id === task.id)
    );
    
    if (phase2Tasks.length > 0) {
      phaseRecommendations.push({
        name: 'Phase 2: High-Priority Workflows',
        description: 'Implement remaining high-potential tasks from high-priority workflows',
        duration: Math.max(6, Math.ceil(phase2Tasks.length / 2) * 3), // Estimate 3 weeks per 2 tasks
        tasks: phase2Tasks.map(task => task.id)
      });
    }
  }
  
  // Phase 3: Medium-Priority Workflows
  const mediumPriorityWorkflows = sortedWorkflows.filter(w => 
    w.averagePotential >= 5 && w.averagePotential < 7
  );
  if (mediumPriorityWorkflows.length > 0) {
    // Get high-potential tasks from medium-priority workflows that aren't in earlier phases
    const phase3Tasks = tasks.filter(task => 
      calculateAIPotential(task) >= 6 &&
      mediumPriorityWorkflows.some(w => w.workflowId === task.workflowId) &&
      !allQuickWins.some(qw => qw.id === task.id) &&
      !phaseRecommendations[1]?.tasks.includes(task.id)
    );
    
    if (phase3Tasks.length > 0) {
      phaseRecommendations.push({
        name: 'Phase 3: Medium-Priority Workflows',
        description: 'Implement high-potential tasks from medium-priority workflows',
        duration: Math.max(8, Math.ceil(phase3Tasks.length / 2) * 4), // Estimate 4 weeks per 2 tasks
        tasks: phase3Tasks.map(task => task.id)
      });
    }
  }
  
  // Phase 4: Foundation for Advanced AI
  const complexHighPotentialTasks = tasks.filter(task => 
    calculateAIPotential(task) >= 7 && 
    task.complexity >= 4 &&
    !phaseRecommendations.some(phase => phase.tasks.includes(task.id))
  );
  
  if (complexHighPotentialTasks.length > 0) {
    phaseRecommendations.push({
      name: 'Phase 4: Foundation for Advanced AI',
      description: 'Implement complex, high-potential tasks that require more resources',
      duration: Math.max(12, complexHighPotentialTasks.length * 3), // Estimate 3 weeks per task
      tasks: complexHighPotentialTasks.map(task => task.id)
    });
  }
  
  return {
    workflowAnalyses: sortedWorkflows,
    phaseRecommendations,
    timelineRecommendation: estimateTimeline(phaseRecommendations),
    resourceRecommendation: estimateResources(tasks, phaseRecommendations),
    budgetRecommendation: estimateBudget(tasks, phaseRecommendations)
  };
};

// Estimate timeline based on phases
const estimateTimeline = (phases) => {
  if (!phases || phases.length === 0) return 'medium';
  
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  
  if (totalDuration <= 16) return 'short';
  if (totalDuration <= 36) return 'medium';
  return 'long';
};

// Estimate resources based on tasks and phases
const estimateResources = (tasks, phases) => {
  if (!tasks || tasks.length === 0 || !phases || phases.length === 0) return 'medium';
  
  // Check for complex tasks
  const complexTasksCount = tasks.filter(task => task.complexity >= 4).length;
  const totalTasksCount = tasks.length;
  
  const complexityRatio = complexTasksCount / totalTasksCount;
  
  if (complexityRatio >= 0.5) return 'high';
  if (complexityRatio >= 0.3) return 'medium';
  return 'low';
};

// Estimate budget based on tasks and phases
const estimateBudget = (tasks, phases) => {
  if (!tasks || tasks.length === 0 || !phases || phases.length === 0) return 'medium';
  
  // Calculate total duration
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  
  // Count high-complexity tasks
  const highComplexityCount = tasks.filter(task => task.complexity >= 4).length;
  
  // Simple budget estimation
  if (totalDuration >= 36 || highComplexityCount >= 5) return 'high';
  if (totalDuration >= 20 || highComplexityCount >= 3) return 'medium';
  return 'low';
};

// AI Tool Matching Algorithm
export const matchAIToolsToProject = (projectData) => {
  const { tasks, workflows, implementationPlan } = projectData;
  
  if (!tasks || !workflows) return [];
  
  // Get task characteristics
  const taskCharacteristics = analyzeTaskCharacteristics(
    tasks.filter(task => calculateAIPotential(task) >= 6)
  );
  
  // Get implementation constraints
  const constraints = getImplementationConstraints(implementationPlan);
  
  // Define tool scoring criteria
  const scoreTool = (tool) => {
    let score = 0;
    
    // Category match
    if (taskCharacteristics.needsNLP && tool.category === 'Language Models') {
      score += 3;
    }
    
    if (taskCharacteristics.needsComputerVision && tool.category === 'Computer Vision') {
      score += 3;
    }
    
    if (taskCharacteristics.needsPredictiveAnalytics && 
        (tool.category === 'ML Platforms' || tool.category === 'Data Platforms')) {
      score += 3;
    }
    
    if (taskCharacteristics.needsProcessAutomation && 
        tool.category === 'Development Frameworks') {
      score += 3;
    }
    
    // Capability match
    if (taskCharacteristics.needsNLP && 
        tool.capabilities.some(cap => 
          cap.toLowerCase().includes('text') || 
          cap.toLowerCase().includes('language') ||
          cap.toLowerCase().includes('nlp')
        )) {
      score += 2;
    }
    
    if (taskCharacteristics.needsComputerVision && 
        tool.capabilities.some(cap => 
          cap.toLowerCase().includes('vision') || 
          cap.toLowerCase().includes('image') ||
          cap.toLowerCase().includes('video')
        )) {
      score += 2;
    }
    
    // Implementation complexity match
    if (constraints.complexity === tool.implementationComplexity) {
      score += 2;
    } else if (
      (constraints.complexity === 'low' && tool.implementationComplexity === 'medium') ||
      (constraints.complexity === 'medium' && 
        (tool.implementationComplexity === 'low' || tool.implementationComplexity === 'high'))
    ) {
      score += 1;
    }
    
    // Budget match
    if (constraints.budget === 'low' && tool.pricingModel.includes('Free')) {
      score += 2;
    } else if (constraints.budget === 'medium' && 
              (tool.pricingModel.includes('Freemium') || tool.pricingModel.includes('Usage'))) {
      score += 2;
    } else if (constraints.budget === 'high' && 
              (tool.pricingModel.includes('Subscription') || tool.pricingModel.includes('Enterprise'))) {
      score += 2;
    }
    
    return score;
  };
  
  // Get all available tools (this would normally come from a database)
  const allTools = getAvailableAITools();
  
  // Score and sort tools
  const scoredTools = allTools.map(tool => ({
    ...tool,
    score: scoreTool(tool)
  })).sort((a, b) => b.score - a.score);
  
  // Return top recommendations
  return scoredTools.slice(0, 10).map(tool => tool.id);
};

// Mock function to get available AI tools
// In a real application, this would fetch from a database
const getAvailableAITools = () => {
  return [
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'GDPR compliant'
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
      dataPrivacy: 'ISO 27001 certified'
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
      dataPrivacy: 'Self-hosted option available'
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
      dataPrivacy: 'HIPAA compliant'
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
      dataPrivacy: 'Self-hosted option available'
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
      dataPrivacy: 'AWS compliance programs'
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'GDPR compliant'
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'HIPAA compliant'
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'GDPR compliant'
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'Self-hosted option available'
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
      dataPrivacy: 'Self-hosted option available'
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
      dataPrivacy: 'Self-hosted option available'
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
      dataPrivacy: 'SOC 2 compliant'
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
      dataPrivacy: 'GDPR compliant'
    }
  ];
};

// Data Visualization Helpers
export const generateVisualizationData = {
  // Generate data for AI potential by workflow chart
  workflowPotentialChart: (workflows, tasks) => {
    if (!workflows || !tasks) return null;
    
    const workflowAnalyses = workflows.map(workflow => 
      analyzeWorkflowForAIPotential(workflow, tasks)
    );
    
    return {
      labels: workflowAnalyses.map(w => w.workflowName),
      datasets: [
        {
          label: 'Average AI Potential',
          data: workflowAnalyses.map(w => w.averagePotential),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Automation Potential (%)',
          data: workflowAnalyses.map(w => w.automationPotential),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  },
  
  // Generate data for task distribution chart
  taskDistributionChart: (tasks) => {
    if (!tasks) return null;
    
    // Count tasks by AI potential range
    const potentialRanges = {
      'High (7-10)': tasks.filter(task => calculateAIPotential(task) >= 7).length,
      'Medium (4-6.5)': tasks.filter(task => calculateAIPotential(task) >= 4 && calculateAIPotential(task) < 7).length,
      'Low (0-3.5)': tasks.filter(task => calculateAIPotential(task) < 4).length
    };
    
    return {
      labels: Object.keys(potentialRanges),
      datasets: [
        {
          data: Object.values(potentialRanges),
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(255, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  },
  
  // Generate data for implementation timeline chart
  implementationTimelineChart: (implementationPlan) => {
    if (!implementationPlan || !implementationPlan.phases) return null;
    
    return {
      labels: implementationPlan.phases.map(phase => phase.name),
      datasets: [
        {
          label: 'Duration (weeks)',
          data: implementationPlan.phases.map(phase => phase.duration),
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  },
  
  // Generate data for task characteristics radar chart
  taskCharacteristicsChart: (task) => {
    if (!task) return null;
    
    return {
      labels: ['Predictability', 'Data Availability', 'Low Complexity', 'Frequency', 'AI Potential'],
      datasets: [
        {
          label: task.name,
          data: [
            task.predictability,
            task.dataAvailability,
            6 - task.complexity, // Invert complexity for visualization
            task.frequency,
            calculateAIPotential(task)
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }
      ]
    };
  }
};

// Export all functions
export default {
  calculateAIPotential,
  getRecommendedTools,
  analyzeWorkflowForAIPotential,
  generateImplementationPlanRecommendations,
  matchAIToolsToProject,
  generateVisualizationData
};
