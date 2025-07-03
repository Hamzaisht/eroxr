import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Bell, BellOff, Trash2, Ban, Heart, Download, Play, FileText, Image, Video, Music } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatDetailsProps {
  conversationId: string;
  onClose: () => void;
}

export const ChatDetails = ({ conversationId, onClose }: ChatDetailsProps) => {
  const [notifications, setNotifications] = useState(true);
  
  // Mock data
  const userProfile = {
    id: 'user1',
    username: 'Aphrodite',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    bio: 'Goddess of love and beauty ✨ | Content creator | Greek mythology enthusiast',
    isOnline: true,
    mutualFriends: 15,
    joinedDate: '2023'
  };

  const sharedMedia = [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200',
      date: '2024-01-13'
    },
    {
      id: '4',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200',
      date: '2024-01-12'
    },
    {
      id: '5',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200',
      date: '2024-01-11'
    },
    {
      id: '6',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      date: '2024-01-10'
    }
  ];

  const sharedFiles = [
    {
      id: '1',
      name: 'Contract_Agreement.pdf',
      size: '2.4 MB',
      type: 'pdf',
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Photo_Collection.zip',
      size: '45.8 MB',
      type: 'archive',
      date: '2024-01-14'
    },
    {
      id: '3',
      name: 'Audio_Recording.mp3',
      size: '8.2 MB',
      type: 'audio',
      date: '2024-01-13'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-400" />;
      case 'archive':
        return <Download className="h-8 w-8 text-yellow-400" />;
      case 'audio':
        return <Music className="h-8 w-8 text-green-400" />;
      default:
        return <FileText className="h-8 w-8 text-white/60" />;
    }
  };

  return (
    <motion.div 
      className="h-full bg-black/20 backdrop-blur-xl flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Contact Info</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-6 text-center border-b border-white/10">
          <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white/20">
            <AvatarImage src={userProfile.avatar_url} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 text-white">
              {userProfile.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-bold text-white mb-2">{userProfile.username}</h3>
          <p className="text-sm text-white/70 mb-4">{userProfile.bio}</p>
          
          <div className="flex justify-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites
            </Button>
          </div>

          <div className="flex justify-center gap-6 text-center">
            <div>
              <p className="text-lg font-semibold text-white">{userProfile.mutualFriends}</p>
              <p className="text-xs text-white/60">Mutual Friends</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{userProfile.joinedDate}</p>
              <p className="text-xs text-white/60">Joined</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-white/70" />
              <span className="text-white">Notifications</span>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          >
            <Search className="h-5 w-5 mr-3" />
            Search in Conversation
          </Button>
        </div>

        {/* Shared Content */}
        <div className="p-4">
          <Tabs defaultValue="media" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="media" className="data-[state=active]:bg-primary">
                Media ({sharedMedia.length})
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-primary">
                Files ({sharedFiles.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="media" className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {sharedMedia.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square relative rounded-lg overflow-hidden bg-white/10 group cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt="Shared media"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="mt-4">
              <div className="space-y-3">
                {sharedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-sm text-white/60">{file.size} • {file.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Ban className="h-5 w-5 mr-3" />
            Block User
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Trash2 className="h-5 w-5 mr-3" />
            Delete Conversation
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatDetails;