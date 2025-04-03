import React from 'react';
import { useRouter } from 'next/router';
import ProjectCard from '../../components/projects/ProjectCard';

export default function Projects() {
  const router = useRouter();
  
  // Mock project data with proper dates
  const projects = [
    {
      id: '1',
      name: 'Marketing Automation',
      description: 'Implementing AI for marketing campaign optimization',
      progress: 60,
      currentStep: 'Workflow Analysis',
      createdAt: new Date('2025-02-15T12:00:00Z').toISOString(),
      updatedAt: new Date('2025-03-25T14:30:00Z').toISOString()
    },
    {
      id: '2',
      name: 'Customer Support Enhancement',
      description: 'AI-powered customer support automation',
      progress: 30,
      currentStep: 'Starting Point Analysis',
      createdAt: new Date('2025-03-10T09:00:00Z').toISOString(),
      updatedAt: new Date('2025-03-28T11:45:00Z').toISOString()
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your AI implementation projects
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/projects/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              New Project
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
