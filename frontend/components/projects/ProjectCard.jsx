import React from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, onClick }) => {
  // Calculate progress percentage from project data
  const calculateProgress = () => {
    if (!project.project_progress) return 0;
    
    const currentStep = project.project_progress.current_step || 1;
    const totalSteps = 9; // Total number of steps in the journey
    
    return Math.round((currentStep - 1) / totalSteps * 100);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };
  
  const progressPercentage = calculateProgress();
  
  return (
    <motion.div 
      className="card cursor-pointer hover:bg-gray-50"
      onClick={() => onClick && onClick(project.id)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{project.title || project.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description || 'No description provided'}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          Step {project.project_progress?.current_step || project.currentStep || 1}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">{project.progress || progressPercentage}%</span>
        </div>
        <div className="mt-1 progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${project.progress || progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <div>Created: {formatDate(project.created_at || project.createdAt)}</div>
        <div>Updated: {formatDate(project.updated_at || project.updatedAt || project.project_progress?.updated_at)}</div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
