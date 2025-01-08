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
      
      console.log("Checking admin status for user:", session.user.id);
      
      try {
        // Check admin role first
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        console.log("Admin check result:", adminRole);

        if (adminError) {
          console.error("Admin check error:", adminError);
          return;
        }

        if (adminRole) {
          console.log("Admin role found - setting admin status");
          setIsAdmin(true);
          setIsVerifiedCreator(true);
          toast({
            title: "Admin Access",
            description: "Full platform access granted",
          });
          return;
        }

        // If not admin, check verification status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id_verification_status')
          .eq('id', session.user.id)
          .maybeSingle();
        
        console.log("Profile verification check:", profile);

        if (profileError) {
          console.error("Profile check error:", profileError);
          return;
        }

        const isVerified = profile?.id_verification_status === 'verified';
        setIsVerifiedCreator(isVerified);
        
        if (isVerified) {
          toast({
            title: "Verified Creator",
            description: "You have access to the Eroboard",
          });
        }
      } catch (error) {
        console.error("Error in checkUserStatus:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check user status",
        });
      }
    };

    checkUserStatus();
  }, [session?.user?.id, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block space-y-4 fixed left-0 top-0 h-full bg-luxury-dark/95 backdrop-blur-sm border-r border-luxury-neutral/10 w-64 p-4"
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