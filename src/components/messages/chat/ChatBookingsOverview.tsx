
import React from "react";
import { Calendar, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface ChatBookingsOverviewProps {
  recipientId: string;
  onBookCall: () => void;
}

export function ChatBookingsOverview({ recipientId, onBookCall }: ChatBookingsOverviewProps) {
  const session = useSession();
  const { toast } = useToast();
  const currentUserId = session?.user?.id;

  // Fetch upcoming bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["chat-bookings", currentUserId, recipientId],
    queryFn: async () => {
      if (!recipientId || !currentUserId) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .or(`and(creator_id.eq.${recipientId},user_id.eq.${currentUserId}),and(creator_id.eq.${currentUserId},user_id.eq.${recipientId})`)
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Could not load bookings",
          variant: "destructive"
        });
        return [];
      }

      return data;
    },
    enabled: !!recipientId && !!currentUserId
  });

  const upcomingBookings = bookings.filter(booking => 
    booking.status !== 'cancelled' && 
    new Date(`${booking.booking_date}T${booking.start_time}`) >= new Date()
  );

  const pastBookings = bookings.filter(booking => 
    booking.status !== 'cancelled' && 
    new Date(`${booking.booking_date}T${booking.start_time}`) < new Date()
  );

  return (
    <div className="space-y-4">
      {/* Header with booking action */}
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Scheduled Calls
        </h3>
        <Button 
          size="sm" 
          onClick={onBookCall}
          variant="outline"
          className="bg-luxury-primary/20 border-luxury-primary/30 hover:bg-luxury-primary/30"
        >
          Book Call
        </Button>
      </div>

      {/* Upcoming bookings */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-luxury-neutral/80">Upcoming</h4>
        <ScrollArea className="h-[150px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-16">
              <div className="text-sm text-luxury-neutral/60">Loading...</div>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-2">
              {upcomingBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-3 rounded-md bg-luxury-primary/10 border border-luxury-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)} Call
                    </div>
                    <div className="text-xs text-luxury-neutral/70">
                      {booking.duration_minutes} min
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm mt-1 text-luxury-neutral/80">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                    {format(new Date(booking.booking_date), "PPP")}
                  </div>
                  
                  <div className="flex items-center text-sm mt-1 text-luxury-neutral/80">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {booking.start_time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-16">
              <div className="text-sm text-luxury-neutral/60">No upcoming calls</div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Past bookings */}
      {pastBookings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-luxury-neutral/80">Past Calls</h4>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {pastBookings.slice(0, 5).map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-2 rounded-md bg-luxury-darker/80 border border-luxury-neutral/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">
                      {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)} Call
                    </div>
                    <div className="text-xs text-luxury-neutral/70">
                      {formatDistanceToNow(new Date(`${booking.booking_date}T${booking.start_time}`), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
