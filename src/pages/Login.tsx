import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/home", { replace: true });
    }
  }, [session, navigate]);

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Login;