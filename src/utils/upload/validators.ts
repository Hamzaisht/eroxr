
// Supported file types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
export const SUPPORTED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// File validation helpers
export function validateFileType(file: File, allowedTypes: string[]): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported. Please use: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
}

export function validateFileSize(file: File, maxSizeInMB: number = 10): { valid: boolean; error?: string } {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeInMB}MB.`
    };
  }
  
  return { valid: true };
}

export function validateImageDimensions(
  file: File, 
  minWidth?: number, 
  minHeight?: number, 
  maxWidth?: number, 
  maxHeight?: number
): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ valid: false, error: 'Not an image file' });
      return;
    }
    
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const errors = [];
      
      if (minWidth && image.width < minWidth) {
        errors.push(`Image width is ${image.width}px but minimum is ${minWidth}px`);
      }
      
      if (minHeight && image.height < minHeight) {
        errors.push(`Image height is ${image.height}px but minimum is ${minHeight}px`);
      }
      
      if (maxWidth && image.width > maxWidth) {
        errors.push(`Image width is ${image.width}px but maximum is ${maxWidth}px`);
      }
      
      if (maxHeight && image.height > maxHeight) {
        errors.push(`Image height is ${image.height}px but maximum is ${maxHeight}px`);
      }
      
      if (errors.length > 0) {
        resolve({ valid: false, error: errors.join('. ') });
      } else {
        resolve({ valid: true });
      }
    };
    
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, error: 'Failed to load image' });
    };
    
    image.src = objectUrl;
  });
}

// Validation for all aspects of a file upload
export function validateFile(
  file: File, 
  options: {
    allowedTypes?: string[];
    maxSizeInMB?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const { 
    allowedTypes = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES],
    maxSizeInMB = 50,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight
  } = options;
  
  // Check file type
  const typeResult = validateFileType(file, allowedTypes);
  if (!typeResult.valid) {
    return Promise.resolve(typeResult);
  }
  
  // Check file size
  const sizeResult = validateFileSize(file, maxSizeInMB);
  if (!sizeResult.valid) {
    return Promise.resolve(sizeResult);
  }
  
  // Check image dimensions if it's an image file
  if (file.type.startsWith('image/') && (minWidth || minHeight || maxWidth || maxHeight)) {
    return validateImageDimensions(file, minWidth, minHeight, maxWidth, maxHeight);
  }
  
  return Promise.resolve({ valid: true });
}
