import { Bell, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const LeftSidebar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [isVerifiedCreator, setIsVerifiedCreator] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id_verification_status')
        .eq('id', session.user.id)
        .single();
      
      if (!error && data) {
        setIsVerifiedCreator(data.id_verification_status === 'verified');
      }
    };

    checkVerificationStatus();
  }, [session?.user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block space-y-4"
    >
      <div className="sticky top-4 space-y-2">
        <div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-luxury-neutral/5 transition-colors cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Bell className="h-5 w-5 text-luxury-neutral" />
          <span className="font-medium">News Feed</span>
        </div>

        {isVerifiedCreator && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-luxury-primary/10 transition-colors cursor-pointer"
            onClick={() => navigate('/eroboard')}
          >
            <BarChart2 className="h-5 w-5 text-luxury-primary" />
            <span className="font-medium text-luxury-primary">Eroboard</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};