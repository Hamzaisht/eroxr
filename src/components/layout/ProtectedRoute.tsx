
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { useToast } from '@/hooks/use-toast';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Only redirect after initial loading is complete
    if (!isLoading) {
      if (!user) {
        console.log('Access denied: Authentication required', location.pathname);
        toast({
          title: "Authentication required",
          description: "You must be logged in to access this page",
          variant: "destructive",
        });
        
        // Save the current path for redirect after login
        setRedirectPath(location.pathname);
        
        // Redirect to login with return path
        navigate('/login', { 
          state: { from: location.pathname }
        });
      } else {
        // User is authenticated, mark initial check as complete
        setIsInitialCheck(false);
        
        // If we have a saved redirect path and user is logged in, navigate there
        if (redirectPath) {
          navigate(redirectPath);
          setRedirectPath(null);
        }
      }
    }
  }, [user, isLoading, navigate, location.pathname, toast, redirectPath]);

  // Show loading screen during initial auth check or loading state
  if (isLoading || (isInitialCheck && !user)) {
    return <LoadingScreen />;
  }

  // Only render the outlet when authenticated
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
