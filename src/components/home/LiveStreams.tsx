import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

interface LiveStreamsProps {
  onGoLive: () => void;
}

export const LiveStreams = ({ onGoLive }: LiveStreamsProps) => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <Radio className="w-12 h-12 text-luxury-primary/50" />
      <h3 className="text-xl font-semibold text-luxury-neutral">No Live Streams</h3>
      <p className="text-luxury-neutral/60 text-center max-w-md">
        There are no live streams at the moment. Be the first to go live and connect with your audience!
      </p>
      <Button 
        onClick={onGoLive}
        className="mt-4 bg-luxury-primary hover:bg-luxury-primary/90"
      >
        Go Live
      </Button>
    </div>
  );
};