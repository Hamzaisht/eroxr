import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthContainer } from "@/components/auth/layout/AuthContainer";
import { AuthHeader } from "@/components/auth/layout/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/home");
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthLayout>
      <AuthHeader />
      <AuthContainer>
        <AuthForm />
      </AuthContainer>
    </AuthLayout>
  );
};

export default Login;