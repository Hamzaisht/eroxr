import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type TimeFrame = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface TimeframeFilterProps {
  value: TimeFrame;
  onChange: (timeframe: TimeFrame) => void;
  className?: string;
}

const timeframeOptions = [
  { value: '1D' as TimeFrame, label: 'Last 24 Hours', badge: '24h' },
  { value: '1W' as TimeFrame, label: 'Last 7 Days', badge: '7d' },
  { value: '1M' as TimeFrame, label: 'Last 30 Days', badge: '30d' },
  { value: '1Y' as TimeFrame, label: 'Last Year', badge: '1y' },
  { value: 'ALL' as TimeFrame, label: 'All Time', badge: 'all' }
];

export const TimeframeFilter = ({ value, onChange, className = "" }: TimeframeFilterProps) => {
  const currentOption = timeframeOptions.find(opt => opt.value === value);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Timeframe:</span>
      </div>
      
      {/* Desktop Select */}
      <div className="hidden md:block">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-48 bg-card/50 border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {timeframeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <span>{option.label}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {option.badge}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Buttons */}
      <div className="flex md:hidden gap-1 flex-wrap">
        {timeframeOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className={`text-xs ${
              value === option.value 
                ? "bg-primary text-primary-foreground" 
                : "bg-card/50 border-border/50 hover:bg-card/80"
            }`}
          >
            {option.badge}
          </Button>
        ))}
      </div>

      {/* Current Selection Badge */}
      <Badge variant="secondary" className="hidden lg:flex bg-primary/20 text-primary border-primary/30">
        {currentOption?.badge.toUpperCase()}
      </Badge>
    </div>
  );
};