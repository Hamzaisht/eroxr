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
    // Check current session and handle token refresh
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error?.message?.includes('refresh_token_not_found')) {
          await supabase.auth.signOut();
          return;
        }
        
        if (session) {
          navigate("/home");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/home");
      } else if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        // Handle token refresh failure
        if (!session) {
          navigate("/login");
        }
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