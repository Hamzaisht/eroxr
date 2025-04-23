
export type MessageActivityType = 
  | 'send_attempt'
  | 'media_upload'
  | 'document_upload'
  | 'message_view'
  | 'message_delete'
  | 'message_edit'
  | 'message_react'
  | 'call_attempt'
  | 'call_answer'
  | 'call_end'
  | 'error';

export interface MessageActivityDetails {
  recipient_id?: string;
  message_id?: string;
  content?: string;
  duration?: number;
  error?: string;
  message_type?: string;
  file_count?: number;
  file_types?: string[];
  [key: string]: any;
}

export interface MessageAuditLog {
  user_id: string;
  recipient_id?: string;
  message_id?: string;
  action_type: MessageActivityType;
  details: MessageActivityDetails & {
    timestamp: string;
  };
}
