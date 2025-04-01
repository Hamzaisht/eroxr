
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SurveillanceContentItem } from "../types";
import { Calendar, Clock, Eye, Heart, MessageSquare, Tag, DollarSign, Music } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";

interface ContentDetailDialogProps {
  content: SurveillanceContentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContentDetailDialog = ({ content, open, onOpenChange }: ContentDetailDialogProps) => {
  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "post": return "Post";
      case "story": return "Story";
      case "video": return "Video";
      case "audio": return "Audio";
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline">{getContentTypeLabel(content.content_type)}</Badge>
            {content.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={content.avatar_url || undefined} />
              <AvatarFallback>{content.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <span>{content.username || "Unknown User"}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content metadata */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(content.created_at)}</span>
            </div>
            
            {content.visibility && (
              <Badge variant={content.visibility === "public" ? "outline" : "secondary"}>
                {content.visibility}
              </Badge>
            )}
            
            {content.is_ppv && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>PPV ${content.ppv_amount?.toFixed(2)}</span>
              </Badge>
            )}
            
            {content.view_count !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{content.view_count}</span>
              </div>
            )}
            
            {content.likes_count !== undefined && (
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{content.likes_count}</span>
              </div>
            )}
            
            {content.comments_count !== undefined && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{content.comments_count}</span>
              </div>
            )}
            
            {content.duration !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
            
            {content.is_active === false && (
              <Badge variant="outline" className="bg-red-900/20 text-red-300">
                Inactive
              </Badge>
            )}
            
            {content.is_deleted && (
              <Badge variant="destructive">Deleted</Badge>
            )}
            
            {content.is_draft && (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>

          {/* Content description */}
          {content.description && (
            <div className="mt-4">
              <p className="whitespace-pre-wrap">{content.description}</p>
            </div>
          )}

          {/* Media content */}
          <div className="space-y-4">
            {/* Video */}
            {content.video_url && (
              <div className="mt-4">
                <VideoPlayer
                  url={content.video_url}
                  className="w-full aspect-video rounded-md overflow-hidden"
                />
              </div>
            )}
            
            {/* Audio */}
            {content.audio_url && (
              <div className="mt-4">
                <AudioPlayer url={content.audio_url} title={content.title} />
              </div>
            )}
            
            {/* Images */}
            {content.media_urls && content.media_urls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {content.media_urls.map((url, index) => (
                  <a 
                    href={url} 
                    key={index} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-auto rounded-md object-cover max-h-[300px]"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                <Tag className="h-4 w-4" />
                <span>Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-luxury-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
