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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightOnRectangle,
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
import { toDbValue } from "@/utils/supabase/helpers";

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
  const router = useRouter();
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
        .eq('id', toDbValue(session.user.id))
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
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
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })  // Pass the status as a simple string
        .eq('id', toDbValue(session.user.id));
        
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
            <AvatarFallback>{profile?.username?.slice(0, 2) || "Guest"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="grid gap-2 px-4 py-2">
          <p className="text-sm font-medium leading-none">{profile?.username || "Guest"}</p>
          <p className="text-muted-foreground text-xs">
            {profile?.email || "No email available"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <UserMenuItem label="Profile" icon={User} onClick={() => router.push('/profile')} />
        <UserMenuItem label="Activity" icon={Activity} />
        <UserMenuItem label="Settings" icon={Settings} onClick={() => router.push('/settings')} />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Dot className="mr-2 h-4 w-4" />
                Set Status
              </DropdownMenuItem>
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
                  <RadioGroup defaultValue={currentStatus} className="flex flex-col space-y-1">
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
                <AlertDialogAction>Save</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>
        <UserMenuItem label="Help" icon={HelpCircle} />
        <DropdownMenuSeparator />
        <UserMenuItem label="Sign Out" icon={ArrowRightOnRectangle} onClick={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
