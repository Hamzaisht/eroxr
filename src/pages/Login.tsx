import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/home");
    }
  }, [session, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2A1F3D] flex flex-col items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Login;