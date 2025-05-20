import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Image } from "next/image";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface StoryCardProps {
  username: string;
  avatarUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  creatorId: string;
  type?: 'circle' | 'square';
  status?: 'online' | 'offline';
  isSelf?: boolean;
  onClick?: () => void;
}

export const StoryCard = ({
  username,
  avatarUrl,
  mediaUrl,
  mediaType,
  creatorId,
  type = 'circle',
  status,
  isSelf = false,
  onClick,
}: StoryCardProps) => {
  const size = type === 'circle' ? 60 : 80;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        type === 'circle' ? 'w-[70px] h-[70px]' : 'w-[90px] h-[110px]',
        isSelf ? 'cursor-pointer' : 'cursor-default'
      )}
      onClick={handleClick}
    >
      <div className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-fit">
        <p className="text-xs text-nowrap text-center text-gray-400">{username}</p>
      </div>
      
      <div className={cn(
        "relative flex items-center justify-center overflow-hidden",
        type === 'circle' ? 'w-[60px] h-[60px]' : 'w-[80px] h-[80px]',
        type === 'circle' ? 'rounded-full' : 'rounded-md',
        status === 'online' ? 'ring-4 ring-green-500 ring-offset-2' : '',
        status === 'offline' ? 'ring-2 ring-gray-400 ring-offset-1' : ''
      )}>
        {avatarUrl && (
          <div className={cn(
            "absolute inset-0",
            type === 'circle' ? 'rounded-full' : 'rounded-md'
          )}>
            <Image
              src={avatarUrl}
              alt={`${username}'s avatar`}
              width={size}
              height={size}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
        )}
        
        {mediaUrl && mediaType && (
          <div className={cn(
            "absolute inset-0",
            type === 'circle' ? 'rounded-full' : 'rounded-md'
          )}>
            <UniversalMedia
              item={{
                url: mediaUrl,
                type: mediaType === 'video' ? MediaType.VIDEO : MediaType.IMAGE
              }}
              className="object-cover w-full h-full rounded-full"
              autoPlay={false}
              controls={false}
              muted={true}
            />
          </div>
        )}
      </div>
      
      {isSelf && (
        <div className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
          +
        </div>
      )}
    </div>
  );
};
