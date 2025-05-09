
/**
 * Creates a preview URL for a file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a file preview URL to free memory
 */
export function revokeFilePreview(url: string | null): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Logs detailed file information for debugging
 */
export function logFileDebugInfo(file: File): void {
  console.log("FILE DEBUG >>>", {
    name: file.name,
    size: file.size,
    type: file.type,
    isFile: file instanceof File,
    isBlob: file instanceof Blob,
    lastModified: file.lastModified,
    preview: URL.createObjectURL(file)
  });
}

/**
 * Generates a unique file path for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop() || '';
  
  return `${userId}/${timestamp}-${random}.${fileExt}`;
}

/**
 * Run comprehensive file diagnostic to validate file integrity
 * CRITICAL: Call this before every upload to validate file integrity
 */
export function runFileDiagnostic(file: File | Blob | any): void {
  try {
    // Attempt to create a URL to verify we can access the file data
    let previewUrl = null;
    try {
      previewUrl = file ? URL.createObjectURL(file) : "FAILED";
    } catch (err) {
      console.error("🚨 Failed to create object URL from file:", err);
    }

    console.log("🧬 FILE DIAGNOSTIC", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      isFile: file instanceof File,
      isBlob: file instanceof Blob,
      url: previewUrl,
      lastModified: file?.lastModified,
      toString: Object.prototype.toString.call(file),
    });
    
    // Clean up the URL we created
    if (previewUrl && previewUrl !== "FAILED") {
      URL.revokeObjectURL(previewUrl);
    }
  } catch (err) {
    console.error("🧬 FILE DIAGNOSTIC FAILED:", err);
  }
}

/**
 * Validate that the file is suitable for upload
 * CRITICAL: Call this before every upload to prevent invalid file uploads
 */
export function validateFileForUpload(file: any): { valid: boolean; message?: string } {
  if (!file) {
    return { valid: false, message: "No file provided" };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, message: "Invalid file object. The provided data is not a File instance." };
  }
  
  if (file.size === 0) {
    return { valid: false, message: `File "${file.name}" is empty (0 bytes)` };
  }
  
  // Check if we can create a preview URL as a test of file integrity
  try {
    const previewUrl = URL.createObjectURL(file);
    URL.revokeObjectURL(previewUrl); // Clean up immediately
  } catch (err) {
    return { 
      valid: false, 
      message: "File data is corrupted or inaccessible" 
    };
  }
  
  return { valid: true };
}
