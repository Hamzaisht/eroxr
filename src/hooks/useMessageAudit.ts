
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface MessageActivityLogParams {
  recipient_id: string;
  message_id?: string;
  activity_type?: string; // Used for the action type
  details?: any;
  length?: number; // Add this field to support message length tracking
}

interface MediaUploadLogParams {
  recipient_id: string;
  file_count: number;
  file_types: string[];
  size_bytes?: number;
}

export function useMessageAudit(recipientId: string) {
  const session = useSession();
  
  const logMessageActivity = async (params: MessageActivityLogParams) => {
    if (!session?.user?.id) return;
    
    const { recipient_id, message_id, activity_type = 'send', details = {}, length } = params;
    
    try {
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: `message_${activity_type}`,
        details: {
          recipient_id,
          message_id,
          timestamp: new Date().toISOString(),
          length, // Include message length in the details if provided
          ...details
        }
      });
    } catch (error) {
      console.error('Failed to log message activity:', error);
    }
  };
  
  const logMediaUpload = async (params: MediaUploadLogParams) => {
    if (!session?.user?.id) return;
    
    const { recipient_id, file_count, file_types, size_bytes } = params;
    
    try {
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'message_media_upload',
        details: {
          recipient_id,
          file_count,
          file_types,
          size_bytes,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log media upload:', error);
    }
  };
  
  const logDocumentUpload = async (params: MediaUploadLogParams) => {
    if (!session?.user?.id) return;
    
    try {
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'message_document_upload',
        details: {
          recipient_id: params.recipient_id,
          file_count: params.file_count,
          file_types: params.file_types,
          size_bytes: params.size_bytes,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log document upload:', error);
    }
  };
  
  return {
    logMessageActivity,
    logMediaUpload,
    logDocumentUpload
  };
}
