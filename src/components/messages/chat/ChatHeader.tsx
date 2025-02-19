
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, Calendar } from "lucide-react";
import { BookingDialog } from "../booking/BookingDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChatHeaderProps {
  recipientProfile: any;
  recipientId: string;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onToggleDetails: () => void;
}

export const ChatHeader = ({
  recipientProfile,
  recipientId,
  onVoiceCall,
  onVideoCall,
  onToggleDetails
}: ChatHeaderProps) => {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingType, setBookingType] = useState<'chat' | 'video' | 'voice'>('chat');

  // Check if recipient is a creator who accepts bookings
  const { data: hasBookingEnabled } = useQuery({
    queryKey: ['creator_booking_enabled', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_slots')
        .select('id')
        .eq('creator_id', recipientId)
        .eq('is_active', true)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!recipientId,
  });

  const handleBookingClick = (type: 'chat' | 'video' | 'voice') => {
    setBookingType(type);
    setShowBooking(true);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientProfile?.avatar_url} />
            <AvatarFallback>{recipientProfile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {recipientProfile?.username || 'Loading...'}
            </h2>
            <p className="text-sm text-white/60">{recipientProfile?.status || 'offline'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasBookingEnabled && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleBookingClick('chat')}
            >
              <Calendar className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleBookingClick('voice')}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleBookingClick('video')}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleDetails}>
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <BookingDialog
        creatorId={recipientId}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        bookingType={bookingType}
      />
    </>
  );
};
