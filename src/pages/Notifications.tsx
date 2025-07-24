import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Users, 
  Star,
  Crown,
  Video,
  Gift,
  Settings,
  Check,
  Trash2
} from "lucide-react";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'subscription' | 'verification' | 'tip' | 'live';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
  avatar?: string;
  username?: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      {
        id: '1',
        type: 'like',
        title: 'New Like',
        message: 'sarah_creates liked your post',
        time: '2 minutes ago',
        isRead: false,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50',
        username: 'sarah_creates'
      },
      {
        id: '2',
        type: 'comment',
        title: 'New Comment',
        message: 'alex_fitness commented: "Amazing content! 🔥"',
        time: '15 minutes ago',
        isRead: false,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
        username: 'alex_fitness'
      },
      {
        id: '3',
        type: 'follow',
        title: 'New Follower',
        message: 'emma_artist started following you',
        time: '1 hour ago',
        isRead: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
        username: 'emma_artist'
      },
      {
        id: '4',
        type: 'tip',
        title: 'Tip Received',
        message: 'You received a 50 SEK tip from a fan!',
        time: '2 hours ago',
        isRead: false
      },
      {
        id: '5',
        type: 'verification',
        title: 'Verification Update',
        message: 'Your verification request has been approved! 🎉',
        time: '1 day ago',
        isRead: true
      },
      {
        id: '6',
        type: 'live',
        title: 'Live Stream',
        message: 'sarah_creates is now live!',
        time: '2 days ago',
        isRead: true,
        username: 'sarah_creates'
      }
    ]);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return Users;
      case 'message': return MessageCircle;
      case 'subscription': return Crown;
      case 'verification': return Star;
      case 'tip': return Gift;
      case 'live': return Video;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-red-400';
      case 'comment': return 'text-blue-400';
      case 'follow': return 'text-green-400';
      case 'message': return 'text-purple-400';
      case 'subscription': return 'text-luxury-primary';
      case 'verification': return 'text-yellow-400';
      case 'tip': return 'text-orange-400';
      case 'live': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-luxury-primary" />
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="text-white hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              onClick={() => setFilter('all')}
              className={filter === 'all' 
                ? 'bg-luxury-primary text-white' 
                : 'text-white hover:bg-white/10'
              }
              size="sm"
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              onClick={() => setFilter('unread')}
              className={filter === 'unread' 
                ? 'bg-luxury-primary text-white' 
                : 'text-white hover:bg-white/10'
              }
              size="sm"
            >
              Unread ({unreadCount})
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="border-luxury-primary/50 text-luxury-primary hover:bg-luxury-primary/10"
              size="sm"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Bell className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-white/60">
                {filter === 'unread' 
                  ? 'You\'re all caught up!' 
                  : 'When you get notifications, they\'ll appear here.'
                }
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card 
                    className={`transition-all cursor-pointer hover:border-luxury-primary/40 ${
                      notification.isRead 
                        ? 'bg-black/20 border-white/10' 
                        : 'bg-black/40 border-luxury-primary/30'
                    } backdrop-blur-sm`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-black/40 ${iconColor}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        
                        {notification.avatar && (
                          <img 
                            src={notification.avatar} 
                            alt={notification.username}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-sm">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-luxury-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-white/80 text-sm mb-2">
                            {notification.message}
                          </p>
                          <p className="text-white/50 text-xs">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-white/60 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;