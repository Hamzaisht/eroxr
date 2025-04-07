
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, Clock } from "lucide-react";
import { LiveSession } from "../types";
import { formatDistanceToNow } from "date-fns";

interface ActiveSessionMonitorProps {
  isWatching: boolean;
  session?: LiveSession;
  startTime?: string;
  onStopWatching: () => Promise<boolean>;
}

export const ActiveSessionMonitor: React.FC<ActiveSessionMonitorProps> = ({
  isWatching,
  session,
  startTime,
  onStopWatching
}) => {
  if (!isWatching || !session) {
    return null;
  }

  const sessionTypeLabel = {
    'stream': 'Live Stream',
    'call': 'Video Call',
    'chat': 'Chat',
    'bodycontact': 'BodyContact',
    'content': 'Content'
  }[session.type] || 'Session';
  
  const elapsedTime = startTime ? 
    formatDistanceToNow(new Date(startTime), { addSuffix: false }) : 
    'a few seconds';

  return (
    <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-400" />
              Active Surveillance
            </CardTitle>
            <Badge variant="outline" className="w-fit mt-1 bg-purple-900/30">
              {sessionTypeLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium">{session.username}</span>
          </div>
          {session.title && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-medium truncate max-w-[150px]">{session.title}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" /> Duration:
            </span>
            <span className="font-medium">{elapsedTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onStopWatching}
          variant="destructive" 
          className="w-full text-sm bg-red-900/80 hover:bg-red-900"
          size="sm"
        >
          <EyeOff className="h-4 w-4 mr-2" />
          Stop Surveillance
        </Button>
      </CardFooter>
    </Card>
  );
};
