
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Landing from "@/pages/Landing";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorState } from "@/components/ui/ErrorState";

const Index = () => {
  const { user, session, loading, error, clearError } = useAuth();
  
  console.log("📍 Index page - Current state:", { 
    user: user ? "exists" : "null", 
    session: session ? "exists" : "null",
    loading,
    error: error || "none"
  });

  // Show loading while session is being determined
  if (loading) {
    console.log("📍 Index page - Showing loading screen");
    return <LoadingScreen />;
  }

  // Show error state if there's an authentication error
  if (error) {
    console.log("📍 Index page - Showing error state:", error);
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <ErrorState 
          title="Authentication Error"
          description={error}
          onRetry={clearError}
        />
      </div>
    );
  }

  // If authenticated, redirect to home
  if (session && user) {
    console.log("📍 Index page - User authenticated, redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show landing page
  console.log("📍 Index page - No auth, showing landing page");
  return <Landing />;
};

export default Index;
