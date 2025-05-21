
/**
 * Comprehensive file diagnostics for debugging upload issues
 */
export const runFileDiagnostic = (file: File | null, options?: { maxSizeMB?: number, allowedTypes?: string[] }): { valid: boolean, message?: string } => {
  if (!file) {
    console.error("❌ File diagnostic: No file provided");
    return { valid: false, message: "No file provided" };
  }
  
  console.log("📋 File diagnostic report:", {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString(),
    isFile: file instanceof File,
    hasData: file.size > 0
  });
  
  // Check for common issues
  if (!(file instanceof File)) {
    console.error("❌ File diagnostic: Not a File instance");
    return { valid: false, message: "Not a File instance" };
  }
  
  if (file.size === 0) {
    console.error("❌ File diagnostic: Zero byte file");
    return { valid: false, message: "Zero byte file" };
  }
  
  if (!file.type) {
    console.warn("⚠️ File diagnostic: Missing MIME type");
  }
  
  // Check size if maxSizeMB is provided
  if (options?.maxSizeMB) {
    const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      console.error(`❌ File diagnostic: File too large (${formatFileSize(file.size)} > ${options.maxSizeMB}MB)`);
      return { valid: false, message: `File exceeds maximum size of ${options.maxSizeMB}MB` };
    }
  }
  
  // Check type if allowedTypes is provided
  if (options?.allowedTypes && options.allowedTypes.length > 0) {
    const isValidType = options.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    });
    
    if (!isValidType) {
      console.error(`❌ File diagnostic: Invalid file type ${file.type}`);
      return { valid: false, message: `Invalid file type: ${file.type}` };
    }
  }
  
  console.log("✅ File diagnostic: Valid file object");
  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

/**
 * Create a unique file path for upload
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop() || '';
  const contentType = file.type.split('/')[0] || 'misc';
  
  // Sanitize filename to remove special characters
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
    .substring(0, 20); // Limit length
  
  // Organize by user ID and file type
  return `${userId}/${contentType}s/${timestamp}-${sanitizedName}.${fileExt}`;
};

/**
 * Create a data URL preview for a file
 */
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to generate preview'));
      }
    };
    
    reader.onerror = () => {
      reject(reader.error || new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Revoke a data URL to prevent memory leaks
 */
export const revokeFilePreview = (dataUrl: string): void => {
  if (dataUrl.startsWith('blob:')) {
    URL.revokeObjectURL(dataUrl);
  }
};
