import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Dot,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AvailabilityStatus } from "@/utils/media/types";
import { supabase } from "@/integrations/supabase/client";
import { getSafeProfile } from "@/utils/supabase/helpers";
import { ProfileStatus } from "@/utils/supabase/type-guards";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types/database.types";
import { updateProfileStatus } from "@/utils/supabase/db-helpers";

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
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Safely access profile data
  const safeProfile = getSafeProfile(profile);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    navigate("/login");
    toast({
      description: "You have been signed out.",
    });
  };

  const handleStatusChange = (status: AvailabilityStatus) => {
    updateUserStatus(status);
  };

  const updateUserStatus = async (newStatus: AvailabilityStatus) => {
    if (!session?.user?.id) return;
    
    try {
      // Convert the enum status to a valid database status value
      let dbStatus: ProfileStatus;
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
      
      await updateProfileStatus(session.user.id, dbStatus);
      
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={safeProfile?.avatar_url || ""} alt={safeProfile?.username || "User"} />
            <AvatarFallback>{safeProfile?.username?.slice(0, 2) || "Guest"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="grid gap-2 px-4 py-2">
          <p className="text-sm font-medium leading-none">{safeProfile?.username || "Guest"}</p>
          <p className="text-muted-foreground text-xs">
            {safeProfile?.email || "No email available"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <UserMenuItem label="Profile" icon={User} onClick={() => navigate('/profile')} />
        <UserMenuItem label="Activity" icon={Activity} />
        <UserMenuItem label="Settings" icon={Settings} onClick={() => navigate('/settings')} />
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <div className="flex items-center w-full cursor-pointer">
                <Dot className="mr-2 h-4 w-4" />
                Set Status
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Set Availability Status</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose the status you want to display to other users.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroup defaultValue={currentStatus.toString()} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" onClick={() => handleStatusChange(AvailabilityStatus.ONLINE)} />
                      <Label htmlFor="online">Online</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="away" id="away" onClick={() => handleStatusChange(AvailabilityStatus.AWAY)} />
                      <Label htmlFor="away">Away</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="busy" id="busy" onClick={() => handleStatusChange(AvailabilityStatus.BUSY)} />
                      <Label htmlFor="busy">Busy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offline" id="offline" onClick={() => handleStatusChange(AvailabilityStatus.OFFLINE)} />
                      <Label htmlFor="offline">Offline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invisible" id="invisible" onClick={() => handleStatusChange(AvailabilityStatus.INVISIBLE)} />
                      <Label htmlFor="invisible">Invisible</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setOpen(false)}>Save</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>
        <UserMenuItem label="Help" icon={HelpCircle} />
        <DropdownMenuSeparator />
        <UserMenuItem label="Sign Out" icon={ArrowRightFromLine} onClick={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
