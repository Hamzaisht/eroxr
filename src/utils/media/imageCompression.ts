
/**
 * Image compression utilities
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses an image file to reduce its size
 * @param file The image file to compress
 * @param options Compression options (maxWidth, maxHeight, quality)
 * @returns A Promise that resolves to the compressed image as a Blob
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8 } = options;
  
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();
    
    reader.onload = (readerEvent) => {
      // Create an image to calculate dimensions
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }
        
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the resized image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert the canvas to a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create compressed image blob'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg', // Convert all images to JPEG for consistency
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      // Set the image source from the FileReader
      img.src = readerEvent.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file for compression'));
    };
    
    // Read the file as DataURL
    reader.readAsDataURL(file);
  });
}
