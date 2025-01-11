import { Eye, MessageCircle, MousePointer } from 'lucide-react';

interface ProfileStatsProps {
  viewCount: number;
  messageCount: number;
  clickCount: number;
}

export const ProfileStats = ({ viewCount, messageCount, clickCount }: ProfileStatsProps) => {
  return (
    <div className="absolute top-6 right-6 flex items-center gap-4 px-4 py-2 rounded-full bg-luxury-dark/40 backdrop-blur-sm border border-luxury-primary/20">
      <div className="flex items-center gap-2 text-sm text-luxury-neutral">
        <Eye className="w-4 h-4 text-luxury-primary" />
        <span>{viewCount || 0}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-luxury-neutral">
        <MessageCircle className="w-4 h-4 text-luxury-primary" />
        <span>{messageCount || 0}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-luxury-neutral">
        <MousePointer className="w-4 h-4 text-luxury-primary" />
        <span>{clickCount || 0}</span>
      </div>
    </div>
  );
};