
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
  const { fontSize = 16, position = 'bottom-right' } = options;
  
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
    Math.max(fontSize, canvas.width * 0.016), // Min 16px, or 1.6% of width
    canvas.width * 0.025 // Max 2.5% of width
  );
  
  ctx.font = `semibold ${actualFontSize}px sans-serif`;
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'bottom';
  
  // Measure text for positioning
  const textMetrics = ctx.measureText(watermarkText);
  const textWidth = textMetrics.width;
  const textHeight = actualFontSize;
  
  // Position the watermark based on the requested position
  let x = 0;
  let y = 0;
  
  const padding = actualFontSize / 2; // Padding around text
  
  if (position === 'bottom-right') {
    x = canvas.width - textWidth - padding;
    y = canvas.height - padding;
  } else if (position === 'bottom-left') {
    x = padding;
    y = canvas.height - padding;
  } else if (position === 'top-right') {
    x = canvas.width - textWidth - padding;
    y = textHeight + padding;
  } else if (position === 'top-left') {
    x = padding;
    y = textHeight + padding;
  }
  
  // Draw shadow/background for better visibility
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(
    x - padding / 2, 
    y - textHeight - padding / 2, 
    textWidth + padding, 
    textHeight + padding
  );
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.fillText(watermarkText, x, y - padding / 2);
  
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
          fontSize: 16,
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
      bottom: 8px;
      right: 8px;
      padding: 4px 6px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      font-size: 14px;
      font-weight: 600;
      font-family: sans-serif;
      border-radius: 2px;
      pointer-events: none;
      z-index: 10;
    }
    
    @media screen and (min-width: 768px) {
      .watermark-overlay {
        font-size: 18px;
        padding: 6px 8px;
      }
    }
  `;
};
