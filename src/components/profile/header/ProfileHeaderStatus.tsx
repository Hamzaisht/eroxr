import { AvailabilityStatus } from "@/components/ui/availability-indicator";

interface ProfileHeaderStatusProps {
  isOwnProfile: boolean;
  availability: AvailabilityStatus;
  setAvailability: (status: AvailabilityStatus) => void;
}

export const ProfileHeaderStatus = ({
  isOwnProfile,
  availability,
  setAvailability
}: ProfileHeaderStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        availability === 'online' ? 'bg-green-500' :
        availability === 'away' ? 'bg-yellow-500' :
        'bg-gray-500'
      }`} />
      <span className="text-sm text-gray-600">
        {availability.charAt(0).toUpperCase() + availability.slice(1)}
      </span>
    </div>
  );
};