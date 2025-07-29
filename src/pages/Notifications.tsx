import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { FixedBackButton } from "@/components/ui/fixed-back-button";
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
}

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        title: 'New Like',
        message: 'Sarah liked your recent post',
        time: '2 hours ago',
        isRead: false
      },
      {
        id: '2',
        type: 'follow',
        title: 'New Follower',
        message: 'Mike started following you',
        time: '5 hours ago',
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <React.Fragment>
      <InteractiveNav />
      <div className="md:ml-20 p-4">
        <FixedBackButton />
      </div>
      <div className="min-h-screen bg-luxury-gradient md:ml-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-luxury-primary" />
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
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

          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="text-white border-white/20"
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
                className="text-white border-white/20"
              >
                Unread ({unreadCount})
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-white/70 hover:text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>

            {filteredNotifications.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-md border-white/10">
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">No notifications yet</p>
                  <p className="text-white/50 text-sm mt-2">
                    We'll notify you when something interesting happens
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-black/40 backdrop-blur-md border-white/10 cursor-pointer hover:bg-black/50 transition-colors ${!notification.isRead ? 'border-luxury-primary/30' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-white/70 mt-1">
                          {notification.type === 'like' && <Heart className="h-5 w-5" />}
                          {notification.type === 'follow' && <Users className="h-5 w-5" />}
                          {notification.type === 'message' && <MessageCircle className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{notification.title}</h3>
                          <p className="text-white/70 text-sm mt-1">{notification.message}</p>
                          <p className="text-white/50 text-xs mt-2">{notification.time}</p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-luxury-primary rounded-full"></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Notifications;