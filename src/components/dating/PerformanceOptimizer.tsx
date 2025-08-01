import { memo, useMemo, useCallback, useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { DatingAd } from '@/types/dating';

// Memoized profile card component
export const OptimizedProfileCard = memo(({ 
  ad, 
  onSelect, 
  onLike,
  isVisible = true 
}: { 
  ad: DatingAd; 
  onSelect: (ad: DatingAd) => void;
  onLike: (ad: DatingAd) => void;
  isVisible?: boolean;
}) => {
  // Only render if visible (for virtualization)
  if (!isVisible) {
    return <div className="h-80 w-full" />;
  }

  const handleSelect = useCallback(() => {
    onSelect(ad);
  }, [ad, onSelect]);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(ad);
  }, [ad, onLike]);

  // Memoize expensive calculations
  const profileScore = useMemo(() => {
    return calculateProfileCompleteness(ad);
  }, [ad.title, ad.description, ad.tags, ad.avatar_url]);

  const displayData = useMemo(() => ({
    title: ad.title,
    location: `${ad.city}, ${ad.country}`,
    ageDisplay: `${ad.age} years old`,
    tagCount: ad.tags?.length || 0,
    isOnline: ad.last_active && isRecentlyActive(ad.last_active)
  }), [ad.title, ad.city, ad.country, ad.age, ad.tags, ad.last_active]);

  return (
    <div 
      className="dating-card-hover dating-glass-panel rounded-xl overflow-hidden cursor-pointer will-change-transform"
      onClick={handleSelect}
      role="button"
      aria-label={`View profile of ${displayData.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {/* Optimized image loading */}
      <div className="aspect-video relative overflow-hidden">
        <OptimizedImage
          src={ad.avatar_url || ad.avatarUrl || ''}
          alt={`${displayData.title}'s profile`}
          preset="profile_card"
          bucket="avatars"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          priority={isVisible}
          fallbackSrc={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayData.title)}&backgroundColor=6366f1`}
        />
        
        {/* Status indicator */}
        {displayData.isOnline && (
          <div className="absolute top-2 left-2 status-online w-3 h-3 rounded-full" />
        )}
        
        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 dating-glass-panel action-button-glow p-2 rounded-full"
          aria-label={`Like ${displayData.title}'s profile`}
        >
          <span className="text-red-400">♥</span>
        </button>
      </div>

      {/* Profile info */}
      <div className="p-4">
        <h3 className="font-bold text-white truncate mb-1">
          {displayData.title}
        </h3>
        <p className="text-sm text-white/70 mb-2">
          {displayData.location}
        </p>
        <p className="text-xs text-white/60 mb-3">
          {displayData.ageDisplay}
        </p>
        
        {/* Tags preview */}
        {displayData.tagCount > 0 && (
          <div className="flex gap-1 flex-wrap">
            {ad.tags?.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300"
              >
                {tag}
              </span>
            ))}
            {displayData.tagCount > 3 && (
              <span className="text-xs text-white/50">
                +{displayData.tagCount - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Profile completeness indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
              style={{ width: `${profileScore}%` }}
            />
          </div>
          <span className="text-xs text-white/60">{profileScore}%</span>
        </div>
      </div>
    </div>
  );
});

// Performance utilities
function calculateProfileCompleteness(ad: DatingAd): number {
  const fields = [
    ad.title,
    ad.description,
    ad.avatar_url || ad.avatarUrl,
    ad.tags?.length,
    ad.city,
    ad.age
  ];
  
  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}

function isRecentlyActive(lastActive: string): boolean {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return new Date(lastActive) > oneHourAgo;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        const observer = new IntersectionObserver(([entry]) => {
          callback(entry.isIntersecting);
        }, {
          threshold: 0.1,
          rootMargin: '50px',
          ...options
        });
        
        observer.observe(node);
        
        return () => observer.disconnect();
      }
    },
    [callback, options]
  );
  
  return observerRef;
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling(
  items: any[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      index: visibleStart + index
    }));
  }, [items, visibleStart, visibleEnd]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
}

// Image preloader for better UX
export function preloadImages(urls: string[]) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}