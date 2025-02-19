
import { useState, useRef, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Mic, MicOff, Video, VideoOff, DollarSign } from "lucide-react";

interface VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientProfile: any;
  isVideoEnabled?: boolean;
}

export function VideoCallDialog({
  isOpen,
  onClose,
  recipientId,
  recipientProfile,
  isVideoEnabled = true,
}: VideoCallDialogProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideoEnabled);
  const [tipAmount, setTipAmount] = useState("");
  const [showTipInput, setShowTipInput] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const channelName = `call:${session?.user?.id}:${recipientId}`;
  
  // Subscribe to real-time tip notifications
  useEffect(() => {
    const channel = supabase
      .channel('tips')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tips',
          filter: `recipient_id=eq.${recipientId}`,
        },
        (payload) => {
          toast({
            title: "New Tip Received!",
            description: `${payload.new.amount} credits from ${payload.new.sender_name}`,
          });
          // Refresh tips total
          queryClient.invalidateQueries({ queryKey: ['tips_total', recipientId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, toast, queryClient]);

  // Get total tips for this call using a properly typed query
  const { data: tipsTotal = 0 } = useQuery({
    queryKey: ['tips_total', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tips')
        .select('sum:amount')
        .eq('recipient_id', recipientId)
        .eq('call_id', channelName)
        .single();

      if (error) throw error;
      return data?.sum || 0;
    },
  });

  const handleSendTip = async () => {
    if (!tipAmount || !session?.user?.id) return;

    try {
      const amount = parseFloat(tipAmount);
      const { error } = await supabase
        .from('tips')
        .insert({
          sender_id: session.user.id,
          recipient_id: recipientId,
          amount,
          call_id: channelName,
          sender_name: session.user.email,
        });

      if (error) throw error;

      setTipAmount("");
      setShowTipInput(false);
      toast({
        title: "Tip Sent!",
        description: `Successfully sent ${amount} credits`,
      });

      // Show floating heart animation
      showHeartAnimation();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showHeartAnimation = () => {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    document.querySelector('.video-container')?.appendChild(heart);
    
    setTimeout(() => heart.remove(), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-black/90">
        <div className="relative video-container h-[600px] rounded-lg overflow-hidden">
          {/* Local video */}
          <video
            ref={localVideoRef}
            className="absolute bottom-4 right-4 w-48 h-32 rounded-lg border border-white/20"
            autoPlay
            muted
            playsInline
          />
          
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
                
                {isVideoEnabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <VideoOff className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {showTipInput ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value)}
                      className="w-24 bg-white/10"
                      placeholder="Amount"
                    />
                    <Button onClick={handleSendTip} variant="secondary">
                      Send Tip
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTipInput(true)}
                  >
                    <DollarSign className="h-5 w-5" />
                  </Button>
                )}
                
                <div className="text-white/80">
                  Total Tips: {tipsTotal} credits
                </div>
                
                <Button variant="destructive" onClick={onClose}>
                  End Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
