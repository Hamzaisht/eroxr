
/**
 * Creates a unique file path for uploaded files
 * @param originalName Original file name
 * @returns Unique file path
 */
export function createUniqueFilePath(originalName: string): string {
  return `${Date.now()}-${originalName}`;
}
