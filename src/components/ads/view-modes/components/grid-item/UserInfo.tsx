
import { OptimizedAvatar } from "@/components/ui/OptimizedImage";
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
        <OptimizedAvatar
          src={ad.avatarUrl || ad.avatar_url}
          username={ad.title || ad.username || 'User'}
          size="sm"
          className="h-8 w-8 border border-luxury-primary/20"
        />
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
