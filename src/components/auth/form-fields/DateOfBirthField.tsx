
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
      
      // Adjust age if birthday hasn't occurred this year
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
                    "bg-white/5 border-luxury-primary/20 hover:bg-white/10",
                    "transition-all duration-300 ease-in-out",
                    "focus:ring-2 focus:ring-luxury-primary/30",
                    !field.value && "text-muted-foreground",
                    "hover:border-luxury-primary hover:bg-luxury-primary/5"
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
                className="w-auto p-4 bg-[#161B22] border border-luxury-primary/20 shadow-xl backdrop-blur-sm"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={handleSelect}
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
                    caption: "flex justify-center pt-1 relative items-center gap-4",
                    caption_label: "text-base font-medium text-white",
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
                      "h-10 w-10 p-0 font-normal text-white/90 aria-selected:opacity-100",
                      "hover:bg-luxury-primary hover:text-white rounded-full transition-colors duration-200",
                      "focus:bg-luxury-primary focus:text-white focus:outline-none focus:ring-2 focus:ring-luxury-primary/30",
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
                          
                          // Force rerender of calendar when month/year changes
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
                        <select
                          value={value}
                          onChange={handleChange}
                          className={cn(
                            "bg-[#0D1117] text-white border border-luxury-primary/20 rounded-md",
                            "px-3 py-1.5 text-sm font-medium",
                            "focus:outline-none focus:ring-2 focus:ring-luxury-primary/30",
                            "hover:border-luxury-primary transition-colors duration-200",
                            "cursor-pointer appearance-none min-w-[110px]",
                            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%239b87f5%22%3E%3Cpath%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')]",
                            "bg-[position:right_0.5rem_center] bg-no-repeat bg-[length:1.5em_1.5em]",
                            "pr-8 mx-1",
                            "option:bg-[#0D1117] option:text-white"
                          )}
                          {...props}
                        >
                          {children}
                        </select>
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
