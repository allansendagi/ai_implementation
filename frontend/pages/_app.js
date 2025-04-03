import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from '../lib/api';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth'];
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Mock authentication for demo purposes
        // In a real app, this would use getCurrentUser() from api.js
        const mockUser = {
          id: '1',
          email: 'user@example.com',
          name: 'Demo User'
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    // Redirect logic
    if (!loading) {
      const pathIsPublic = publicRoutes.includes(router.pathname) || 
                          router.pathname.startsWith('/auth');
      
      if (!user && !pathIsPublic) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push('/auth?mode=signin');
      }
    }
  }, [user, loading, router]);
  
  const handleSignOut = async () => {
    try {
      // In a real app, this would call signOut() from api.js
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  return (
    <div className="app-container">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="text-2xl font-bold text-primary-600">AI Journey</a>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="/projects" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Projects
                </a>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div>
                  {user ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-700">{user.email}</span>
                      <button 
                        type="button" 
                        onClick={handleSignOut}
                        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
                        id="user-menu-button"
                      >
                        <span className="sr-only">Open user menu</span>
                        <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                          <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  ) : (
                    <a 
                      href="/auth?mode=signin"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Sign In
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <Component {...pageProps} user={user} />
      )}
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2025 AI Journey App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
