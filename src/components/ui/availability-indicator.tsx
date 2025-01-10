import { cn } from "@/lib/utils";

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export const AvailabilityIndicator = ({ 
  status, 
  size = 10,
  onClick 
}: AvailabilityIndicatorProps) => {
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
        "rounded-full border-2 border-white cursor-pointer",
        getStatusColor()
      )}
      style={{ 
        width: size, 
        height: size 
      }}
    />
  );
};