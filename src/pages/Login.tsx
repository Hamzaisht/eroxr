import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthContainer } from "@/components/auth/layout/AuthContainer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useSession } from "@supabase/auth-helpers-react";

const Login = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <AuthLayout>
      <AuthContainer>
        <AuthForm />
      </AuthContainer>
    </AuthLayout>
  );
};

export default Login;