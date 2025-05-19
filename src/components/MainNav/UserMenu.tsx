
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
import { User, Settings, CreditCard, ArrowRightFromLine, Loader2, CircleUserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  convertToStatus,
  getSafeProfile
} from "@/utils/supabase/helpers";
import { safeProfileUpdate } from "@/utils/supabase/type-guards";
import { AvailabilityStatus } from "@/utils/media/types";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types/database.types";

export function UserMenu() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatus>(AvailabilityStatus.OFFLINE);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq("id", session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Extract profile data safely with better error handling
  const safeProfile = getSafeProfile(profile);

  // Initialize status from profile data
  useState(() => {
    if (safeProfile?.status) {
      setCurrentStatus(convertToStatus(safeProfile.status));
    }
  });

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await supabaseClient.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const statusOptions = [
    { value: AvailabilityStatus.ONLINE, label: "Online" },
    { value: AvailabilityStatus.AWAY, label: "Away" },
    { value: AvailabilityStatus.BUSY, label: "Busy" },
    { value: AvailabilityStatus.INVISIBLE, label: "Invisible" },
    { value: AvailabilityStatus.OFFLINE, label: "Offline" },
  ];

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.ONLINE:
        return "text-green-500";
      case AvailabilityStatus.AWAY:
        return "text-yellow-500";
      case AvailabilityStatus.BUSY:
        return "text-red-500";
      case AvailabilityStatus.INVISIBLE:
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const updateUserStatus = async (newStatus: AvailabilityStatus) => {
    if (!session?.user?.id) return;
    
    try {
      // Convert the enum status to a valid database status value
      let dbStatus: Database["public"]["Tables"]["profiles"]["Update"]["status"];
      switch (newStatus) {
        case AvailabilityStatus.ONLINE:
          dbStatus = "online";
          break;
        case AvailabilityStatus.AWAY:
          dbStatus = "away";
          break;
        case AvailabilityStatus.BUSY:
          dbStatus = "busy";
          break;
        case AvailabilityStatus.INVISIBLE:
        case AvailabilityStatus.OFFLINE:
          dbStatus = "offline";
          break;
        default:
          dbStatus = "offline";
      }
      
      const updates = safeProfileUpdate({ status: dbStatus });
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq("id", session.user.id);
        
      if (error) {
        console.error('Error updating status:', error);
        return;
      }
      
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={safeProfile?.avatar_url || ""} alt={safeProfile?.username || "User"} />
            <AvatarFallback>{safeProfile?.username?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
          </Avatar>
          <AvailabilityIndicator status={currentStatus} className="absolute bottom-0 right-0" onClick={(e) => e.stopPropagation()} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/profile/${session?.user?.id}`)}>
          <CircleUserRound className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/subscription")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} disabled={isSigningOut}>
          <ArrowRightFromLine className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? "Signing Out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
