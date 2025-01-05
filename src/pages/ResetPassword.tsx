import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
      setIsLoading(false);
    };

    checkSession();
  }, [navigate, supabase.auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2A1F3D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2A1F3D] flex flex-col items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;