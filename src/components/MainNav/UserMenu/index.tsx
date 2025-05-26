
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightFromLine,
  Settings,
  User,
  Activity,
  HelpCircle,
  LucideIcon,
  CircleUserRound,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getSafeProfile } from "@/utils/supabase/helpers";
import { ProfileStatus } from "@/utils/supabase/type-guards";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types/database.types";
import { updateProfileStatus } from "@/utils/supabase/db-helpers";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileKey = keyof ProfileRow;

interface UserMenuItemProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const UserMenuItem: React.FC<UserMenuItemProps> = ({ label, icon: Icon, onClick }) => {
  return (
    <DropdownMenuItem onClick={onClick}>
      <Icon className="mr-2 h-4 w-4" />
      <span>{label}</span>
    </DropdownMenuItem>
  );
};

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  // Fetch user profile data with proper typing
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select("*")
          .eq('id' as ProfileKey, session.user.id)
          .maybeSingle();
          
        if (error || !data) {
          console.error('Error fetching profile:', error || 'Invalid data');
          return null;
        }
        
        return data as ProfileRow;
      } catch (error) {
        console.error('Exception fetching profile:', error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  // Safely access profile data with runtime type checking
  const safeProfile = getSafeProfile(profile);

  const signOut = async () => {
    try {
      await supabaseClient.auth.signOut();
      navigate("/login");
      toast({
        description: "You have been signed out.",
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={""} alt={safeProfile?.username || "User"} />
            <AvatarFallback>{safeProfile?.username?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserMenuItem 
          label="Profile" 
          icon={CircleUserRound} 
          onClick={() => navigate(`/profile/${session?.user?.id}`)}
        />
        <UserMenuItem 
          label="Settings" 
          icon={Settings} 
          onClick={() => navigate("/settings")}
        />
        <UserMenuItem 
          label="Activity" 
          icon={Activity} 
          onClick={() => navigate("/activity")}
        />
        <UserMenuItem 
          label="Help" 
          icon={HelpCircle} 
          onClick={() => navigate("/help")}
        />
        <DropdownMenuSeparator />
        <UserMenuItem 
          label="Sign out" 
          icon={ArrowRightFromLine} 
          onClick={() => supabaseClient.auth.signOut().then(() => navigate("/login"))}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
