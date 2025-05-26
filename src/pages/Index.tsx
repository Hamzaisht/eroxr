
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Landing from "@/pages/Landing";
import { useEffect, useState } from "react";

const Index = () => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Give the session time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    console.log("Index page - session:", session ? "exists" : "undefined/null");
  }, [session]);

  // Show loading while session is being determined
  if (isLoading && session === undefined) {
    return <LoadingScreen />;
  }

  // If authenticated, redirect to home
  if (session) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show landing page
  return <Landing />;
};

export default Index;
