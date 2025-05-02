
/**
 * Compresses an image using canvas
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise resolving to the compressed image as a Blob
 */
export async function compressImage(
  file: File,
  options = { maxWidth: 1920, maxHeight: 1920, quality: 0.85 }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { maxWidth, maxHeight, quality } = options;
    
    // Create an image element to load the file
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      // Calculate new dimensions preserving aspect ratio
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
      
      // Create a canvas to draw the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw the resized image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get 2D context from canvas'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert the canvas to a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    // Read the file as data URL
    reader.readAsDataURL(file);
  });
}
