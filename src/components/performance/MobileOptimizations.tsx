import React, { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect device capabilities
  useEffect(() => {
    if (!isMobile) return;

    const detectDeviceCapabilities = () => {
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const hardwareConcurrency = navigator.hardwareConcurrency || 1;
      
      // Check for low-end device indicators
      const isLowEnd = 
        (deviceMemory && deviceMemory <= 2) || // Less than 2GB RAM
        hardwareConcurrency <= 2 || // 2 or fewer cores
        /Android.*4\.|Android.*5\.0|Android.*5\.1/.test(navigator.userAgent); // Old Android
      
      setIsLowEndDevice(isLowEnd);

      if (isLowEnd) {
        console.log('🔧 Low-end device detected, applying optimizations');
        
        // Apply performance optimizations for low-end devices
        document.documentElement.style.setProperty('--animation-speed', '0.5');
        document.documentElement.style.setProperty('--blur-amount', '2px');
        
        // Disable non-essential animations
        document.documentElement.classList.add('reduce-motion');
      }
    };

    detectDeviceCapabilities();
  }, [isMobile]);

  // Create scroll handler using useCallback at component level
  const handleScroll = useCallback(() => {
    if (isLowEndDevice) {
      // Throttle scroll events on low-end devices
      requestAnimationFrame(() => {
        // Scroll handling
      });
    }
  }, [isLowEndDevice]);

  // Optimize touch handling for mobile
  useEffect(() => {
    if (!isMobile) return;

    const optimizeTouchHandling = () => {
      // Add passive event listeners for better scroll performance
      const options = { passive: true };
      
      document.addEventListener('touchstart', () => {}, options);
      document.addEventListener('touchmove', () => {}, options);
      document.addEventListener('touchend', () => {}, options);
    };

    optimizeTouchHandling();
    
    if (isLowEndDevice) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobile, isLowEndDevice, handleScroll]);

  // Apply mobile-specific CSS optimizations
  useEffect(() => {
    if (!isMobile) return;

    const style = document.createElement('style');
    style.textContent = `
      /* Mobile Performance Optimizations */
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        user-select: text;
      }
      
      /* Optimize scrolling */
      .scroll-container {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      
      /* GPU acceleration for smooth animations */
      .mobile-optimized {
        transform: translateZ(0);
        will-change: transform;
      }
      
      /* Reduce motion for low-end devices */
      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      /* Touch target optimization */
      .touch-target {
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Viewport optimizations */
      @media screen and (max-width: 768px) {
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
        
        /* Optimize viewport units */
        .mobile-vh {
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height */
        }
        
        /* Improve readability */
        body {
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile]);

  return (
    <div className={`mobile-optimizations ${isMobile ? 'mobile-optimized' : ''} ${isLowEndDevice ? 'low-end-device' : ''}`}>
      {children}
    </div>
  );
};

// Hook for detecting performance capabilities
export const useDeviceCapabilities = () => {
  const isMobile = useIsMobile();
  const [capabilities, setCapabilities] = useState({
    isLowEndDevice: false,
    deviceMemory: 4,
    hardwareConcurrency: 4,
    supportsWebGL: true,
    supportsWebP: true,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const webglSupport = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      
      // Check WebP support
      const webpSupport = canvas.toDataURL('image/webp').indexOf('webp') !== -1;
      
      const isLowEnd = deviceMemory <= 2 || hardwareConcurrency <= 2;
      
      setCapabilities({
        isLowEndDevice: isLowEnd,
        deviceMemory,
        hardwareConcurrency,
        supportsWebGL: webglSupport,
        supportsWebP: webpSupport,
      });
    };

    checkCapabilities();
  }, []);

  return { isMobile, ...capabilities };
};