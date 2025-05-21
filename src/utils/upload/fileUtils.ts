
/**
 * Comprehensive file diagnostics for debugging upload issues
 */
export const runFileDiagnostic = (file: File | null): boolean => {
  if (!file) {
    console.error("❌ File diagnostic: No file provided");
    return false;
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
    return false;
  }
  
  if (file.size === 0) {
    console.error("❌ File diagnostic: Zero byte file");
    return false;
  }
  
  if (!file.type) {
    console.warn("⚠️ File diagnostic: Missing MIME type");
  }
  
  console.log("✅ File diagnostic: Valid file object");
  return true;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

/**
 * Validates a file before upload
 */
export const validateFileForUpload = (file: File, maxSizeInMB: number = 100): { valid: boolean, error?: string } => {
  // Run diagnostic first
  runFileDiagnostic(file);
  
  // Basic validation
  if (!file) {
    return { valid: false, error: "No file provided" };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: "Invalid file object" };
  }
  
  if (file.size === 0) {
    return { valid: false, error: "File has zero size" };
  }
  
  // Size validation
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { 
      valid: false, 
      error: `File exceeds maximum size (${formatFileSize(file.size)} > ${maxSizeInMB}MB)` 
    };
  }
  
  return { valid: true };
};
