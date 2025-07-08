
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DatingAd } from '../../../types/dating';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserInfoProps {
  ad: DatingAd;
}

export const UserInfo = ({ ad }: UserInfoProps) => {
  const getActiveStatus = () => {
    if (!ad.last_active) return null;
    
    const lastActive = new Date(ad.last_active);
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 15) {
      return { status: 'Online', className: 'bg-green-500' };
    } else if (minutes < 120) {
      return { status: 'Recently active', className: 'bg-yellow-500' };
    } else {
      return { status: 'Offline', className: 'bg-gray-500' };
    }
  };
  
  const activeStatus = getActiveStatus();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 border border-luxury-primary/20">
          <AvatarImage src={ad.avatarUrl || ad.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${ad.title}&backgroundColor=6366f1`} />
          <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
            {ad.title?.charAt(0).toUpperCase() || ad.username?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-white line-clamp-1">{ad.title}</div>
          <div className="flex items-center text-xs text-luxury-neutral">
            {activeStatus ? (
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1.5 ${activeStatus.className}`}></div>
                <span>{activeStatus.status}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>
                  {ad.created_at && formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
