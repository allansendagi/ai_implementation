import React from 'react';
import { useRouter } from 'next/router';

export default function NewProject() {
  const router = useRouter();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would create a project in the database
    router.push('/projects');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="mt-2 text-sm text-gray-500">
              Start your AI implementation journey with a new project
            </p>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="project-description"
                        name="project-description"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe your project"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description of your AI implementation project
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                      Organization
                    </label>
                    <select
                      id="organization"
                      name="organization"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option>My Organization</option>
                      <option>Other Organization</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push('/projects')}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Create Project
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
