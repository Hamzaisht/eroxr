
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the username for watermarking content
 * @param userId User ID to look up
 * @returns Username string
 */
export const getUsernameForWatermark = async (userId: string): Promise<string> => {
  if (!userId) return 'unknown';
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error("Error fetching username for watermark:", error);
      return 'unknown';
    }
    
    console.log("Successfully fetched username:", data.username);
    return data.username || 'unknown';
  } catch (error) {
    console.error("Exception when fetching username:", error);
    return 'unknown';
  }
};

/**
 * Applies a text watermark to an image canvas
 * @param canvas Canvas element to apply watermark to
 * @param text Watermark text
 */
export const applyWatermarkToCanvas = (
  canvas: HTMLCanvasElement,
  text: string,
  options?: {
    position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
    fontSize?: number,
    opacity?: number
  }
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const {
    position = 'bottomRight',
    fontSize = Math.max(16, canvas.width * 0.02),
    opacity = 0.7
  } = options || {};
  
  // Setup text style
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  const padding = fontSize / 2;
  const textWidth = ctx.measureText(text).width;
  
  // Determine position
  let x, y;
  switch(position) {
    case 'topLeft':
      x = padding;
      y = fontSize + padding;
      break;
    case 'topRight':
      x = canvas.width - textWidth - padding;
      y = fontSize + padding;
      break;
    case 'bottomLeft':
      x = padding;
      y = canvas.height - padding;
      break;
    case 'bottomRight':
    default:
      x = canvas.width - textWidth - padding;
      y = canvas.height - padding;
  }
  
  // Draw watermark text
  ctx.fillText(text, x, y);
};

/**
 * Creates a watermarked version of an image
 * @param imageUrl Original image URL
 * @param username Username for the watermark
 * @returns Promise that resolves to the watermarked image blob
 */
export const createWatermarkedImage = async (
  imageUrl: string, 
  username: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas at image size
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Add watermark
        const watermarkText = `www.eroxr.com/@${username}`;
        applyWatermarkToCanvas(canvas, watermarkText);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image from ${imageUrl}`));
    };
    
    // Start loading the image
    img.src = imageUrl;
  });
};

/**
 * Checks if browser supports image manipulation
 * @returns boolean indicating support
 */
export const supportsBrowserWatermarking = (): boolean => {
  return typeof document !== 'undefined' && 
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof Blob !== 'undefined';
};
