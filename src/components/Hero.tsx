import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthForm } from "./auth/AuthForm";

export const Hero = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};