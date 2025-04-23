
import { useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageActivityType, 
  MessageActivityDetails, 
  MessageAuditLog,
  ActivityTypeDetailMap
} from '@/types/audit';
import { useToast } from '@/hooks/use-toast';

// Error types for message audit operations
export enum MessageAuditErrorType {
  NO_SESSION = 'NO_SESSION',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
}

interface MessageAuditError {
  type: MessageAuditErrorType;
  message: string;
  originalError?: unknown;
}

/**
 * Hook for logging message activity events
 * @param recipientId Optional default recipient ID
 * @param messageId Optional default message ID
 * @returns Object with log activity function
 */
export function useMessageAudit(recipientId?: string, messageId?: string) {
  const session = useSession();
  const { toast } = useToast();
  
  /**
   * Type guard to validate activity details based on activity type
   * @param activityType Type of activity
   * @param details Activity details
   * @returns True if required fields are present
   */
  const validateActivityDetails = <T extends MessageActivityType>(
    activityType: T, 
    details: MessageActivityDetails
  ): details is ActivityTypeDetailMap[T] => {
    // Common validation
    if (!details) return false;
    
    switch(activityType) {
      case 'send_attempt':
      case 'send_success':
      case 'send_failed':
        return 'recipient_id' in details || !!recipientId;
        
      case 'media_upload':
      case 'document_upload':
        return (
          ('recipient_id' in details || !!recipientId) && 
          'file_count' in details && 
          'file_types' in details
        );
        
      case 'message_view':
      case 'message_edit':
      case 'message_delete':
      case 'message_react':
        return 'message_id' in details || !!messageId;
        
      case 'call_attempt':
      case 'call_answer':
      case 'call_end':
        return 'recipient_id' in details || !!recipientId;
        
      case 'error':
        return 'error_message' in details;
        
      default:
        return true;
    }
  };
  
  /**
   * Creates and logs an audit entry for message activities
   * @param activityType Type of activity to log
   * @param details Details about the activity
   * @returns Promise resolving to success boolean
   */
  const logMessageActivity = useCallback(async <T extends MessageActivityType>(
    activityType: T,
    details?: Partial<ActivityTypeDetailMap[T]>
  ): Promise<boolean> => {
    try {
      // Check for user session
      if (!session?.user?.id) {
        const error: MessageAuditError = {
          type: MessageAuditErrorType.NO_SESSION,
          message: 'Cannot log message activity: No user session'
        };
        
        console.error(error.message);
        return false;
      }
      
      // Prepare activity details with defaults
      const activityDetails = {
        ...(details || {}),
        timestamp: new Date().toISOString()
      } as MessageActivityDetails;
      
      // Validate required fields based on activity type
      if (!validateActivityDetails(activityType, activityDetails)) {
        const error: MessageAuditError = {
          type: MessageAuditErrorType.MISSING_REQUIRED_FIELDS,
          message: `Missing required fields for activity type: ${activityType}`
        };
        
        console.error(error.message, { activityType, details });
        return false;
      }
      
      // Prepare audit log entry
      const auditLog: MessageAuditLog = {
        user_id: session.user.id,
        recipient_id: recipientId || (activityDetails as any).recipient_id,
        message_id: messageId || (activityDetails as any).message_id,
        action_type: activityType,
        details: activityDetails as any
      };

      // Save to database
      const { error } = await supabase
        .from('message_audit_logs')
        .insert(auditLog);
      
      if (error) {
        const auditError: MessageAuditError = {
          type: MessageAuditErrorType.DATABASE_ERROR,
          message: 'Failed to log message activity',
          originalError: error
        };
        
        console.error('Error logging message activity:', error);
        toast({
          title: "Audit Log Error",
          description: "Failed to record message activity",
          variant: "destructive",
        });
        
        return false;
      }

      return true;
    } catch (err) {
      const unexpectedError: MessageAuditError = {
        type: MessageAuditErrorType.UNEXPECTED_ERROR,
        message: 'Unexpected error when logging message activity',
        originalError: err
      };
      
      console.error(unexpectedError.message, err);
      return false;
    }
  }, [session?.user?.id, recipientId, messageId, toast]);
  
  // Helper functions for common audit activities
  const logMessageSend = useCallback((details: Partial<ActivityTypeDetailMap['send_attempt']>) => 
    logMessageActivity('send_attempt', details), [logMessageActivity]);
    
  const logMessageView = useCallback((messageId: string) => 
    logMessageActivity('message_view', { message_id: messageId }), [logMessageActivity]);
    
  const logMediaUpload = useCallback((details: Partial<ActivityTypeDetailMap['media_upload']>) => 
    logMessageActivity('media_upload', details), [logMessageActivity]);
    
  const logDocumentUpload = useCallback((details: Partial<ActivityTypeDetailMap['document_upload']>) => 
    logMessageActivity('document_upload', details), [logMessageActivity]);
    
  const logError = useCallback((errorMessage: string, context?: Record<string, unknown>) => 
    logMessageActivity('error', { error_message: errorMessage, context }), [logMessageActivity]);
  
  return { 
    logMessageActivity,
    logMessageSend,
    logMessageView,
    logMediaUpload,
    logDocumentUpload,
    logError
  };
}
