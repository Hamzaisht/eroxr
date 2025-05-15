
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { applyEqualsFilter, convertToStatus, getSafeProfile } from "@/utils/supabase/helpers";

interface UserProfileSectionProps {
  isExpanded: boolean;
}

export const UserProfileSection = ({ isExpanded }: UserProfileSectionProps) => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const query = supabase
          .from("profiles")
          .select("*");
          
        const { data, error } = await applyEqualsFilter(query, "id", session.user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error("Profile fetch error:", error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  // Get safe profile data with better error handling
  const safeProfile = getSafeProfile(profile);
  
  // Extract status safely with a fallback
  const currentStatus = safeProfile?.status ? 
    convertToStatus(safeProfile.status) : 
    AvailabilityStatus.OFFLINE;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Please try again later",
      });
    }
  };

  if (!session) return null;

  return (
    <div className="mt-auto px-4 space-y-4">
      <div className="flex items-center gap-3">
        <motion.div 
          className="relative cursor-pointer"
          onClick={() => navigate(`/profile/${session.user.id}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="w-12 h-12 ring-2 ring-luxury-primary/20 transition-all duration-200 hover:ring-luxury-primary/40">
            <AvatarImage 
              src={safeProfile?.avatar_url} 
              alt={safeProfile?.username || "User"} 
            />
            <AvatarFallback className="bg-luxury-darker text-luxury-primary">
              {safeProfile?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {isExpanded && (
          <div className="flex flex-col">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium text-white/80 truncate"
            >
              {safeProfile?.username || "Guest"}
            </motion.p>
            <div className="flex items-center gap-2">
              <AvailabilityIndicator 
                status={currentStatus}
                size={8}
              />
              <span className="text-xs text-white/60">
                {currentStatus}
              </span>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
      >
        <LogOut className="w-5 h-5" />
        {isExpanded && "Log out"}
      </Button>
    </div>
  );
};
