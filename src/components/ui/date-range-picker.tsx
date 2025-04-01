
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange as DateRangeType } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Export DateRange type for use in other components
export type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  className?: string;
  value?: DateRangeType;
  onChange?: (date: DateRangeType | undefined) => void;
  // Support for older API
  from?: Date;
  to?: Date;
  onSelect?: (range: { from: Date | null; to: Date | null }) => void;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  from,
  to,
  onSelect,
}: DateRangePickerProps) {
  // Determine which API is being used
  const isUsingLegacyAPI = from !== undefined || to !== undefined;
  
  // Create a value object from legacy props if needed
  const rangeValue = isUsingLegacyAPI
    ? { from: from || null, to: to || null }
    : value;
    
  // Handle changes appropriately based on which API is used
  const handleSelect = (newRange: DateRangeType | undefined) => {
    if (isUsingLegacyAPI && onSelect) {
      // Need to ensure we're passing the correct format for legacy API
      onSelect(newRange ? { from: newRange.from, to: newRange.to || null } : { from: null, to: null });
    } else if (onChange) {
      onChange(newRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !rangeValue?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {rangeValue?.from ? (
              rangeValue.to ? (
                <>
                  {format(rangeValue.from, "LLL dd, y")} -{" "}
                  {format(rangeValue.to, "LLL dd, y")}
                </>
              ) : (
                format(rangeValue.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={rangeValue?.from}
            selected={rangeValue}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
