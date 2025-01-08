import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";

interface ProfileHeaderStatusProps {
  isOwnProfile: boolean;
  availability: AvailabilityStatus;
}

export const ProfileHeaderStatus = ({
  isOwnProfile,
  availability,
}: ProfileHeaderStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <AvailabilityIndicator status={availability} size={12} />
      <span className="text-sm text-luxury-neutral/60">
        {availability.charAt(0).toUpperCase() + availability.slice(1)}
      </span>
    </div>
  );
};