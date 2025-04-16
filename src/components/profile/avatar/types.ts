
import { Profile } from "../types";

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy';

export interface PresenceState {
  user_id: string;
  status: AvailabilityStatus;
  timestamp: string;
  presence_ref?: string;
}

export interface ProfileAvatarProps {
  profile: Profile;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export interface UsePresenceReturn {
  availability: AvailabilityStatus;
  setAvailability: React.Dispatch<React.SetStateAction<AvailabilityStatus>>;
  setIsInCall: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessaging: React.Dispatch<React.SetStateAction<boolean>>;
  lastActive?: string;
}
