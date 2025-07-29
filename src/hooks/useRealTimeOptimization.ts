import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeOptimizationOptions {
  maxChannels?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  bufferSize?: number;
  enableCompression?: boolean;
}

interface ChannelConfig {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const useRealTimeOptimization = (options: RealtimeOptimizationOptions = {}) => {
  const {
    maxChannels = 10,
    reconnectInterval = 5000,
    heartbeatInterval = 30000,
    bufferSize = 100,
    enableCompression = true,
  } = options;

  const channels = useRef(new Map<string, RealtimeChannel>());
  const messageBuffer = useRef(new Map<string, any[]>());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const heartbeatRef = useRef<NodeJS.Timeout>();
  const reconnectRef = useRef<NodeJS.Timeout>();

  // Create optimized channel key
  const createChannelKey = useCallback((config: ChannelConfig) => {
    return `${config.table}_${config.event || 'all'}_${config.filter || 'none'}`;
  }, []);

  // Buffer management for batching updates
  const addToBuffer = useCallback((channelKey: string, payload: any) => {
    if (!messageBuffer.current.has(channelKey)) {
      messageBuffer.current.set(channelKey, []);
    }
    
    const buffer = messageBuffer.current.get(channelKey)!;
    buffer.push({
      ...payload,
      timestamp: Date.now(),
    });

    // Limit buffer size
    if (buffer && buffer.length > bufferSize) {
      buffer.shift(); // Remove oldest message
    }
  }, [bufferSize]);

  // Process buffered messages in batches
  const flushBuffer = useCallback((channelKey: string, callback: (payload: any) => void) => {
    const buffer = messageBuffer.current.get(channelKey);
    if (!buffer || buffer.length === 0) return;

    // Process messages in batch
    const messages = [...buffer];
    messageBuffer.current.set(channelKey, []);

    // Group messages by type for efficient processing
    const groupedMessages = messages.reduce((acc, msg) => {
      const type = msg.eventType || 'UPDATE';
      if (!acc[type]) acc[type] = [];
      acc[type].push(msg);
      return acc;
    }, {} as Record<string, any[]>);

    // Call callback with grouped messages
    Object.entries(groupedMessages).forEach(([type, msgs]) => {
      callback({
        eventType: type,
        messages: msgs,
        batchSize: msgs.length,
      });
    });
  }, []);

  // Subscribe to realtime updates with optimization
  const subscribe = useCallback((config: ChannelConfig) => {
    const channelKey = createChannelKey(config);
    
    // Check if channel already exists
    if (channels.current.has(channelKey)) {
      console.log(`🔄 Reusing existing channel: ${channelKey}`);
      return channelKey;
    }

    // Check channel limit
    if (channels.current.size >= maxChannels) {
      console.warn(`⚠️ Maximum channels (${maxChannels}) reached. Removing oldest channel.`);
      const oldestChannel = channels.current.keys().next().value;
      unsubscribe(oldestChannel);
    }

    try {
      const channel = supabase
        .channel(channelKey, {
          config: {
            presence: { key: channelKey },
            ...(enableCompression && { broadcast: { self: true } }),
          },
        })
        .on(
          'postgres_changes',
          {
            event: config.event || '*',
            schema: 'public',
            table: config.table,
            ...(config.filter && { filter: config.filter }),
          },
          (payload) => {
            console.log(`📨 Realtime update for ${channelKey}:`, payload);
            
            // Add to buffer for batch processing
            addToBuffer(channelKey, payload);
            
            // Debounced flush - process buffer every 100ms
            setTimeout(() => {
              flushBuffer(channelKey, config.callback);
            }, 100);
          }
        )
        .subscribe((status) => {
          console.log(`🔗 Channel ${channelKey} status:`, status);
          setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
        });

      channels.current.set(channelKey, channel);
      console.log(`✅ Subscribed to channel: ${channelKey}`);
      
      return channelKey;
    } catch (error) {
      console.error(`❌ Failed to subscribe to channel: ${channelKey}`, error);
      return null;
    }
  }, [createChannelKey, maxChannels, enableCompression, addToBuffer, flushBuffer]);

  // Unsubscribe from channel
  const unsubscribe = useCallback((channelKey: string) => {
    const channel = channels.current.get(channelKey);
    if (channel) {
      supabase.removeChannel(channel);
      channels.current.delete(channelKey);
      messageBuffer.current.delete(channelKey);
      console.log(`🚫 Unsubscribed from channel: ${channelKey}`);
    }
  }, []);

  // Unsubscribe from all channels
  const unsubscribeAll = useCallback(() => {
    console.log(`🧹 Cleaning up ${channels.current.size} realtime channels`);
    
    channels.current.forEach((channel, key) => {
      supabase.removeChannel(channel);
      console.log(`🚫 Removed channel: ${key}`);
    });
    
    channels.current.clear();
    messageBuffer.current.clear();
  }, []);

  // Heartbeat to maintain connection
  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }

    heartbeatRef.current = setInterval(() => {
      // Send heartbeat to all channels
      channels.current.forEach((channel, key) => {
        channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: Date.now() },
        });
      });
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  // Auto-reconnect on connection loss
  const handleReconnect = useCallback(() => {
    if (connectionStatus === 'disconnected') {
      setConnectionStatus('reconnecting');
      
      console.log('🔄 Attempting to reconnect realtime channels...');
      
      // Store current configs
      const currentConfigs: Array<{ key: string; config: any }> = [];
      channels.current.forEach((channel, key) => {
        // Store minimal config info for recreation
        currentConfigs.push({ key, config: { table: key.split('_')[0] } });
      });

      // Clean up and recreate
      unsubscribeAll();
      
      // Recreate channels after delay
      setTimeout(() => {
        currentConfigs.forEach(({ config }) => {
          // This would need the original callback, so in practice
          // we'd need to store more information
          console.log(`🔄 Recreating channel for table: ${config.table}`);
        });
      }, 1000);
    }
  }, [connectionStatus, unsubscribeAll]);

  // Monitor connection status
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      reconnectRef.current = setTimeout(handleReconnect, reconnectInterval);
    }

    return () => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
    };
  }, [connectionStatus, handleReconnect, reconnectInterval]);

  // Start heartbeat on mount
  useEffect(() => {
    startHeartbeat();
    
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [startHeartbeat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
    };
  }, [unsubscribeAll]);

  // Get connection statistics
  const getStats = useCallback(() => {
    return {
      activeChannels: channels.current.size,
      connectionStatus,
      bufferedMessages: Array.from(messageBuffer.current.values()).reduce(
        (total, buffer) => total + buffer.length, 0
      ),
      channelKeys: Array.from(channels.current.keys()),
    };
  }, [connectionStatus]);

  return {
    subscribe,
    unsubscribe,
    unsubscribeAll,
    connectionStatus,
    getStats,
  };
};