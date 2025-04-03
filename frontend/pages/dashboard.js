import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectList from '../components/projects/ProjectList';
import { createProject, getUserProjects } from '../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // In a real app, this would fetch the user's projects
    // For now, we'll use mock data
    const fetchProjects = async () => {
      try {
        // This would normally use the actual user ID
        const mockProjects = [
          {
            id: '1',
            title: 'Implementing AI for marketing campaign optimization',
            description: 'Optimize marketing campaigns using AI',
            project_progress: { current_step: 1 },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'AI-powered customer support automation',
            description: 'Automate customer support using AI',
            project_progress: { current_step: 1 },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleCreateProject = async (projectData) => {
    try {
      // In a real app, this would create a project in the database
      // For now, we'll just add it to our local state
      const newProject = {
        id: Date.now().toString(),
        title: projectData.title,
        description: projectData.description,
        project_progress: { current_step: 1 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProjects([newProject, ...projects]);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };
  
  const handleSelectProject = (projectId) => {
    router.push(`/projects/${projectId}/assessment`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your AI implementation projects and track your progress
            </p>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ProjectList 
              projects={projects} 
              onCreateProject={handleCreateProject}
              onSelectProject={handleSelectProject}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
