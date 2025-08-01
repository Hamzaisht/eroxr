/**
 * Critical Optimized Image Component
 * Solves the 1-2 second loading delay issue
 */
import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedUrl, generateBlurPlaceholder, IMAGE_PRESETS } from '@/utils/media/imageOptimization';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  preset?: keyof typeof IMAGE_PRESETS;
  bucket?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // Load immediately vs lazy
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  preset = 'post_thumbnail',
  bucket = 'media',
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  onLoad,
  onError,
  fallbackSrc,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get optimized URL
  const optimizedSrc = getOptimizedUrl(src, preset, bucket);
  const blurPlaceholder = generateBlurPlaceholder(width, height);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const displaySrc = hasError && fallbackSrc 
    ? fallbackSrc 
    : isInView 
      ? optimizedSrc 
      : blurPlaceholder;

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        !isLoaded && 'animate-pulse',
        className
      )}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={blurPlaceholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main optimized image */}
      {isInView && (
        <img
          src={displaySrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // Add modern optimization attributes
          {...(width && { width })}
          {...(height && { height })}
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-white text-sm">
          Failed to load
        </div>
      )}
    </div>
  );
};

/**
 * Optimized Avatar Component - Ultra fast loading
 */
interface OptimizedAvatarProps {
  src?: string | null;
  userId?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

export const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  src,
  userId,
  username,
  size = 'md',
  className = '',
  priority = false,
}) => {
  const sizeMap = {
    sm: { width: 32, height: 32, preset: 'avatar_small' as const },
    md: { width: 40, height: 40, preset: 'avatar_medium' as const },
    lg: { width: 80, height: 80, preset: 'avatar_large' as const },
    xl: { width: 160, height: 160, preset: 'avatar_large' as const },
  };

  const { width, height, preset } = sizeMap[size];
  
  // Generate fallback if no src
  const fallbackSrc = !src && userId 
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username || userId)}&backgroundColor=6366f1`
    : undefined;

  const avatarSrc = src || fallbackSrc || '';

  if (!avatarSrc) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold',
          className
        )}
        style={{ width, height }}
      >
        {username?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={avatarSrc}
      alt={`${username || 'User'} avatar`}
      preset={preset}
      bucket="avatars"
      className={cn('rounded-full', className)}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
    />
  );
};