
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BookingSlot } from "@/integrations/supabase/types/booking";

interface BookingDialogProps {
  creatorId: string;
  isOpen: boolean;
  onClose: () => void;
  bookingType: 'chat' | 'video' | 'voice';
}

export function BookingDialog({ creatorId, isOpen, onClose, bookingType }: BookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDuration, setSelectedDuration] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const session = useSession();
  const { toast } = useToast();

  const { data: bookingSlots = [] } = useQuery({
    queryKey: ['booking_slots', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_slots')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('is_active', true);

      if (error) throw error;
      return data as BookingSlot[];
    },
    enabled: !!creatorId,
  });

  const handleBooking = async () => {
    if (!session?.user?.id || !selectedDate || !selectedTime || !selectedDuration) {
      toast({
        title: "Incomplete booking",
        description: "Please select all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedSlot = bookingSlots.find(slot => 
      slot.start_time === selectedTime && 
      slot.duration_minutes.includes(parseInt(selectedDuration))
    );

    if (!selectedSlot) {
      toast({
        title: "Invalid slot",
        description: "The selected time slot is no longer available",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = selectedSlot.price_per_minute * parseInt(selectedDuration);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          creator_id: creatorId,
          user_id: session.user.id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          duration_minutes: parseInt(selectedDuration),
          total_amount: totalAmount,
          booking_type: bookingType,
        });

      if (error) throw error;

      toast({
        title: "Booking confirmed",
        description: `Your ${bookingType} session has been booked successfully`,
      });
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "Unable to complete your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const availableTimes = bookingSlots
    .filter(slot => slot.day_of_week === (selectedDate?.getDay() ?? -1))
    .map(slot => slot.start_time);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a {bookingType} session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
          
          <Select
            disabled={!selectedDate}
            value={selectedTime}
            onValueChange={setSelectedTime}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            disabled={!selectedTime}
            value={selectedDuration}
            onValueChange={setSelectedDuration}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {selectedTime && bookingSlots
                .find(slot => slot.start_time === selectedTime)
                ?.duration_minutes.map((duration) => (
                  <SelectItem key={duration} value={duration.toString()}>
                    {duration} minutes
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button onClick={handleBooking} disabled={!selectedDate || !selectedTime || !selectedDuration}>
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
