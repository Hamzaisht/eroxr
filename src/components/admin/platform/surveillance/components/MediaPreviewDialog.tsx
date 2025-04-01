
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LiveSession } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useModerationActions } from "../hooks/useModerationActions";
import { useState, useEffect } from "react";
import { Loader2, User, Calendar, Clock, MapPin, Tag, Info, Eye, ThumbsUp, CreditCard } from "lucide-react";

interface MediaPreviewDialogProps {
  session: LiveSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MediaPreviewDialog = ({
  session,
  open,
  onOpenChange
}: MediaPreviewDialogProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [interactions, setInteractions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchContentInteractions } = useModerationActions();

  useEffect(() => {
    const loadInteractions = async () => {
      if (!session) return;
      
      setIsLoading(true);
      try {
        const contentType = session.type === 'bodycontact' ? 'ad' : session.type;
        const data = await fetchContentInteractions(session.id, contentType);
        setInteractions(data);
      } catch (error) {
        console.error("Error loading interactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open && session && activeTab === "interactions") {
      loadInteractions();
    }
  }, [session, open, activeTab, fetchContentInteractions]);

  if (!session) return null;

  // Handle rendering media previews
  const renderMediaPreviews = () => {
    // If this is a video
    if (session.video_url) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <video 
            src={session.video_url} 
            controls 
            className="h-full w-full"
            poster={session.type === 'stream' ? undefined : undefined}
          />
        </div>
      );
    }
    
    // If there are images
    if (session.media_url && session.media_url.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {session.media_url.map((url, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <img 
                src={url} 
                alt={`Media ${index + 1}`} 
                className="h-auto w-full object-contain"
              />
            </div>
          ))}
        </div>
      );
    }
    
    // If there's only text content
    return (
      <div className="p-4 bg-[#161B22] rounded-lg border border-white/10">
        {session.content ? (
          <p className="whitespace-pre-wrap">{session.content}</p>
        ) : (
          <p className="text-gray-400 italic">No media or content available</p>
        )}
      </div>
    );
  };

  // Render metadata
  const renderMetadata = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-400">Basic Information</h3>
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">User: {session.username || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Created: {format(new Date(session.created_at || session.started_at), 'PPP')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Time: {format(new Date(session.created_at || session.started_at), 'HH:mm:ss')}</span>
              </div>
              
              {session.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Location: {session.location}</span>
                </div>
              )}
              
              {session.tags && session.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-400">Advanced Information</h3>
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Content Type: {session.type} {session.content_type ? `(${session.content_type})` : ''}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-sm">ID: {session.id}</span>
              </div>
              
              {session.metadata && (
                <>
                  {session.metadata.view_count !== undefined && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Views: {session.metadata.view_count}</span>
                    </div>
                  )}
                  
                  {session.metadata.message_count !== undefined && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Messages: {session.metadata.message_count}</span>
                    </div>
                  )}
                  
                  {session.metadata.verification_status && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Verification: {session.metadata.verification_status}</span>
                    </div>
                  )}
                  
                  {session.metadata.latitude && session.metadata.longitude && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        Coordinates: {session.metadata.latitude}, {session.metadata.longitude}
                      </span>
                    </div>
                  )}
                  
                  {session.metadata.message_source && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Source: {session.metadata.message_source}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {session.about_me && (
          <div>
            <h3 className="font-medium text-sm text-gray-400 mb-2">About User</h3>
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10">
              <p className="text-sm whitespace-pre-wrap">{session.about_me}</p>
            </div>
          </div>
        )}
        
        {session.description && (
          <div>
            <h3 className="font-medium text-sm text-gray-400 mb-2">Description</h3>
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10">
              <p className="text-sm whitespace-pre-wrap">{session.description}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render interactions
  const renderInteractions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (!interactions) {
      return (
        <div className="text-center py-8 text-gray-400">
          No interaction data available
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Viewers */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <h3 className="font-medium">Viewers ({interactions.viewers?.length || 0})</h3>
          </div>
          
          {interactions.viewers?.length > 0 ? (
            <div className="bg-[#161B22] rounded-lg border border-white/10 divide-y divide-white/10">
              {interactions.viewers.map((viewer: any) => (
                <div key={viewer.id || viewer.user_id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-800 overflow-hidden">
                      {viewer.profiles?.avatar_url ? (
                        <img 
                          src={viewer.profiles.avatar_url} 
                          alt={viewer.profiles.username || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 m-auto text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{viewer.profiles?.username || 'Anonymous'}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {viewer.created_at && format(new Date(viewer.created_at), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10 text-sm text-gray-400">
              No viewers recorded
            </div>
          )}
        </div>
        
        {/* Likers */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="h-4 w-4 text-pink-400" />
            <h3 className="font-medium">Likes ({interactions.likers?.length || 0})</h3>
          </div>
          
          {interactions.likers?.length > 0 ? (
            <div className="bg-[#161B22] rounded-lg border border-white/10 divide-y divide-white/10">
              {interactions.likers.map((liker: any) => (
                <div key={liker.id || liker.user_id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-800 overflow-hidden">
                      {liker.profiles?.avatar_url ? (
                        <img 
                          src={liker.profiles.avatar_url} 
                          alt={liker.profiles.username || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 m-auto text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{liker.profiles?.username || 'Anonymous'}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {liker.created_at && format(new Date(liker.created_at), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10 text-sm text-gray-400">
              No likes recorded
            </div>
          )}
        </div>
        
        {/* Buyers */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-green-400" />
            <h3 className="font-medium">Purchases ({interactions.buyers?.length || 0})</h3>
          </div>
          
          {interactions.buyers?.length > 0 ? (
            <div className="bg-[#161B22] rounded-lg border border-white/10 divide-y divide-white/10">
              {interactions.buyers.map((buyer: any) => (
                <div key={buyer.id || buyer.user_id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-800 overflow-hidden">
                      {buyer.profiles?.avatar_url ? (
                        <img 
                          src={buyer.profiles.avatar_url} 
                          alt={buyer.profiles.username || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 m-auto text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{buyer.profiles?.username || 'Anonymous'}</p>
                      {buyer.amount && (
                        <p className="text-xs text-green-400">${buyer.amount}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {buyer.created_at && format(new Date(buyer.created_at), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#161B22] p-3 rounded-lg border border-white/10 text-sm text-gray-400">
              No purchases recorded
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {session.title || `${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Content`}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            <TabsContent value="preview" className="mt-0">
              {renderMediaPreviews()}
            </TabsContent>
            
            <TabsContent value="metadata" className="mt-0">
              {renderMetadata()}
            </TabsContent>
            
            <TabsContent value="interactions" className="mt-0">
              {renderInteractions()}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
