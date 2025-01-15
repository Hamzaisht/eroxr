import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-luxury-neutral/80">
            Sign in to continue to your account
          </p>
        </div>
        <AuthForm />
      </motion.div>
    </AuthLayout>
  );
};

export default Login;