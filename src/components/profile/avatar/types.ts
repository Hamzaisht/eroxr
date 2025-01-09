export type AvailabilityStatus = "online" | "offline" | "away" | "busy";

export interface PresenceState {
  user_id: string;
  status: AvailabilityStatus;
  timestamp: string;
}

export interface UsePresenceReturn {
  availability: AvailabilityStatus;
  setAvailability: React.Dispatch<React.SetStateAction<AvailabilityStatus>>;
  setIsInCall: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessaging: React.Dispatch<React.SetStateAction<boolean>>;
  lastActive?: string;
}