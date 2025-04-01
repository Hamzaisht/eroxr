

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionList } from "./SessionList";
import { AlertsList } from "./AlertsList";
import { LiveSession, LiveAlert } from "../user-analytics/types";
import { Webcam, Phone, MessageSquare, User, AlertTriangle } from "lucide-react";

interface TabContentProps {
  activeTab: string;
  isLoading: boolean;
  liveSessions: LiveSession[];
  liveAlerts: LiveAlert[];
  onMonitorSession: (session: LiveSession) => Promise<void>;
}

export const TabContent = ({ 
  activeTab,
  isLoading,
  liveSessions,
  liveAlerts,
  onMonitorSession
}: TabContentProps) => {
  const getTabIcon = () => {
    switch (activeTab) {
      case 'streams':
        return <Webcam className="h-5 w-5" />;
      case 'calls':
        return <Phone className="h-5 w-5" />;
      case 'chats':
        return <MessageSquare className="h-5 w-5" />;
      case 'bodycontact':
        return <User className="h-5 w-5" />;
      case 'alerts':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'streams':
        return 'Live Streams';
      case 'calls':
        return 'Active Calls';
      case 'chats':
        return 'Live Chats';
      case 'bodycontact':
        return 'BodyContact Ads';
      case 'alerts':
        return 'Live Alerts';
      default:
        return '';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'streams':
        return 'Active streams happening right now';
      case 'calls':
        return 'Voice and video calls in progress';
      case 'chats':
        return 'Active conversations between users';
      case 'bodycontact':
        return 'Recent and pending bodycontact ads';
      case 'alerts':
        return 'Recent flags, reports, and risk events';
      default:
        return '';
    }
  };

  const getEmptyIcon = () => {
    switch (activeTab) {
      case 'streams':
        return <Webcam className="h-10 w-10" />;
      case 'calls':
        return <Phone className="h-10 w-10" />;
      case 'chats':
        return <MessageSquare className="h-10 w-10" />;
      case 'bodycontact':
        return <User className="h-10 w-10" />;
      case 'alerts':
        return <AlertTriangle className="h-10 w-10" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTabIcon()}
          {getTabTitle()}
        </CardTitle>
        <CardDescription>
          {getTabDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {activeTab === 'alerts' ? (
            <AlertsList
              alerts={liveAlerts}
              isLoading={isLoading}
            />
          ) : (
            <SessionList
              sessions={liveSessions}
              isLoading={isLoading}
              onMonitorSession={onMonitorSession}
            />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

