
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMediaGalleryProps {
  messages: DirectMessage[];
  onMediaSelect: (url: string) => void;
}

export function ChatMediaGallery({ messages, onMediaSelect }: ChatMediaGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter and group messages by type
  const imageMessages = messages.filter(
    (msg) => 
      msg.media_url && 
      msg.message_type !== "video" && 
      msg.message_type !== "audio" && 
      msg.message_type !== "document"
  );
  
  const videoMessages = messages.filter(
    (msg) => msg.message_type === "video" || msg.video_url
  );
  
  const documentMessages = messages.filter(
    (msg) => msg.message_type === "document"
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-luxury-neutral/60" />
        <Input
          placeholder="Search media..."
          className="pl-8 bg-luxury-darker border-luxury-neutral/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="images">
        <TabsList className="grid grid-cols-3 bg-luxury-darker">
          <TabsTrigger value="images" className="flex items-center gap-1">
            <Image className="h-4 w-4" /> 
            <span className="text-sm">{imageMessages.length}</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span className="text-sm">{videoMessages.length}</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{documentMessages.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="pt-2">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-3 gap-2">
              {imageMessages.map((message, index) => (
                message.media_url?.map((url, urlIndex) => (
                  <div 
                    key={`${message.id}-${urlIndex}`}
                    className="aspect-square rounded-md overflow-hidden cursor-pointer"
                    onClick={() => onMediaSelect(url)}
                  >
                    <UniversalMedia 
                      item={{
                        media_url: url,
                        creator_id: message.sender_id,
                        media_type: MediaType.IMAGE
                      }}
                      className="h-full w-full object-cover"
                      showWatermark={false}
                      controls={false}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="videos" className="pt-2">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-2">
              {videoMessages.map((message, index) => {
                const videoUrl = message.video_url || message.media_url?.[0];
                if (!videoUrl) return null;
                
                return (
                  <div 
                    key={`${message.id}-${index}`}
                    className="aspect-video rounded-md overflow-hidden cursor-pointer"
                    onClick={() => onMediaSelect(videoUrl)}
                  >
                    <UniversalMedia 
                      item={{
                        media_url: videoUrl,
                        creator_id: message.sender_id,
                        media_type: MediaType.VIDEO
                      }}
                      className="h-full w-full object-cover"
                      showWatermark={false}
                      controls={false}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="documents" className="pt-2">
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {documentMessages.map((message, index) => (
                message.media_url?.map((url, urlIndex) => (
                  <div 
                    key={`${message.id}-${urlIndex}`}
                    className="flex items-center p-2 bg-luxury-darker rounded-md cursor-pointer hover:bg-luxury-neutral/10"
                    onClick={() => onMediaSelect(url)}
                  >
                    <FileText className="h-5 w-5 mr-2 text-luxury-neutral" />
                    <div className="text-sm truncate">{url.split('/').pop()}</div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
