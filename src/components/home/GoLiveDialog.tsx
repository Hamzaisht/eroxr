import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface GoLiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoLiveDialog = ({ open, onOpenChange }: GoLiveDialogProps) => {
  const { toast } = useToast();
  const session = useSession();
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setIsPrivate(false);
      setStreamKey(null);
      setPlaybackUrl(null);
    }
  }, [open]);

  const startStream = async () => {
    if (!session?.user?.id || !title) return;

    try {
      setIsLoading(true);

      // Call the edge function to start the stream
      const { data, error } = await supabase.functions.invoke('start-live-stream', {
        body: { title, isPrivate }
      });

      if (error) throw error;

      const { stream } = data;
      setStreamKey(stream.streamKey);
      setPlaybackUrl(stream.playbackUrl);

      // Subscribe to viewer count updates
      const channel = supabase
        .channel(`stream:${stream.id}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const viewerCount = Object.keys(state).length;
          
          // Update viewer count in the database
          supabase
            .from('live_streams')
            .update({ viewer_count: viewerCount })
            .eq('id', stream.id);
        })
        .subscribe();

      toast({
        title: "Stream started!",
        description: "Use OBS or similar software with the provided RTMP details.",
      });

    } catch (error) {
      console.error('Error starting stream:', error);
      toast({
        title: "Failed to start stream",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Go Live</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Stream Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-luxury-dark/30 border-luxury-neutral/10"
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="private-stream"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-luxury-neutral/10"
            />
            <label htmlFor="private-stream">Private Stream</label>
          </div>

          {streamKey && (
            <div className="p-4 bg-luxury-dark/20 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">RTMP Server:</p>
                <code className="text-xs break-all bg-luxury-darker p-2 rounded block">
                  rtmp://ingest.example.com/live
                </code>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Stream Key:</p>
                <code className="text-xs break-all bg-luxury-darker p-2 rounded block">
                  {streamKey}
                </code>
              </div>
              <div className="text-xs text-luxury-neutral/70">
                <p>Use these settings in OBS Studio:</p>
                <p>• Server: rtmp://ingest.example.com/live</p>
                <p>• Stream Key: {streamKey}</p>
              </div>
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
            onClick={startStream}
            disabled={isLoading || !title}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Stream...
              </>
            ) : (
              "Start Streaming"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};