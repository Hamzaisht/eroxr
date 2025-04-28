
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { SkeletonLoader } from "./SkeletonLoader";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderColor?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export const LazyImage = ({
  src,
  alt,
  className,
  width,
  height,
  placeholderColor = "#1A1F2C",
  priority = false,
  objectFit = "cover"
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({ triggerOnce: true });
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // If priority is true or the image is in view, load the image
    if ((isInView || priority) && imageRef.current) {
      const img = imageRef.current;
      
      if (img.complete) {
        setIsLoaded(true);
      } else {
        // If image is not loaded yet, set up event listeners
        const onLoad = () => setIsLoaded(true);
        const onError = () => {
          console.error(`Failed to load image: ${src}`);
          setError(true);
          setIsLoaded(true); // Consider it "loaded" even though it failed
        };
        
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        
        return () => {
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
        };
      }
    }
  }, [src, isInView, priority]);
  
  // Preload priority images immediately
  useEffect(() => {
    if (priority) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = src;
      document.head.appendChild(preloadLink);
      
      return () => {
        document.head.removeChild(preloadLink);
      };
    }
  }, [src, priority]);

  return (
    <div 
      ref={ref} 
      className={cn("relative overflow-hidden", className)}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <SkeletonLoader 
          className="absolute inset-0" 
          animate={true} 
        />
      )}
      
      {/* Image */}
      <motion.img
        ref={imageRef}
        src={isInView || priority ? src : ''}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-500",
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100'
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        loading={priority ? "eager" : "lazy"}
        style={{ objectFit }}
        width={width}
        height={height}
      />
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-dark/80 text-white text-sm">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};
