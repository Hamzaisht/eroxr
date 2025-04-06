
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the username for the watermark from the user ID
 */
export const getUsernameForWatermark = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.username || 'eroxr';
  } catch (error) {
    console.error('Error fetching username for watermark:', error);
    return 'eroxr';
  }
};

/**
 * Renders a watermark on a video or image element using canvas
 */
export const applyCanvasWatermark = (
  element: HTMLVideoElement | HTMLImageElement,
  username: string,
  options: {
    fontSize?: number;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  } = {}
): HTMLCanvasElement => {
  const { fontSize = 14, position = 'bottom-right' } = options;
  
  // Create canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Canvas context not available');
    return canvas;
  }
  
  // Set canvas dimensions based on element type
  let width = 0;
  let height = 0;
  
  if (element instanceof HTMLVideoElement) {
    // It's a video element
    width = element.videoWidth || element.clientWidth || 300;
    height = element.videoHeight || element.clientHeight || 150;
  } else if (element instanceof HTMLImageElement) {
    // It's an image element
    width = element.naturalWidth || element.clientWidth || 300;
    height = element.naturalHeight || element.clientHeight || 150;
  } else {
    // This code should not be reached, but providing fallback
    width = 300;
    height = 150;
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw the original content to the canvas
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
  
  // Prepare watermark text
  const watermarkText = `www.eroxr.com/@${username}`;
  
  // Adjust font size based on canvas dimensions for responsive scaling
  const actualFontSize = Math.min(
    Math.max(fontSize, canvas.width * 0.014), // Min fontSize, or 1.4% of width
    canvas.width * 0.02 // Max 2% of width
  );
  
  ctx.font = `500 ${actualFontSize}px sans-serif`;
  ctx.textBaseline = 'bottom';
  
  // Measure text for positioning
  const textMetrics = ctx.measureText(watermarkText);
  const textWidth = textMetrics.width;
  
  // Position the watermark based on the requested position
  let x = 0;
  let y = 0;
  
  const padding = 12; // 12px from edge
  
  if (position === 'bottom-right') {
    x = canvas.width - textWidth - padding;
    y = canvas.height - padding;
  } else if (position === 'bottom-left') {
    x = padding;
    y = canvas.height - padding;
  } else if (position === 'top-right') {
    x = canvas.width - textWidth - padding;
    y = actualFontSize + padding;
  } else if (position === 'top-left') {
    x = padding;
    y = actualFontSize + padding;
  }
  
  // Draw text with shadow for better visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(watermarkText, x, y);
  
  return canvas;
};

/**
 * Creates a watermarked version of an uploaded image
 */
export const createWatermarkedImage = async (
  imageUrl: string,
  userId: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const username = await getUsernameForWatermark(userId);
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = applyCanvasWatermark(img, username, {
          fontSize: 14,
          position: 'bottom-right'
        });
        
        const watermarkedUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(watermarkedUrl);
      };
      
      img.onerror = (e) => {
        console.error('Error loading image for watermarking:', e);
        reject('Failed to load image for watermarking');
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error('Error creating watermarked image:', error);
      reject(error);
    }
  });
};

// CSS overlay watermark (used when canvas rendering isn't possible)
export const generateWatermarkCSS = (username: string): string => {
  return `
    .watermark-overlay {
      position: absolute;
      bottom: 12px;
      right: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      z-index: 10;
      pointer-events: none;
      text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.8), 
                   0px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    @media screen and (min-width: 768px) {
      .watermark-overlay {
        font-size: 14px;
      }
    }
  `;
};
