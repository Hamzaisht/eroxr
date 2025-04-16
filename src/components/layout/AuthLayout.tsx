
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
  requireAuth = true,
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
        navigate(redirectUnauthenticatedTo, { 
          state: { from: location.pathname } 
        });
      } else if (!requireAuth && user) {
        // Redirect authenticated users away from login/signup pages
        navigate(redirectAuthenticatedTo);
      }
    }
  }, [
    user, 
    isLoading, 
    navigate, 
    requireAuth, 
    redirectAuthenticatedTo, 
    redirectUnauthenticatedTo,
    location.pathname
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Don't render anything if the user will be redirected
  if ((requireAuth && !user) || (!requireAuth && user)) {
    return null;
  }

  return <Outlet />;
};
