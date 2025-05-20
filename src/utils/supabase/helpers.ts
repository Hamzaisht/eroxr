/**
 * Converts a value to a database-friendly format
 * @param value Any value to convert
 * @returns Database-friendly value
 */
export function toDbValue(value: any): any {
  if (value === undefined) return null;
  return value;
}

/**
 * Ensures a string value is returned, handling nulls and undefined
 * @param value The value to convert to string
 * @returns A safe string value
 */
export function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Checks if a query error occurred
 * @param error Potential error object
 * @returns Whether the error is a query error
 */
export function isQueryError(error: any): boolean {
  return error && typeof error === 'object' && 'code' in error;
}

/**
 * Ensures user ID is set for Row Level Security optimization
 */
export async function ensureUserIdSet(): Promise<void> {
  // Implementation would depend on your authentication structure
  // This is a placeholder function
  return Promise.resolve();
}
