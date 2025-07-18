import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { DropdownProps } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/hooks/use-toast";

interface DateOfBirthFieldProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const DateOfBirthField = ({ form, isLoading }: DateOfBirthFieldProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [canChange, setCanChange] = useState(true);
  const [lastChanged, setLastChanged] = useState<string | null>(null);
  const { user } = useCurrentUser();

  // Check if user can change DOB (6 month restriction)
  useEffect(() => {
    const checkDOBChangeEligibility = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase.rpc('can_change_dob', {
          user_id: user.id
        });

        if (error) throw error;
        setCanChange(data);

        // Get last change date for display
        const { data: profile } = await supabase
          .from('profiles')
          .select('last_dob_change')
          .eq('id', user.id)
          .single();

        if (profile?.last_dob_change) {
          setLastChanged(profile.last_dob_change);
        }
      } catch (error) {
        console.error('Error checking DOB change eligibility:', error);
      }
    };

    checkDOBChangeEligibility();
  }, [user?.id]);

  const handleSelect = async (selectedDate: Date | undefined) => {
    if (selectedDate && canChange) {
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();
      
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (adjustedAge >= 18) {
        setDate(selectedDate);
        form.setValue('dateOfBirth', format(selectedDate, 'yyyy-MM-dd'));
        
        // Update last DOB change timestamp in database
        if (user?.id) {
          try {
            await supabase
              .from('profiles')
              .update({ 
                date_of_birth: format(selectedDate, 'yyyy-MM-dd'),
                last_dob_change: new Date().toISOString()
              })
              .eq('id', user.id);

            setCanChange(false);
            setLastChanged(new Date().toISOString());
            
            toast({
              title: "Date of Birth Updated",
              description: "Your date of birth has been saved. You can change it again in 6 months.",
            });
          } catch (error) {
            console.error('Error updating DOB:', error);
            toast({
              title: "Error",
              description: "Failed to update date of birth",
              variant: "destructive"
            });
          }
        }
        
        setOpen(false);
      } else {
        toast({
          title: "Age Requirement",
          description: "You must be at least 18 years old to use this platform.",
          variant: "destructive"
        });
      }
    } else if (!canChange) {
      toast({
        title: "Cannot Change",
        description: "You can only change your date of birth once every 6 months.",
        variant: "destructive"
      });
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
                  disabled={isLoading || !canChange}
                  className={cn(
                    "group relative w-full h-14 px-4 text-left font-normal flex items-center gap-3 overflow-hidden",
                    "bg-gradient-to-br from-luxury-primary/5 via-black/10 to-luxury-accent/5",
                    "border border-luxury-primary/20 backdrop-blur-sm",
                    "hover:border-luxury-primary/40 hover:from-luxury-primary/10 hover:to-luxury-accent/10",
                    "transition-all duration-500 ease-out transform",
                    "focus:ring-2 focus:ring-luxury-primary/30 focus:scale-[1.02]",
                    !field.value && "text-muted-foreground",
                    !canChange && "opacity-60 cursor-not-allowed",
                    "shadow-lg hover:shadow-luxury-primary/20"
                  )}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/0 via-luxury-primary/5 to-luxury-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Sparkle effect */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="h-3 w-3 text-luxury-accent animate-pulse" />
                  </div>
                  
                  <Calendar className={cn(
                    "h-5 w-5 transition-all duration-300",
                    field.value ? "text-luxury-accent" : "text-luxury-primary",
                    "group-hover:scale-110 group-hover:rotate-12"
                  )} />
                  
                  <div className="flex-1">
                    {field.value ? (
                      <div className="space-y-1">
                        <span className="text-white font-medium text-base">
                          {format(new Date(field.value), "MMMM d, yyyy")}
                        </span>
                        {!canChange && lastChanged && (
                          <div className="text-xs text-luxury-accent/70">
                            Next change available: {format(new Date(new Date(lastChanged).getTime() + 6 * 30 * 24 * 60 * 60 * 1000), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-white/70 font-medium">Date of Birth</span>
                        <div className="text-xs text-luxury-primary/70">Click to select your birth date</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    canChange ? "bg-green-400 shadow-lg shadow-green-400/50" : "bg-orange-400 shadow-lg shadow-orange-400/50"
                  )} />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-6 bg-gradient-to-br from-black/95 via-[#1e1e1e]/95 to-black/95 border border-luxury-primary/30 shadow-2xl backdrop-blur-xl z-[999] rounded-xl"
                align="start"
              >
                {/* Beautiful header */}
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Select Your Birth Date</h3>
                  <p className="text-sm text-luxury-primary/70">Choose the date you were born</p>
                  {!canChange && (
                    <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-xs text-orange-400">
                        Date of birth can only be changed once every 6 months
                      </p>
                    </div>
                  )}
                </div>
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
                    caption: "flex justify-center pt-1 relative items-center gap-2",
                    caption_dropdowns: "flex gap-1",
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
                    dropdown: "absolute top-0 bg-[#1e1e1e] border border-luxury-primary/20 rounded-md shadow-lg p-2 z-50 min-w-[120px] max-h-[300px] overflow-y-auto",
                    dropdown_month: "space-y-1",
                    dropdown_year: "space-y-1",
                    vhidden: "hidden"
                  }}
                  components={{
                    Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
                      const months = [
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ];

                      const selectStyles = {
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239b87f5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1em 1em',
                        backgroundColor: '#1e1e1e'
                      };

                      const optionStyles = {
                        backgroundColor: '#1e1e1e',
                        color: '#ffffff'
                      };

                      return (
                        <div className="relative">
                          <select
                            value={value}
                            onChange={onChange}
                            className={cn(
                              "h-9 px-3 rounded-md cursor-pointer",
                              "bg-[#1e1e1e] text-white",
                              "border border-luxury-primary/20",
                              "hover:bg-luxury-primary/10 hover:border-luxury-primary",
                              "focus:outline-none focus:ring-2 focus:ring-luxury-primary/30",
                              "appearance-none min-w-[120px]",
                              "pr-8 text-sm font-medium",
                              "[&>option]:bg-[#1e1e1e] [&>option]:text-white"
                            )}
                            style={selectStyles}
                          >
                            {props.name === 'month' ? (
                              months.map((month, index) => (
                                <option 
                                  key={month} 
                                  value={index} 
                                  style={optionStyles}
                                  className="bg-[#1e1e1e] text-white hover:bg-luxury-primary/10"
                                >
                                  {month}
                                </option>
                              ))
                            ) : (
                              children
                            )}
                          </select>
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
