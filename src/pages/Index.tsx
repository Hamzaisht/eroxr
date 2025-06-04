
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Landing from "@/pages/Landing";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, session, loading } = useAuth();
  
  console.log("Index page - auth state:", { 
    user: user ? "exists" : "null", 
    session: session ? "exists" : "null",
    loading 
  });

  // Show loading while session is being determined
  if (loading) {
    console.log("Index page - showing loading screen");
    return <LoadingScreen />;
  }

  // If authenticated, redirect to home
  if (session && user) {
    console.log("Index page - user authenticated, redirecting to home");
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show landing page
  console.log("Index page - showing landing page");
  return <Landing />;
};

export default Index;
