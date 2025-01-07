import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar";
import { PencilIcon } from "lucide-react";

interface AvatarImageProps {
  src?: string | null;
  username?: string | null;
  onImageClick?: () => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatarImage = ({ src, username, onImageClick, onFileSelect }: AvatarImageProps) => {
  return (
    <div className="relative group">
      <Avatar 
        className="h-48 w-48 rounded-full overflow-hidden bg-luxury-darker cursor-pointer [&:hover]:shadow-[0_0_50px_rgba(217,70,239,0.25)]"
        onClick={(e) => {
          e.stopPropagation();
          onImageClick?.();
        }}
      >
        <UIAvatarImage 
          src={src || ""} 
          alt={username || "Avatar"}
          className="h-full w-full object-cover"
        />
        <AvatarFallback className="text-4xl bg-luxury-darker text-luxury-primary">
          {username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      
      {onFileSelect && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
          <label className="cursor-pointer p-4 rounded-full hover:bg-white/10 transition-colors">
            <PencilIcon className="w-8 h-8 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onFileSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </label>
        </div>
      )}
    </div>
  );
};