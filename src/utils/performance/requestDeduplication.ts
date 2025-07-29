import { supabase } from '@/integrations/supabase/client';

// Global request tracking
const pendingRequests = new Map<string, Promise<any>>();
const requestStats = new Map<string, { count: number; lastRequest: number }>();

interface RequestOptions {
  timeout?: number;
  retries?: number;
  cacheTime?: number;
  priority?: 'low' | 'normal' | 'high';
}

// Generate cache key from request parameters
function generateCacheKey(
  table: string,
  method: string,
  params?: any,
  options?: RequestOptions
): string {
  const key = {
    table,
    method,
    params: params ? JSON.stringify(params) : null,
    priority: options?.priority || 'normal',
  };
  
  return btoa(JSON.stringify(key)).substring(0, 32);
}

// Request deduplication wrapper
export async function deduplicatedRequest<T>(
  requestFn: () => Promise<T>,
  cacheKey: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 30000, retries = 3, priority = 'normal' } = options;
  
  // Check if request is already pending
  const existing = pendingRequests.get(cacheKey);
  if (existing) {
    console.log(`🔄 Deduplicating request: ${cacheKey}`);
    return existing as Promise<T>;
  }

  // Track request statistics
  const stats = requestStats.get(cacheKey) || { count: 0, lastRequest: 0 };
  stats.count++;
  stats.lastRequest = Date.now();
  requestStats.set(cacheKey, stats);

  // Rate limiting check
  if (stats.count > 10 && (Date.now() - stats.lastRequest) < 1000) {
    console.warn(`⚠️ Rate limiting request: ${cacheKey}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Create the request with timeout and retry logic
  const requestWithRetries = async (attempt = 1): Promise<T> => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      const result = await Promise.race([requestFn(), timeoutPromise]);
      return result;
    } catch (error) {
      console.error(`❌ Request attempt ${attempt} failed for ${cacheKey}:`, error);
      
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff
        console.log(`🔄 Retrying request ${cacheKey} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return requestWithRetries(attempt + 1);
      }
      
      throw error;
    }
  };

  // Execute request
  const promise = requestWithRetries().finally(() => {
    pendingRequests.delete(cacheKey);
  });

  pendingRequests.set(cacheKey, promise);
  return promise;
}

// Optimized Supabase query wrapper
export async function optimizedSupabaseQuery(
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert',
  params: any = {},
  options: RequestOptions = {}
) {
  const cacheKey = generateCacheKey(table, operation, params, options);
  
  const requestFn = async () => {
    let query;
    
    switch (operation) {
      case 'select':
        query = supabase.from(table).select(params.select || '*');
        break;
      case 'insert':
        query = supabase.from(table).insert(params.data);
        break;
      case 'update':
        query = supabase.from(table).update(params.data);
        break;
      case 'delete':
        query = supabase.from(table).delete();
        break;
      case 'upsert':
        query = supabase.from(table).upsert(params.data);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
    
    const result = await query;
    return result;
  };
  
  return deduplicatedRequest(requestFn, cacheKey, options);
}

// Batch request processing
export class RequestBatcher {
  private batches = new Map<string, {
    requests: Array<{ resolve: Function; reject: Function; params: any }>;
    timer: NodeJS.Timeout;
  }>();
  
  private batchDelay = 50; // 50ms batch window
  private maxBatchSize = 10;

  async addToBatch<T>(
    table: string,
    operation: string,
    params: any,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const batchKey = `${table}_${operation}`;
    
    return new Promise<T>((resolve, reject) => {
      let batch = this.batches.get(batchKey);
      
      if (!batch) {
        batch = {
          requests: [],
          timer: setTimeout(() => this.processBatch(batchKey, requestFn), this.batchDelay),
        };
        this.batches.set(batchKey, batch);
      }
      
      batch.requests.push({ resolve, reject, params });
      
      // Process immediately if batch is full
      if (batch.requests.length >= this.maxBatchSize) {
        clearTimeout(batch.timer);
        this.processBatch(batchKey, requestFn);
      }
    });
  }
  
  private async processBatch<T>(batchKey: string, requestFn: () => Promise<T>) {
    const batch = this.batches.get(batchKey);
    if (!batch) return;
    
    this.batches.delete(batchKey);
    
    try {
      console.log(`🔧 Processing batch of ${batch.requests.length} requests for ${batchKey}`);
      
      // Process all requests in the batch
      const results = await Promise.allSettled(
        batch.requests.map(({ params }) => requestFn())
      );
      
      // Resolve/reject individual promises
      results.forEach((result, index) => {
        const request = batch.requests[index];
        if (result.status === 'fulfilled') {
          request.resolve(result.value);
        } else {
          request.reject(result.reason);
        }
      });
      
    } catch (error) {
      // Reject all requests in case of batch failure
      batch.requests.forEach(({ reject }) => reject(error));
    }
  }
}

// Global request batcher instance
export const globalBatcher = new RequestBatcher();

// Get request statistics
export function getRequestStats() {
  return {
    pendingRequests: pendingRequests.size,
    requestStats: Object.fromEntries(requestStats),
    pendingKeys: Array.from(pendingRequests.keys()),
  };
}

// Clear request statistics
export function clearRequestStats() {
  requestStats.clear();
  console.log('📊 Request statistics cleared');
}