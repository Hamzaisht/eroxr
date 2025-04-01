
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LiveSession } from "../../user-analytics/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MediaPreviewDialogProps {
  session: LiveSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MediaPreviewDialog: React.FC<MediaPreviewDialogProps> = ({
  session,
  open,
  onOpenChange,
}) => {
  if (!session) return null;

  const hasMedia = (session.media_url && session.media_url.length > 0);
  const hasVideo = !!session.video_url;
  const hasProfile = !!(session.type === "bodycontact" && session.about_me);

  // Show default tab based on available content
  const defaultTab = hasVideo ? "video" : hasMedia ? "images" : "profile";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#0D1117]/95 border-purple-950/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={session.avatar_url || undefined} alt={session.username || "User"} />
              <AvatarFallback>{session.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <span>
              {session.username || "Unknown User"} - {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Content
            </span>
          </DialogTitle>
          <DialogDescription>
            Previewing content {session.type === "bodycontact" ? "from ad" : "from message"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            {hasVideo && <TabsTrigger value="video">Video</TabsTrigger>}
            {hasMedia && <TabsTrigger value="images">Images</TabsTrigger>}
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {hasVideo && (
            <TabsContent value="video" className="h-[500px] flex justify-center items-center">
              <video
                src={session.video_url}
                controls
                className="max-h-full max-w-full rounded-md"
              />
            </TabsContent>
          )}

          {hasMedia && (
            <TabsContent value="images" className="h-[500px]">
              <ScrollArea className="h-full w-full">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {session.media_url?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-auto rounded-md object-cover max-h-[300px]"
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          <TabsContent value="profile" className="h-[500px]">
            <ScrollArea className="h-full w-full p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={session.avatar_url || undefined} alt={session.username || "User"} />
                    <AvatarFallback>{session.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{session.username || "Unknown User"}</h3>
                    {session.type === "chat" && (
                      <p className="text-sm text-muted-foreground">
                        Message to: {session.recipient_username}
                      </p>
                    )}
                    {session.type === "bodycontact" && session.title && (
                      <p className="text-sm font-medium">{session.title}</p>
                    )}
                  </div>
                </div>

                {session.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-purple-400">Description</h4>
                    <p className="text-sm whitespace-pre-wrap">{session.description}</p>
                  </div>
                )}

                {session.content && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-purple-400">Message Content</h4>
                    <p className="text-sm whitespace-pre-wrap">{session.content}</p>
                  </div>
                )}

                {session.about_me && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-purple-400">About Me</h4>
                    <p className="text-sm whitespace-pre-wrap">{session.about_me}</p>
                  </div>
                )}

                {session.tags && session.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-purple-400">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {session.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
