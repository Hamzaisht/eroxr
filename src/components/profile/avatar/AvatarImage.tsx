
import { useState } from "react";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarImageProps {
  src?: string | null;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onImageClick?: () => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const ProfileAvatarImage = ({ 
  src, 
  username, 
  size = 'xl',
  onImageClick,
  onFileSelect,
  className = ""
}: AvatarImageProps) => {
  const [imageError, setImageError] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12';
      case 'md': return 'w-16 h-16';
      case 'lg': return 'w-20 h-20';
      case 'xl': return 'w-32 h-32';
      default: return 'w-32 h-32';
    }
  };

  const getInitials = () => {
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    return '?';
  };

  const isEditable = onImageClick || onFileSelect;

  return (
    <div className={cn("relative group", getSizeClasses(), className)}>
      {/* Avatar Container */}
      <div className={cn(
        "relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl",
        isEditable && "cursor-pointer"
      )}>
        {src && !imageError ? (
          <img
            src={src}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            onClick={onImageClick}
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/20 flex items-center justify-center"
            onClick={onImageClick}
          >
            <User className="w-1/2 h-1/2 text-luxury-neutral/60" />
          </div>
        )}

        {/* Edit Overlay */}
        {isEditable && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-6 h-6 text-white mx-auto mb-1" />
              <span className="text-xs text-white font-medium">Change Photo</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      {onFileSelect && (
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}

      {/* Online Status Indicator */}
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
    </div>
  );
};
