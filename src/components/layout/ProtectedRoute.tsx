
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { useToast } from '@/hooks/use-toast';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to access this page",
        variant: "destructive",
      });
      
      // Redirect to login with return path
      navigate('/login', { 
        state: { from: location.pathname }
      });
    }
  }, [user, isLoading, navigate, location.pathname, toast]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Only render the outlet when authenticated
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
