import { BarChart2, Bell, Shield, Users } from "lucide-react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        // Check admin role
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();

        if (adminError) throw adminError;

        if (adminRole) {
          setIsAdmin(true);
          setIsVerifiedCreator(true);
          return;
        }

        // If not admin, check verification status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id_verification_status')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        setIsVerifiedCreator(profile?.id_verification_status === 'verified');

      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, [session?.user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-0 top-0 h-full bg-luxury-dark/95 backdrop-blur-sm border-r border-luxury-neutral/10 w-64 p-4 z-50"
    >
      <div className="space-y-2">
        <div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-luxury-neutral/5 transition-colors cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Bell className="h-5 w-5 text-luxury-neutral" />
          <span className="font-medium">News Feed</span>
        </div>

        {(isAdmin || isVerifiedCreator) && (
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

        {isAdmin && (
          <>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-500">User Management</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/moderation')}
            >
              <Shield className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-500">Content Moderation</span>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};