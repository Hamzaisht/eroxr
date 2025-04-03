
/**
 * A utility function that provides replaceAll functionality for environments
 * where the native method isn't available
 */
export function replaceAllString(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}
