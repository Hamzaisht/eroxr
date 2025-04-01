
import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Shield, 
  Lock, 
  Video, 
  Image as ImageIcon,
  FileText,
  Trash2,
  Ban
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SurveillanceContentItem } from "../types";
import { useModerationActions } from "../hooks/useModerationActions";

interface ContentDetailDialogProps {
  content: SurveillanceContentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContentDetailDialog = ({
  content,
  open,
  onOpenChange
}: ContentDetailDialogProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const { actionInProgress, handleModeration } = useModerationActions();

  const getContentTypeIcon = () => {
    switch (content.content_type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'story': return <Clock className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'ppv': return <Lock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getMediaComponent = () => {
    if (!content.media_urls || content.media_urls.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-black/30 rounded-md">
          <FileText className="h-12 w-12 opacity-30" />
        </div>
      );
    }

    const currentMedia = content.media_urls[activeMediaIndex];
    const isVideo = currentMedia.endsWith('.mp4') || 
                   currentMedia.endsWith('.mov') || 
                   currentMedia.includes('video');

    if (isVideo) {
      return (
        <video 
          src={currentMedia}
          controls
          className="w-full max-h-[500px] object-contain rounded-md"
        />
      );
    } else {
      return (
        <img 
          src={currentMedia} 
          alt="Content media"
          className="w-full max-h-[500px] object-contain rounded-md" 
        />
      );
    }
  };

  const hasMultipleMedia = content.media_urls && content.media_urls.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-[#161B22] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-800">
          <DialogTitle className="flex items-center">
            {getContentTypeIcon()}
            <span className="ml-2">Content Details</span>
            {content.is_ppv && (
              <Badge variant="secondary" className="ml-2">
                <Lock className="h-3 w-3 mr-1" />
                PPV
              </Badge>
            )}
            {content.is_deleted && (
              <Badge variant="destructive" className="ml-2">Deleted</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Creator Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={content.creator_avatar_url || ''} alt={content.creator_username || 'User'} />
                <AvatarFallback>{(content.creator_username?.[0] || 'U').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{content.creator_username || 'Unknown User'}</h3>
                <p className="text-sm text-gray-400">{content.creator_id}</p>
              </div>
            </div>
            
            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm border rounded-md p-3 border-gray-800">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Created: {format(new Date(content.created_at), 'PPP')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>Time: {format(new Date(content.created_at), 'HH:mm:ss')}</span>
              </div>
              {content.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{content.location}</span>
                </div>
              )}
              {content.ip_address && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>IP: {content.ip_address}</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="border rounded-md p-3 border-gray-800">
              <h4 className="font-medium mb-2">Content</h4>
              <p className="whitespace-pre-wrap">{content.content || 'No text content'}</p>
            </div>
            
            {/* Media */}
            <div>
              {getMediaComponent()}
              
              {hasMultipleMedia && (
                <div className="flex mt-2 gap-2 overflow-x-auto pb-2">
                  {content.media_urls?.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveMediaIndex(index)}
                      className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 ${
                        index === activeMediaIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {url.endsWith('.mp4') || url.endsWith('.mov') || url.includes('video') ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <Video className="h-6 w-6 text-gray-400" />
                        </div>
                      ) : (
                        <img 
                          src={url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Moderation Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleModeration(content, 'view')}
              >
                <Eye className="h-4 w-4 mr-1.5" />
                View As User
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleModeration(content, 'flag')}
                disabled={!!actionInProgress}
              >
                <Shield className="h-4 w-4 mr-1.5" />
                Flag Content
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleModeration(content, 'shadowban')}
                disabled={!!actionInProgress}
              >
                <Ban className="h-4 w-4 mr-1.5" />
                Shadow Ban
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1"
                onClick={() => handleModeration(content, 'delete')}
                disabled={!!actionInProgress}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Force Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
