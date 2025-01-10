import { cn } from "@/lib/utils";

export interface AvailabilityIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  onClick?: (e: React.MouseEvent) => void;
}

export const AvailabilityIndicator = ({ status, onClick }: AvailabilityIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-3 h-3 rounded-full border-2 border-white cursor-pointer",
        getStatusColor()
      )}
    />
  );
};