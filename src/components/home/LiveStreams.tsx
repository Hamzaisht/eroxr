
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayCircle, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const LiveStreams = () => {
  const { data: liveStreams } = useQuery({
    queryKey: ['live-streams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_streams')
        .select(`
          *,
          creator:profiles(id, username)
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (!liveStreams || liveStreams.length === 0) {
    return null;
  }

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-red-500" />
          Live Now
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveStreams.map((stream) => (
            <div key={stream.id} className="relative group cursor-pointer">
              <div className="aspect-video bg-luxury-dark rounded-lg flex items-center justify-center relative overflow-hidden">
                <PlayCircle className="h-12 w-12 text-white/80" />
                <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                  LIVE
                </Badge>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                  <Users className="h-3 w-3 text-white" />
                  <span className="text-white text-xs">{stream.viewer_count}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {Array.isArray(stream.creator) && stream.creator.length > 0 
                      ? stream.creator[0].username?.[0]?.toUpperCase() || "U"
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm truncate">{stream.title}</p>
                  <p className="text-gray-400 text-xs">
                    {Array.isArray(stream.creator) && stream.creator.length > 0 
                      ? stream.creator[0].username || "Unknown"
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
