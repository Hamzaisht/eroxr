
import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

interface AuthLayoutProps {
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string;
}

export const AuthLayout = ({
  requireAuth = false,  // Default for login/register pages
  redirectAuthenticatedTo = '/home',
  redirectUnauthenticatedTo = '/login',
}: AuthLayoutProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // Redirect unauthenticated users to login
        console.log('Auth required, redirecting to', redirectUnauthenticatedTo);
        navigate(redirectUnauthenticatedTo, { 
          state: { from: location.pathname } 
        });
      } else if (!requireAuth && user) {
        // Redirect authenticated users away from login/signup pages
        console.log('User authenticated, redirecting to', redirectAuthenticatedTo);
        
        // Check if there's a return path in location state
        const returnPath = location.state?.from;
        if (returnPath && typeof returnPath === 'string') {
          navigate(returnPath);
        } else {
          navigate(redirectAuthenticatedTo);
        }
      }
    }
  }, [
    user, 
    isLoading, 
    navigate, 
    requireAuth, 
    redirectAuthenticatedTo, 
    redirectUnauthenticatedTo,
    location
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Don't render anything if the user will be redirected
  if ((requireAuth && !user) || (!requireAuth && user)) {
    return <LoadingScreen />;
  }

  return <Outlet />;
};
