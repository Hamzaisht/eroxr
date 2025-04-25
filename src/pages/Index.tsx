
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";

const Index = () => {
  const session = useSession();

  if (session === undefined) {
    return <LoadingScreen />;
  }

  // Redirect to /home if not logged in, this can be changed to any other page
  return <Navigate to="/home" replace />;
};

export default Index;
