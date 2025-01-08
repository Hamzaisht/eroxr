import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthContainer } from "@/components/auth/layout/AuthContainer";
import { AuthHeader } from "@/components/auth/layout/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
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