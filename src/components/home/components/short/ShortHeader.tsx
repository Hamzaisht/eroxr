
import { memo } from "react";
import { Short } from "../../types/short";

interface ShortHeaderProps {
  short: Short;
}

export const ShortHeader = memo(({ short }: ShortHeaderProps) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
        {short.creator?.avatar_url ? (
          <img 
            src={short.creator.avatar_url} 
            alt={short.creator?.username || 'User'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-luxury-primary/20 flex items-center justify-center">
            <span className="text-luxury-primary text-xl font-bold">
              {short.creator?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-medium text-white">{short.creator?.username || 'Anonymous'}</h4>
        <p className="text-sm text-white/70">
          {new Date(short.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
});

ShortHeader.displayName = "ShortHeader";
