
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { DropdownProps } from "react-day-picker";

interface DateOfBirthFieldProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const DateOfBirthField = ({ form, isLoading }: DateOfBirthFieldProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();
      
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (adjustedAge >= 18) {
        setDate(selectedDate);
        form.setValue('dateOfBirth', format(selectedDate, 'yyyy-MM-dd'));
        setOpen(false);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-12 px-4 text-left font-normal flex items-center gap-3",
                    "bg-black/10 border-luxury-primary/20",
                    "hover:bg-luxury-primary/10",
                    "transition-all duration-300 ease-in-out",
                    "focus:ring-2 focus:ring-luxury-primary/30",
                    !field.value && "text-muted-foreground",
                    "hover:border-luxury-primary"
                  )}
                >
                  <Calendar className="h-5 w-5 text-luxury-primary" />
                  {field.value ? (
                    <span className="text-white">{format(new Date(field.value), "MMMM d, yyyy")}</span>
                  ) : (
                    <span className="text-white/50">Date of Birth</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-4 bg-[#1e1e1e] border border-luxury-primary/20 shadow-xl backdrop-blur-sm z-[999]"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={handleSelect}
                  disabled={(date) => {
                    const today = new Date();
                    const minDate = new Date();
                    minDate.setFullYear(today.getFullYear() - 100);
                    const maxDate = new Date();
                    maxDate.setFullYear(today.getFullYear() - 18);
                    return date > maxDate || date < minDate;
                  }}
                  initialFocus
                  className="rounded-md border-luxury-primary/20"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center gap-4 bg-[#1e1e1e]",
                    caption_label: "text-base font-medium text-white bg-[#1e1e1e]",
                    nav: "flex items-center gap-1",
                    nav_button: cn(
                      "h-8 w-8 bg-luxury-primary/10 text-luxury-primary rounded-full",
                      "hover:bg-luxury-primary/20 transition-colors duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-luxury-primary/30"
                    ),
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: cn(
                      "text-luxury-primary rounded-md w-10 font-medium text-[0.9rem]",
                      "uppercase tracking-wider text-center"
                    ),
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                    ),
                    day: cn(
                      "h-10 w-10 p-0 font-normal bg-[#1e1e1e] text-white aria-selected:opacity-100",
                      "hover:bg-luxury-primary hover:text-white rounded-full transition-colors duration-200",
                      "focus:bg-luxury-primary focus:text-white focus:outline-none focus:ring-2 focus:ring-luxury-primary/30",
                      "aria-selected:bg-luxury-primary aria-selected:text-white"
                    ),
                    day_selected: "bg-luxury-primary text-white hover:bg-luxury-primary hover:text-white",
                    day_today: "bg-luxury-accent/10 text-luxury-accent font-semibold",
                    day_outside: "bg-[#1e1e1e] text-white/30",
                    day_disabled: "bg-[#1e1e1e] text-white/20",
                    day_range_middle: "aria-selected:bg-luxury-primary/20",
                    day_hidden: "invisible",
                  }}
                  components={{
                    Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
                      const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
                        if (onChange) {
                          const selectedValue = event.target.value;
                          const fakeEvent = {
                            ...event,
                            target: {
                              ...event.target,
                              value: selectedValue
                            }
                          };
                          onChange(fakeEvent);
                          
                          if (field.value) {
                            const currentDate = new Date(field.value);
                            if (props.name === 'month') {
                              currentDate.setMonth(parseInt(selectedValue));
                            } else if (props.name === 'year') {
                              currentDate.setFullYear(parseInt(selectedValue));
                            }
                            handleSelect(currentDate);
                          }
                        }
                      };

                      return (
                        <div className="relative bg-[#1e1e1e]">
                          <select
                            value={value}
                            onChange={handleChange}
                            className={cn(
                              "appearance-none",
                              "w-full px-3 py-2 rounded-md",
                              "bg-[#1e1e1e] text-white",
                              "border border-luxury-primary/20",
                              "focus:outline-none focus:ring-2 focus:ring-luxury-primary/30",
                              "hover:border-luxury-primary transition-colors duration-200",
                              "cursor-pointer min-w-[110px]",
                              "text-sm font-medium",
                              "[&>option]:bg-[#1e1e1e] [&>option]:text-white [&>option]:py-1"
                            )}
                            style={{
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              backgroundColor: '#1e1e1e'
                            }}
                            {...props}
                          >
                            {children}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-luxury-primary">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      );
                    }
                  }}
                  showOutsideDays={false}
                  captionLayout="dropdown"
                  fromYear={1924}
                  toYear={2006}
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
