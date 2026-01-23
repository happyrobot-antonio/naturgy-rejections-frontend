'use client';

import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedPassword = localStorage.getItem('dashboard_auth');
      
      if (!savedPassword) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: savedPassword }),
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('dashboard_auth');
          setIsAuthenticated(false);
        }
      } catch (err) {
        // If can't connect to API, allow access if password was saved
        // (useful for development)
        setIsAuthenticated(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  // Authenticated - show content
  return <>{children}</>;
}
