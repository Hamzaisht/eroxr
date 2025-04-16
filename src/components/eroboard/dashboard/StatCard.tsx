
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, CircleArrowUp, CircleArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  isMoney?: boolean;
  isPercent?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  isMoney = false,
  isPercent = false,
  isLoading = false,
  className
}: StatCardProps) => {
  let displayValue = value;

  if (isMoney) {
    // Format as money
    displayValue = typeof value === 'number' 
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : value;
  } else if (isPercent) {
    // Format as percentage
    displayValue = typeof value === 'number'
      ? `${value.toFixed(1)}%`
      : value;
  } else if (typeof value === 'number') {
    // Format regular number with commas for thousands
    displayValue = value.toLocaleString('en-US');
  }

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="animate-pulse h-4 bg-luxury-darker/50 rounded w-24"></div>
            <div className="animate-pulse h-8 bg-luxury-darker/50 rounded w-32"></div>
            <div className="animate-pulse h-4 bg-luxury-darker/50 rounded w-20"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{displayValue}</div>
            
            {trend !== undefined && (
              <div className="flex items-center space-x-1">
                {trend > 0 ? (
                  <>
                    <CircleArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+{trend.toFixed(1)}%</span>
                  </>
                ) : trend < 0 ? (
                  <>
                    <CircleArrowDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">{trend.toFixed(1)}%</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No change</span>
                )}
              </div>
            )}
          </div>

          <div className="rounded-full bg-muted p-2 h-10 w-10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
