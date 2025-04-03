import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/auth/AuthForm';

export default function Auth() {
  const router = useRouter();
  const { mode } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock authentication for demo purposes
      // In a real app, this would use signIn/signUp from api.js
      console.log('Authentication data:', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard after successful authentication
      router.push('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signup' ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'signup' 
            ? 'Start your AI implementation journey today' 
            : 'Welcome back to your AI implementation journey'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <AuthForm 
            mode={mode || 'signin'} 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
              <a 
                href={mode === 'signup' ? '/auth?mode=signin' : '/auth?mode=signup'} 
                className="ml-1 font-medium text-primary-600 hover:text-primary-500"
              >
                {mode === 'signup' ? 'Sign in' : 'Sign up'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
