
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeOff, ExternalLink } from "lucide-react";
import { LiveSession } from "../user-analytics/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActiveSurveillanceCardProps {
  session: LiveSession;
  onEndSurveillance: () => Promise<boolean>;
}

export const ActiveSurveillanceCard = ({ 
  session, 
  onEndSurveillance 
}: ActiveSurveillanceCardProps) => {
  const handleEndSurveillance = async () => {
    await onEndSurveillance();
  };
  
  return (
    <Card className="bg-purple-950/30 border-purple-700/50 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Active Surveillance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={session.avatar_url || undefined} alt={session.username || 'Unknown'} />
              <AvatarFallback>{(session.username || 'Unknown').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{session.username || 'Unknown'}</div>
              <div className="text-sm text-gray-400">
                {session.type.charAt(0).toUpperCase() + session.type.slice(1)}: {session.title || "Unnamed"}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-400 border-gray-700"
              onClick={handleEndSurveillance}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              End
            </Button>
            
            {session.type === 'stream' && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-400 border-gray-700"
                onClick={() => window.open(`/livestream/${session.id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
