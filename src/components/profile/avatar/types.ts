import { AvailabilityStatus } from "@/components/ui/availability-indicator";

export interface PresenceState {
  user_id: string;
  status: AvailabilityStatus;
  timestamp: string;
  presence_ref: string;
}

export interface ProfileAvatarProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}