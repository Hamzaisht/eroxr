
/**
 * Creates a unique file path for uploaded media files
 * @param userId User ID or other identifier
 * @param filename Original filename or File object
 * @returns A unique filepath with timestamp
 */
export function createUniqueFilePath(userId: string, filename: string | File): string {
  const actualFilename = filename instanceof File ? filename.name : filename;
  return `media/${userId}/${Date.now()}-${actualFilename}`;
}

/**
 * Creates a preview URL from a file
 * @param file File to create preview for
 * @returns URL for the preview
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a file preview URL to free up memory
 * @param url URL to revoke
 */
export function revokeFilePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Runs comprehensive diagnostic on a file
 * @param file File to diagnose
 */
export function runFileDiagnostic(file: File): void {
  if (!file) {
    console.error("❌ No file provided for diagnosis");
    return;
  }

  console.log("📋 File Diagnostic Report:");
  console.log(`- Name: ${file.name}`);
  console.log(`- Size: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`- Type: ${file.type}`);
  console.log(`- Last Modified: ${new Date(file.lastModified).toISOString()}`);
  console.log(`- Is File instance: ${file instanceof File}`);
}

/**
 * Validates a file for upload
 * @param file File to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateFileForUpload(
  file: File,
  options: { maxSizeInMB?: number; allowedTypes?: string[] } = {}
): { valid: boolean; error?: string } {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: "Invalid file object" };
  }

  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }

  // Size validation
  const maxSize = options.maxSizeInMB ? options.maxSizeInMB * 1024 * 1024 : 50 * 1024 * 1024; // Default 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File exceeds maximum size of ${options.maxSizeInMB || 50}MB`,
    };
  }

  // Type validation
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const fileType = file.type.toLowerCase();
    const isAllowedType = options.allowedTypes.some((type) =>
      fileType.includes(type.toLowerCase())
    );
    if (!isAllowedType) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${options.allowedTypes.join(", ")}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Checks if a file is an image
 * @param file File to check
 * @returns True if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Checks if a file is a video
 * @param file File to check
 * @returns True if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}
