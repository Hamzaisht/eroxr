
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { BookingSlot } from "@/integrations/supabase/types/booking";

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

export function CreatorBookingSettings() {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dayOfWeek, setDayOfWeek] = useState<string>("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [pricePerMinute, setPricePerMinute] = useState("1");
  const [selectedDurations, setSelectedDurations] = useState([15, 30, 60]);

  const { data: bookingSlots = [] } = useQuery({
    queryKey: ['creator_booking_slots', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_slots')
        .select('*')
        .eq('creator_id', session?.user?.id)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      return data as BookingSlot[];
    },
    enabled: !!session?.user?.id,
  });

  const handleAddSlot = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('booking_slots')
        .insert({
          creator_id: session.user.id,
          day_of_week: parseInt(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
          price_per_minute: parseFloat(pricePerMinute),
          duration_minutes: selectedDurations,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Slot added",
        description: "Your booking slot has been added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['creator_booking_slots'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add booking slot",
        variant: "destructive",
      });
    }
  };

  const handleToggleSlot = async (slotId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('booking_slots')
        .update({ is_active: !isActive })
        .eq('id', slotId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['creator_booking_slots'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update slot status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-semibold">Booking Settings</h2>
      
      <div className="grid gap-4">
        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day.value} value={day.value}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Start Time</label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">End Time</label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Price per minute</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={pricePerMinute}
            onChange={(e) => setPricePerMinute(e.target.value)}
          />
        </div>

        <Button onClick={handleAddSlot}>Add Slot</Button>
      </div>

      <div className="mt-8">
        <h3 className="text-md font-semibold mb-4">Your Booking Slots</h3>
        <div className="space-y-4">
          {bookingSlots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">
                  {DAYS_OF_WEEK.find(d => d.value === slot.day_of_week.toString())?.label}
                </p>
                <p className="text-sm text-gray-500">
                  {slot.start_time} - {slot.end_time}
                </p>
                <p className="text-sm">${slot.price_per_minute}/min</p>
              </div>
              <Button
                variant={slot.is_active ? "default" : "secondary"}
                onClick={() => handleToggleSlot(slot.id, slot.is_active)}
              >
                {slot.is_active ? "Active" : "Inactive"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
