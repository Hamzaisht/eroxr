
/**
 * Runs comprehensive diagnostic on a file to check for potential issues
 */
export const runFileDiagnostic = (file: File | null): void => {
  if (!file) {
    console.error("❌ Null or undefined file object");
    return;
  }
  
  const diagnostics = {
    isFile: file instanceof File,
    size: file.size,
    type: file.type,
    name: file.name,
    lastModified: new Date(file.lastModified).toISOString(),
    validSize: file.size > 0,
    hasMimeType: !!file.type,
  };
  
  console.log("📋 File diagnostic:", diagnostics);
  
  if (!diagnostics.isFile) {
    console.error("❌ Not a valid File instance");
  }
  
  if (!diagnostics.validSize) {
    console.error("❌ File has no data (size: 0 bytes)");
  }
  
  if (!diagnostics.hasMimeType) {
    console.error("❌ File has no MIME type");
  }
};
