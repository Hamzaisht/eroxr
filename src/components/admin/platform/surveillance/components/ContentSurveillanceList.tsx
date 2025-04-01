
import { useState } from "react";
import { Trash2, Eye, AlertTriangle, User, Clock, MapPin, Lock, Shield } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentType, SurveillanceContentItem } from "../types";
import { useModerationActions } from "../hooks/useModerationActions";

interface ContentSurveillanceListProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  error?: string | null;
  type: ContentType;
  onViewContent: (item: SurveillanceContentItem) => void;
}

export const ContentSurveillanceList = ({
  items,
  isLoading,
  error,
  type,
  onViewContent
}: ContentSurveillanceListProps) => {
  const [selectedItem, setSelectedItem] = useState<SurveillanceContentItem | null>(null);
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const { actionInProgress, handleModeration } = useModerationActions();

  const handleOpenModerationDialog = (item: SurveillanceContentItem) => {
    setSelectedItem(item);
    setShowModerationDialog(true);
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'post': return 'Posts';
      case 'story': return 'Stories';
      case 'video': return 'Videos';
      case 'ppv': return 'PPV Content';
      default: return 'Content';
    }
  };

  const getStatusBadge = (item: SurveillanceContentItem) => {
    if (item.is_deleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (item.is_draft) {
      return <Badge variant="outline">Draft</Badge>;
    }
    if (item.is_ppv) {
      return <Badge variant="secondary">PPV Locked</Badge>;
    }
    if (item.visibility === 'private' || item.visibility === 'subscribers_only') {
      return <Badge variant="default">Private</Badge>;
    }
    return <Badge variant="success" className="bg-green-600">Public</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-800 text-red-300">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-[#161B22] rounded-lg">
        <div className="flex justify-center mb-4">
          <Eye className="h-12 w-12 opacity-50" />
        </div>
        <p className="text-lg font-medium">No {getContentTypeLabel(type)} Found</p>
        <p className="mt-2 text-sm text-gray-500">
          There are currently no items to display
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="p-4 bg-[#161B22]/80 backdrop-blur-sm hover:bg-[#1C2128]/80 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.creator_avatar_url || ''} alt={item.creator_username || 'User'} />
                <AvatarFallback>{(item.creator_username?.[0] || 'U').toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.creator_username || 'Unknown User'}</span>
                  {getStatusBadge(item)}
                </div>
                
                <div className="mt-1 text-sm text-gray-400 flex flex-wrap gap-2">
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                    {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                  </span>
                  
                  {item.location && (
                    <span className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 opacity-70" />
                      {item.location}
                    </span>
                  )}
                  
                  {item.ip_address && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center cursor-help">
                            <Shield className="h-3.5 w-3.5 mr-1 opacity-70" />
                            IP Logged
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>{item.ip_address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                <p className="mt-2 text-sm line-clamp-2">{item.content || 'No content'}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewContent(item)}
                className="h-8"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleOpenModerationDialog(item)}
                className="h-8"
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                Moderate
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {selectedItem && (
        <Dialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
          <DialogContent className="bg-[#161B22] border-gray-800">
            <DialogHeader>
              <DialogTitle>Moderate Content</DialogTitle>
              <DialogDescription>
                Take action on content by {selectedItem.creator_username || 'Unknown User'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                disabled={!!actionInProgress}
                onClick={() => handleModeration(selectedItem, 'delete')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Force Delete Content
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!!actionInProgress}
                onClick={() => handleModeration(selectedItem, 'shadowban')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Shadow Ban Content
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!!actionInProgress}
                onClick={() => handleModeration(selectedItem, 'flag')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
              
              <Button 
                variant="default" 
                className="w-full justify-start"
                disabled={!!actionInProgress}
                onClick={() => handleModeration(selectedItem, 'ban_user')}
              >
                <User className="h-4 w-4 mr-2" />
                Ban User Account
              </Button>
            </div>

            {actionInProgress && (
              <div className="flex items-center justify-center py-2">
                <div className="h-5 w-5 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full mr-2" />
                <span>Processing action...</span>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
