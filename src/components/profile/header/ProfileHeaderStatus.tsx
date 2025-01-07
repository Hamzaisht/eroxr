import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileHeaderStatusProps {
  isOwnProfile: boolean;
  availability: AvailabilityStatus;
  setAvailability: (status: AvailabilityStatus) => void;
}

export const ProfileHeaderStatus = ({
  isOwnProfile,
  availability,
  setAvailability,
}: ProfileHeaderStatusProps) => {
  const updateStatus = async (newStatus: AvailabilityStatus) => {
    setAvailability(newStatus);
  };

  return (
    <div className="absolute -bottom-2 -right-2">
      {isOwnProfile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1.5 h-auto rounded-full bg-white shadow-md hover:bg-white/90">
              <AvailabilityIndicator status={availability} size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => updateStatus("online")} className="gap-2">
              <AvailabilityIndicator status="online" size={12} />
              <span>Online</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("away")} className="gap-2">
              <AvailabilityIndicator status="away" size={12} />
              <span>Away</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("busy")} className="gap-2">
              <AvailabilityIndicator status="busy" size={12} />
              <span>Busy</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus("offline")} className="gap-2">
              <AvailabilityIndicator status="offline" size={12} />
              <span>Appear Offline</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="p-1.5 rounded-full bg-white shadow-md">
          <AvailabilityIndicator status={availability} size={16} />
        </div>
      )}
    </div>
  );
};