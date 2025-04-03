import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectList = ({ projects, onCreateProject, onSelectProject }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  
  const handleCreateClick = () => {
    setIsCreating(true);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setNewProject({ title: '', description: '' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateProject(newProject);
    setIsCreating(false);
    setNewProject({ title: '', description: '' });
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Projects</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Select an existing project or create a new one
          </p>
        </div>
        {!isCreating && (
          <button
            type="button"
            onClick={handleCreateClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Project
          </button>
        )}
      </div>
      
      {isCreating ? (
        <motion.div 
          className="px-4 py-5 sm:p-6 border-t border-gray-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="project-title" className="block text-sm font-medium text-gray-700">
                  Project Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="project-title"
                    id="project-title"
                    className="form-input"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="project-description"
                    name="project-description"
                    rows={3}
                    className="form-input"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Project
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id}>
                <div 
                  className="block hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">{project.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Step {project.project_progress?.current_step || 1}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p>
                          Updated on{' '}
                          <time dateTime={project.project_progress?.updated_at || project.updated_at}>
                            {new Date(project.project_progress?.updated_at || project.updated_at).toLocaleDateString()}
                          </time>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No projects found. Create your first project to get started.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
