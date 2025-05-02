
/**
 * Compresses an image file to reduce size while maintaining acceptable quality
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns A Promise that resolves to the compressed image as a Blob
 */
export async function compressImage(
  file: File,
  options = { maxWidth: 1920, maxHeight: 1920, quality: 0.85 }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { maxWidth, maxHeight, quality } = options;
    
    // Create file reader to read the file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    // Handle file load
    reader.onload = (event) => {
      // Create an image to get dimensions
      const img = new Image();
      img.src = event.target?.result as string;
      
      // Once image is loaded, resize and compress it
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image to canvas with new dimensions
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
      
      // Handle image load error
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    };
    
    // Handle reader error
    reader.onerror = () => {
      reject(new Error('Failed to read file for compression'));
    };
  });
}

/**
 * Gets dimensions of an image file
 * @param file - The image file
 * @returns Promise resolving to the image dimensions
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}
