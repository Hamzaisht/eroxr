import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Phone, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
}

export const BookingDialog = ({ open, onOpenChange, recipientId, recipientName }: BookingDialogProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState<'video' | 'voice'>('video');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const durations = [15, 30, 45, 60];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !session?.user?.id) {
      toast({
        title: "Missing information",
        description: "Please select date and time",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: session.user.id,
          creator_id: recipientId,
          booking_type: selectedType,
          booking_date: selectedDate,
          start_time: selectedTime,
          duration_minutes: duration,
          total_amount: duration * 2 // $2 per minute (example pricing)
        });

      if (error) throw error;

      toast({
        title: "Booking request sent",
        description: `${selectedType} call scheduled for ${selectedDate} at ${selectedTime}`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg holographic-card border-white/20 p-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        </div>

        <div className="relative z-10">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/[0.02]">
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Book a Call with {recipientName}</span>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Call Type Selection */}
            <div className="space-y-3">
              <label className="text-white font-medium">Call Type</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType('video')}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedType === 'video'
                      ? 'bg-gradient-to-r from-primary/30 to-purple-500/30 border-primary/50'
                      : 'bg-white/[0.08] border-white/20 hover:bg-white/[0.15]'
                  }`}
                >
                  <Video className="w-6 h-6 text-white mx-auto mb-2" />
                  <span className="text-white text-sm">Video Call</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType('voice')}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedType === 'voice'
                      ? 'bg-gradient-to-r from-primary/30 to-purple-500/30 border-primary/50'
                      : 'bg-white/[0.08] border-white/20 hover:bg-white/[0.15]'
                  }`}
                >
                  <Phone className="w-6 h-6 text-white mx-auto mb-2" />
                  <span className="text-white text-sm">Voice Call</span>
                </motion.button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
              <label className="text-white font-medium">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 bg-white/[0.08] border border-white/20 rounded-xl text-white focus:border-primary/50 focus:outline-none"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <label className="text-white font-medium">Select Time</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                      selectedTime === time
                        ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                        : 'bg-white/[0.08] text-white/80 hover:bg-white/[0.15] border border-white/20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-3">
              <label className="text-white font-medium">Duration (minutes)</label>
              <div className="grid grid-cols-4 gap-2">
                {durations.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                      duration === dur
                        ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                        : 'bg-white/[0.08] text-white/80 hover:bg-white/[0.15] border border-white/20'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            {/* Price Display */}
            <div className="p-4 bg-white/[0.08] rounded-xl border border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Cost:</span>
                <span className="text-white font-semibold">${duration * 2}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={loading || !selectedDate || !selectedTime}
                className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white border-0"
              >
                {loading ? 'Booking...' : 'Book Call'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};