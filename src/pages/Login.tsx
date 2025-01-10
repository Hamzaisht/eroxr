import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Hero } from "@/components/Hero";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
  }, [session, navigate, toast]);

  return <Hero />;
};

export default Login;