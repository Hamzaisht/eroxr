
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

/**
 * Converts any value to a safe status string
 * @param value The value to convert
 * @returns A safe status string
 */
export function convertToStatus(value: any): string {
  if (value === null || value === undefined) return 'offline';
  return String(value).toLowerCase();
}

/**
 * Gets a safe profile object with default values for null fields
 * @param profile The profile object
 * @returns A safe profile object
 */
export function getSafeProfile(profile: any): any {
  if (!profile) return {};
  return {
    id: profile.id || '',
    username: profile.username || 'Anonymous',
    avatar_url: profile.avatar_url || '/default-avatar.png',
    status: convertToStatus(profile.status),
    ...profile
  };
}

/**
 * Safely accesses data from potentially undefined objects
 * @param obj The object to access data from
 * @param path The path to the data
 * @param defaultValue The default value if the path doesn't exist
 * @returns The accessed data or default value
 */
export function safeDataAccess(obj: any, path: string, defaultValue: any = null): any {
  if (!obj) return defaultValue;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Safely casts a value to a specified type
 * @param value The value to cast
 * @param type The type to cast to
 * @returns The casted value
 */
export function safeCast<T>(value: any, defaultValue: T): T {
  if (value === null || value === undefined) return defaultValue;
  return value as T;
}

/**
 * Converts a string to a UUID, with validation
 * @param value The string to convert
 * @returns The UUID or null if invalid
 */
export function asUUID(value: string): string | null {
  // Basic UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!value || !uuidRegex.test(value)) return null;
  return value;
}

/**
 * Converts a value to a column name with validation
 * @param value The value to convert
 * @returns The column name or a default value
 */
export function asColumnName(value: string): string {
  // Basic column name validation (alphanumeric and underscore)
  const columnRegex = /^[a-z0-9_]+$/i;
  if (!value || !columnRegex.test(value)) return 'id';
  return value;
}

/**
 * Converts a value to a column value with proper typing
 * @param value The value to convert
 * @returns The column value
 */
export function asColumnValue(value: any): any {
  return value;
}

/**
 * Converts a value to an ID verification status
 * @param value The value to convert
 * @returns The ID verification status
 */
export function asIdVerificationStatus(value: string): string {
  const validStatuses = ['verified', 'pending', 'rejected', 'not_submitted'];
  return validStatuses.includes(String(value).toLowerCase()) 
    ? String(value).toLowerCase() 
    : 'not_submitted';
}

/**
 * Converts a value to a live stream status
 * @param value The value to convert
 * @returns The live stream status
 */
export function asLiveStreamStatus(value: string): string {
  const validStatuses = ['live', 'scheduled', 'ended', 'canceled'];
  return validStatuses.includes(String(value).toLowerCase()) 
    ? String(value).toLowerCase() 
    : 'ended';
}

/**
 * Checks if a profile is suspended
 * @param value The value to check
 * @returns Whether the profile is suspended
 */
export function asProfileIsSuspended(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
}

/**
 * Converts a value to a profile status
 * @param value The value to convert
 * @returns The profile status
 */
export function asProfileStatus(value: string): string {
  const validStatuses = ['active', 'inactive', 'suspended', 'deleted'];
  return validStatuses.includes(String(value).toLowerCase()) 
    ? String(value).toLowerCase() 
    : 'inactive';
}

/**
 * Converts a value to a report status
 * @param value The value to convert
 * @returns The report status
 */
export function asReportStatus(value: string): string {
  const validStatuses = ['pending', 'reviewing', 'resolved', 'dismissed'];
  return validStatuses.includes(String(value).toLowerCase()) 
    ? String(value).toLowerCase() 
    : 'pending';
}
