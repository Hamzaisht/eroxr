
import { useState, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoControls } from "./VideoControls";
import { TippingControls } from "./TippingControls";
import { useTipNotifications } from "./useTipNotifications";
import type { VideoCallDialogProps } from "./types";

export function VideoCallDialog({
  isOpen,
  onClose,
  recipientId,
  recipientProfile,
  isVideoEnabled = true,
}: VideoCallDialogProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideoEnabled);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const session = useSession();

  const channelName = `call:${session?.user?.id}:${recipientId}`;
  
  // Setup real-time tip notifications
  useTipNotifications(recipientId);

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
              <VideoControls
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                isVideoOn={isVideoOn}
                setIsVideoOn={setIsVideoOn}
                isVideoEnabled={isVideoEnabled}
              />

              <div className="flex items-center gap-4">
                <TippingControls
                  recipientId={recipientId}
                  channelName={channelName}
                />
                
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
