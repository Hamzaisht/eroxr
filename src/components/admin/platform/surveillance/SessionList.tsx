
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  username: string;
  status: "online" | "away" | "busy" | "offline";
  lastActivity: string;
  riskLevel: "low" | "medium" | "high";
  location?: string;
}

export const SessionList = () => {
  const [sessions] = useState<Session[]>([
    {
      id: "1",
      username: "user123",
      status: "online",
      lastActivity: "2 minutes ago",
      riskLevel: "low",
      location: "Stockholm, SE"
    },
    {
      id: "2", 
      username: "creator456",
      status: "busy",
      lastActivity: "5 minutes ago",
      riskLevel: "medium",
      location: "Oslo, NO"
    }
  ]);
  
  const { toast } = useToast();

  const handleViewSession = (sessionId: string) => {
    toast({
      title: "Session monitoring",
      description: "Session monitoring features coming soon"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                <div>
                  <div className="font-medium">{session.username}</div>
                  <div className="text-sm text-gray-500">
                    {session.location} • {session.lastActivity}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getRiskColor(session.riskLevel)}>
                  {session.riskLevel === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {session.riskLevel}
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSession(session.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
