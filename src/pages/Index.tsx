
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import Landing from "@/pages/Landing";

const Index = () => {
  const session = useSession();

  if (session === undefined) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Landing />;
  }

  return <Navigate to="/home" replace />;
};

export default Index;
