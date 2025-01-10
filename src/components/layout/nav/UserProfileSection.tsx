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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    }
  };

  if (!session) return null;

  return (
    <div className="mt-auto px-4 space-y-4">
      <motion.div 
        className="cursor-pointer"
        onClick={() => navigate(`/profile/${session.user.id}`)}
      >
        <div className="relative group">
          <Avatar className="w-12 h-12 ring-2 ring-luxury-primary/20 transition-all duration-200 group-hover:ring-luxury-primary/40">
            <AvatarImage 
              src={profile?.avatar_url} 
              alt={profile?.username || "User"} 
            />
            <AvatarFallback className="bg-luxury-darker text-luxury-primary">
              {profile?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            <AvailabilityIndicator 
              status={(profile?.status as AvailabilityStatus) || "offline"}
              size={12}
            />
          </div>
        </div>
        {isExpanded && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm font-medium text-white/80 truncate"
          >
            {profile?.username || "Guest"}
          </motion.p>
        )}
      </motion.div>

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