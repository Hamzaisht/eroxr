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

      // Generate a unique stream key
      const streamKey = `${session.user.id}-${Date.now()}`;
      
      // Create a new live stream record
      const { data: stream, error } = await supabase
        .from('live_streams')
        .insert([
          {
            creator_id: session.user.id,
            title,
            is_private: isPrivate,
            status: 'live',
            stream_key: streamKey,
            started_at: new Date().toISOString(),
            // In a real implementation, this would be your streaming service URL
            playback_url: `https://stream.your-service.com/live/${streamKey}/index.m3u8`
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setStreamKey(stream.stream_key);
      setPlaybackUrl(stream.playback_url);

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
        description: "Your stream is now live. Share your stream key with your streaming software.",
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
            <div className="p-4 bg-luxury-dark/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Stream Key:</p>
              <code className="text-xs break-all">{streamKey}</code>
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