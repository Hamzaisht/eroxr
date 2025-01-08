import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthHeader } from "@/components/auth/layout/AuthHeader";
import { AuthContainer } from "@/components/auth/layout/AuthContainer";
import { AuthFooter } from "@/components/auth/layout/AuthFooter";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignup, setIsSignup] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <AuthLayout>
      <AuthHeader />
      <AuthContainer>
        <SignupForm onToggleMode={handleToggleMode} />
      </AuthContainer>
      <AuthFooter />
    </AuthLayout>
  );
};

export default Login;