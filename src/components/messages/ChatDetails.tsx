import { X, Bell, Calendar, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface ChatDetailsProps {
  userId: string;
  onClose: () => void;
}

export const ChatDetails = ({ userId, onClose }: ChatDetailsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("30");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Mutation for deleting conversation
  const deleteConversationMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently deleted.",
      });
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Chat unmuted" : "Chat muted",
      description: isMuted ? "You will now receive notifications" : "You won't receive notifications from this chat",
    });
  };

  const handleScheduleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Invalid selection",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Session scheduled",
      description: `Session scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime} for ${duration} minutes`,
    });
    setShowScheduleDialog(false);
  };

  return (
    <div className="border-l border-luxury-neutral/10 bg-luxury-dark/50 w-80">
      <div className="p-4 border-b border-luxury-neutral/10 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-luxury-neutral">Chat Details</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-luxury-neutral/5 rounded-full"
        >
          <X className="w-5 h-5 text-luxury-neutral/70" />
        </button>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleMuteToggle}
              className={`flex flex-col items-center p-3 space-y-1 rounded-lg transition-colors ${
                isMuted ? 'bg-luxury-primary/20 text-luxury-primary' : 'hover:bg-luxury-neutral/5'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              onClick={() => setShowScheduleDialog(true)}
              className="flex flex-col items-center p-3 space-y-1 rounded-lg hover:bg-luxury-neutral/5"
            >
              <Calendar className="w-5 h-5 text-luxury-neutral/70" />
              <span className="text-xs text-luxury-neutral/70">Schedule</span>
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex flex-col items-center p-3 space-y-1 rounded-lg hover:bg-luxury-neutral/5"
            >
              <Trash2 className="w-5 h-5 text-luxury-neutral/70" />
              <span className="text-xs text-luxury-neutral/70">Delete</span>
            </button>
          </div>

          {/* Shared Media */}
          <div>
            <h4 className="text-sm font-medium text-luxury-neutral mb-3">
              Shared Media
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-luxury-neutral/5"
                />
              ))}
            </div>
          </div>

          {/* Shared Files */}
          <div>
            <h4 className="text-sm font-medium text-luxury-neutral mb-3">
              Shared Files
            </h4>
            <div className="space-y-2">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-luxury-neutral/5 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded bg-luxury-neutral/10" />
                  <div>
                    <p className="text-sm text-luxury-neutral">Document.pdf</p>
                    <p className="text-xs text-luxury-neutral/50">1.2 MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConversationMutation.mutate()}
              disabled={deleteConversationMutation.isPending}
            >
              {deleteConversationMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Private Session</DialogTitle>
            <DialogDescription>
              Set up a date and time for your private call session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-luxury-dark/30 border-luxury-neutral/10"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                max="120"
                step="15"
                className="bg-luxury-dark/30 border-luxury-neutral/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleSubmit}>
              Schedule Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
