
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState, ChangeEvent } from "react";
import { SelectSingleEventHandler } from "react-day-picker";

interface DateOfBirthFieldProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const DateOfBirthField = ({ form, isLoading }: DateOfBirthFieldProps) => {
  const [date, setDate] = useState<Date>();

  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-12 px-4 text-left font-normal flex items-center gap-3",
                    "bg-white/5 border-luxury-primary/20 hover:bg-white/10",
                    "transition-all duration-300 ease-in-out",
                    "focus:ring-2 focus:ring-luxury-primary/30",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <Calendar className="h-5 w-5 text-luxury-neutral/50" />
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span className="text-white/50">Date of Birth</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-[#161B22] border border-luxury-primary/20"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(format(date, 'yyyy-MM-dd'));
                      setDate(date);
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    const minDate = new Date();
                    minDate.setFullYear(today.getFullYear() - 100); // Max age 100
                    const maxDate = new Date();
                    maxDate.setFullYear(today.getFullYear() - 18); // Min age 18
                    return date > maxDate || date < minDate;
                  }}
                  initialFocus
                  className="rounded-md border-luxury-primary/20"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center gap-1",
                    caption_label: "text-sm font-medium text-luxury-neutral",
                    nav: "flex items-center gap-1",
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 text-luxury-neutral",
                      "hover:bg-luxury-primary/20 rounded-full transition-colors"
                    ),
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: cn(
                      "text-luxury-neutral rounded-md w-9 font-normal text-[0.8rem]",
                      "uppercase tracking-wider text-center"
                    ),
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                    ),
                    day: cn(
                      "h-9 w-9 p-0 font-normal text-white/90",
                      "hover:bg-luxury-primary hover:text-white rounded-full transition-colors",
                      "focus:bg-luxury-primary focus:text-white",
                      "aria-selected:bg-luxury-primary aria-selected:text-white"
                    ),
                    day_selected: "bg-luxury-primary text-white hover:bg-luxury-primary hover:text-white",
                    day_today: "bg-luxury-accent/10 text-luxury-accent font-semibold",
                    day_outside: "text-luxury-neutral/30",
                    day_disabled: "text-luxury-neutral/20",
                    day_range_middle: "aria-selected:bg-luxury-primary/20",
                    day_hidden: "invisible",
                  }}
                  components={{
                    Dropdown: ({ value, onChange, children, ...props }) => (
                      <select
                        value={value}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          if (onChange) {
                            onChange(e.target.value);
                          }
                        }}
                        className="bg-[#161B22] text-white/90 border border-luxury-primary/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-primary/30"
                        {...props}
                      >
                        {children}
                      </select>
                    ),
                  }}
                  showOutsideDays={false}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage className="text-sm text-red-400" />
        </FormItem>
      )}
    />
  );
};
