
import { X, Ghost } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveSession } from "../user-analytics/types";

interface ActiveSurveillanceCardProps {
  session: LiveSession | undefined;
  onEndSurveillance: () => Promise<void>;
}

export const ActiveSurveillanceCard = ({ session, onEndSurveillance }: ActiveSurveillanceCardProps) => {
  if (!session) return null;
  
  return (
    <Card className="mt-4 border border-red-500/20 bg-red-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-red-300">
          <Ghost className="h-5 w-5 text-red-400" />
          Active Surveillance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session.avatar_url || undefined} />
              <AvatarFallback>{session.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{session.username}</h3>
                <Badge variant="outline" className="font-normal text-xs bg-red-900/30 text-red-300 border-red-800">
                  Monitoring
                </Badge>
              </div>
              
              <p className="text-sm text-gray-400">
                {session.type === 'stream' ? 'Livestream' : 
                 session.type === 'call' ? 'Call' : 
                 session.type === 'chat' ? 'Chat' : 'BodyContact Ad'}
                {session.title && ` • ${session.title}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="bg-transparent hover:bg-red-900/20 text-red-300 border border-red-800"
              onClick={onEndSurveillance}
            >
              <X className="h-4 w-4 mr-2" />
              End Surveillance
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
