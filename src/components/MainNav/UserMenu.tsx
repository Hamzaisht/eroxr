
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { AvailabilityStatus } from "@/utils/media/types";

export const UserMenu = () => {
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
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => {
    navigate("/login");
    toast({
      title: "Join our community!",
      description: "Create your account to get started.",
    });
  };

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      console.log("Sign out successful");
      navigate("/login");
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
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

  // Convert AvailabilityStatus to the subset used by the component
  const handleStatusChange = async (newStatus: AvailabilityStatus) => {
    // Make sure we only use statuses compatible with the profile table
    const safeStatus: AvailabilityStatus = 
      newStatus === AvailabilityStatus.INVISIBLE ? AvailabilityStatus.OFFLINE : newStatus;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: safeStatus })
        .eq('id', session?.user?.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `You are now ${safeStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "Please try again later",
      });
    }
  };

  const navigateToProfile = () => {
    if (session?.user?.id) {
      navigate(`/profile/${session.user.id}`);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={handleLogin}
          className="hover:bg-white/5"
        >
          Log in
        </Button>
        <Button 
          onClick={handleSignUp}
          className="bg-white/10 hover:bg-white/20"
        >
          Sign up
        </Button>
      </div>
    );
  }

  // Get safe status from profile with fallback to offline
  const currentStatus = (profile?.status as AvailabilityStatus) || AvailabilityStatus.OFFLINE;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">
          @{profile?.username || session.user.email?.split('@')[0] || 'Guest'}
        </span>
        <Badge variant="outline" className="text-xs">
          {profile?.is_paying_customer ? 'Premium' : 'Free'}
        </Badge>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full p-0"
            onClick={navigateToProfile}
          >
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage 
                src={profile?.avatar_url} 
                alt={profile?.username || 'User avatar'} 
              />
              <AvatarFallback>
                {session.user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <AvailabilityIndicator 
                status={currentStatus} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(currentStatus === AvailabilityStatus.ONLINE ? AvailabilityStatus.OFFLINE : AvailabilityStatus.ONLINE);
                }}
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/profile/${session.user.id}`)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dating")}>
            Dating Ads
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
