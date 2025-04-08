
// Export all hooks from this index file

// Reexport hooks
export * from './use-toast';
export * from './use-mobile';
export * from './useOptimisticUpload';

// Export additional messaging hooks needed by MessageInput.tsx
export { useTypingIndicator } from './useTypingIndicator';
export { useMessageAudit } from './useMessageAudit';
export { useRealtimeMessages } from './useRealtimeMessages';
