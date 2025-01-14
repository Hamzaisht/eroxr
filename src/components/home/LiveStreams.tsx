import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const LiveStreams = () => {
  const { data: streams, isLoading } = useQuery({
    queryKey: ["live-streams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_streams")
        .select("*")
        .eq("status", "online")
        .order("viewer_count", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!streams?.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No live streams available</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams.map((stream) => (
        <Card key={stream.id} className="p-4">
          <h3 className="font-semibold">{stream.title}</h3>
          <p className="text-sm text-muted-foreground">
            {stream.viewer_count} viewers
          </p>
        </Card>
      ))}
    </div>
  );
};