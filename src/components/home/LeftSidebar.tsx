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
      
      console.log("Checking user status for:", session.user.id);
      
      // Check verification and premium status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id_verification_status, is_paying_customer')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }

      console.log("Profile data:", profile);
      
      if (profile) {
        const isVerified = profile.id_verification_status === 'verified';
        console.log("Is verified creator:", isVerified);
        setIsVerifiedCreator(isVerified);
      }

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError) {
        console.error("Error fetching role:", roleError);
        return;
      }

      if (roleData) {
        setIsAdmin(true);
        console.log("User is admin");
      }
    };

    checkUserStatus();
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