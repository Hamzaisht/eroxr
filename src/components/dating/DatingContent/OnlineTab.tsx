import React from 'react';
import { Circle, Clock, MapPin, MessageCircle, Bookmark, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatingAd } from '@/components/ads/types/dating';

interface OnlineTabProps {
  session: any;
  userProfile: DatingAd | null;
}

export function OnlineTab({ session, userProfile }: OnlineTabProps) {
  // TODO: Implement actual online users query with bodycontact enabled
  const onlineUsers: DatingAd[] = []; // Placeholder

  const handleMessage = (user: DatingAd) => {
    console.log('Message user:', user.id);
  };

  const handleBookmark = (user: DatingAd) => {
    console.log('Bookmark user:', user.id);
  };

  const handleRequestConnection = (user: DatingAd) => {
    console.log('Request connection:', user.id);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl min-h-[300px]">
        <Circle className="h-12 w-12 text-green-400/40 mb-4" />
        <h3 className="text-xl font-bold text-green-400 mb-2">Sign in to See Online Users</h3>
        <p className="text-white/60 max-w-md">
          Connect with users who are online and have dating/bodycontact enabled.
        </p>
      </div>
    );
  }

  if (onlineUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl min-h-[300px]">
        <Circle className="h-12 w-12 text-green-400/40 mb-4" />
        <h3 className="text-xl font-bold text-green-400 mb-2">No Users Online</h3>
        <p className="text-white/60 max-w-md">
          No users with dating/bodycontact enabled are currently online. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Circle className="h-5 w-5 text-green-400 animate-pulse" />
        <h2 className="text-xl font-semibold text-green-400">Online Now ({onlineUsers.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onlineUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-luxury-darker/50 backdrop-blur-sm border border-green-400/20 rounded-xl overflow-hidden"
          >
            {/* User info and action buttons would go here */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Circle className="h-3 w-3 text-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMessage(user)}
                  className="flex-1 border-blue-400/30 hover:border-blue-400/60"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBookmark(user)}
                  className="border-yellow-400/30 hover:border-yellow-400/60"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRequestConnection(user)}
                  className="border-purple-400/30 hover:border-purple-400/60"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}