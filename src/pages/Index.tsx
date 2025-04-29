
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Landing from "@/pages/Landing";

const Index = () => {
  const session = useSession();
  
  console.log("Index page - session:", session ? "exists" : "undefined/null");

  // Show loading while session is being determined
  if (session === undefined) {
    return <LoadingScreen />;
  }

  // If not authenticated, show landing page
  if (!session) {
    return <Landing />;
  }

  // If authenticated, redirect to home
  return <Navigate to="/home" replace />;
};

export default Index;
