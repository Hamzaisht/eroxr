
import { useState } from "react";
import { AlertCircle, Clock, ExternalLink, MoreHorizontal, User, MessageSquare, Eye, Ban, Flag } from "lucide-react";
import { SurveillanceContentItem } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModerationActions } from "../hooks/useModerationActions";

interface ContentSurveillanceListProps {
  items: SurveillanceContentItem[];
  isLoading: boolean;
  error?: string | null;
  type: string;
  onViewContent: (content: SurveillanceContentItem) => void;
}

export const ContentSurveillanceList = ({
  items,
  isLoading,
  error,
  type,
  onViewContent
}: ContentSurveillanceListProps) => {
  const [selectedItem, setSelectedItem] = useState<SurveillanceContentItem | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const { actionInProgress, handleModeration } = useModerationActions();
  
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
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-[#161B22] rounded-lg">
        <div className="flex justify-center mb-4">
          <MessageSquare className="h-12 w-12 opacity-50" />
        </div>
        <p className="text-lg font-medium">No content found</p>
        <p className="mt-2 text-sm text-gray-500">
          {type === 'ppv' 
            ? 'No premium content has been posted yet'
            : `No ${type} content matching the current filters`}
        </p>
      </div>
    );
  }

  const handleActionClick = (item: SurveillanceContentItem, action: string) => {
    setSelectedItem(item);
    
    if (action === 'ban') {
      setShowBanDialog(true);
    } else {
      handleModeration(item, action);
    }
  };
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="flex flex-col p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={item.creator_avatar_url || item.avatar_url || undefined} alt={item.creator_username || item.username || 'Unknown'} />
                <AvatarFallback>{(item.creator_username || item.username || 'Unknown').charAt(0).toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.creator_username || item.username || 'Unknown'}</h3>
                  {item.content_type && (
                    <Badge 
                      variant="outline" 
                      className="font-normal text-xs"
                    >
                      {item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}
                    </Badge>
                  )}
                  
                  {item.is_ppv && (
                    <Badge 
                      variant="outline" 
                      className="font-normal text-xs bg-green-900/30 text-green-300 border-green-800"
                    >
                      PPV: ${item.ppv_amount?.toFixed(2)}
                    </Badge>
                  )}
                  
                  {item.is_draft && (
                    <Badge 
                      variant="outline" 
                      className="font-normal text-xs bg-yellow-900/30 text-yellow-300 border-yellow-800"
                    >
                      Draft
                    </Badge>
                  )}
                  
                  {item.visibility && item.visibility !== 'public' && (
                    <Badge 
                      variant="outline" 
                      className="font-normal text-xs bg-blue-900/30 text-blue-300 border-blue-800"
                    >
                      {item.visibility.charAt(0).toUpperCase() + item.visibility.slice(1)}
                    </Badge>
                  )}
                </div>
                
                {/* Content preview */}
                {item.content && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {item.content}
                  </p>
                )}
                
                {/* Media preview counts */}
                {item.media_urls && item.media_urls.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.media_urls.length} media item{item.media_urls.length > 1 ? 's' : ''}
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(item.created_at), 'MMM d, yyyy HH:mm:ss')}
                  </span>
                  
                  {item.location && (
                    <span className="ml-2">
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              {/* View content button */}
              <Button 
                size="sm" 
                variant="ghost"
                className="bg-blue-900/20 hover:bg-blue-800/30 text-blue-300"
                onClick={() => onViewContent(item)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              
              {/* Action dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="bg-red-900/20 hover:bg-red-800/30 text-red-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="text-yellow-400 flex items-center"
                    onClick={() => handleActionClick(item, 'flag')}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag Content
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-orange-400 flex items-center"
                    onClick={() => handleActionClick(item, 'shadowban')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Shadow Ban
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400 flex items-center"
                    onClick={() => handleActionClick(item, 'delete')}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Delete Content
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-500 flex items-center"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Ban Creator
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
      
      {/* Ban confirmation dialog */}
      {selectedItem && (
        <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban Creator</DialogTitle>
              <DialogDescription>
                Are you sure you want to ban {selectedItem.creator_username || selectedItem.username || 'this creator'}? This will remove all their content and prevent them from logging in.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowBanDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleModeration(selectedItem, 'ban');
                  setShowBanDialog(false);
                }}
                disabled={!!actionInProgress}
              >
                {actionInProgress ? 'Processing...' : 'Ban Creator'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
