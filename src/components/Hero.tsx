import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuthForm } from "./auth/AuthForm";

export const Hero = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/"); // Changed from "/home" to "/"
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-luxury-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-transparent rounded-2xl" />
          <div className="relative">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Welcome to EROXR
              </h1>
              <p className="text-luxury-neutral/80 mt-2">
                Join our exclusive community
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
};