
// Base activity types
export type MessageActivityType = 
  | 'send_attempt'
  | 'send_success'
  | 'send_failed'
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

// Base message activity details
export interface BaseMessageActivityDetails {
  timestamp?: string;
}

// Message sending related activities
export interface MessageSendActivityDetails extends BaseMessageActivityDetails {
  recipient_id: string;
  content?: string;
  message_type?: string;
  reply_to_id?: string; // Added this field to support reply functionality
}

// Media related activities
export interface MediaActivityDetails extends BaseMessageActivityDetails {
  recipient_id: string;
  file_count: number;
  file_types: string[];
  size_bytes?: number;
}

// Document related activities
export interface DocumentActivityDetails extends BaseMessageActivityDetails {
  recipient_id: string;
  file_count: number;
  file_types: string[];
  size_bytes?: number;
}

// View related activities
export interface ViewActivityDetails extends BaseMessageActivityDetails {
  message_id: string;
  view_duration_ms?: number;
}

// Edit related activities
export interface EditActivityDetails extends BaseMessageActivityDetails {
  message_id: string;
  original_content: string;
  new_content: string;
}

// Delete related activities
export interface DeleteActivityDetails extends BaseMessageActivityDetails {
  message_id: string;
  content?: string;
  timestamp_created?: string;
}

// React related activities
export interface ReactActivityDetails extends BaseMessageActivityDetails {
  message_id: string;
  reaction: string;
}

// Call related activities
export interface CallActivityDetails extends BaseMessageActivityDetails {
  recipient_id: string;
  call_id?: string;
  duration_seconds?: number;
}

// Error related activities
export interface ErrorActivityDetails extends BaseMessageActivityDetails {
  error_code?: string;
  error_message: string;
  context?: Record<string, unknown>;
}

// Union type of all possible detail types
export type MessageActivityDetails =
  | MessageSendActivityDetails
  | MediaActivityDetails
  | DocumentActivityDetails
  | ViewActivityDetails
  | EditActivityDetails
  | DeleteActivityDetails
  | ReactActivityDetails
  | CallActivityDetails
  | ErrorActivityDetails
  | BaseMessageActivityDetails;

// Type for identifying required fields for each activity type
export type ActivityTypeDetailMap = {
  'send_attempt': MessageSendActivityDetails;
  'send_success': MessageSendActivityDetails;
  'send_failed': MessageSendActivityDetails;
  'media_upload': MediaActivityDetails;
  'document_upload': DocumentActivityDetails;
  'message_view': ViewActivityDetails;
  'message_edit': EditActivityDetails;
  'message_delete': DeleteActivityDetails;
  'message_react': ReactActivityDetails;
  'call_attempt': CallActivityDetails;
  'call_answer': CallActivityDetails;
  'call_end': CallActivityDetails;
  'error': ErrorActivityDetails;
}

// Complete audit log entry
export interface MessageAuditLog {
  user_id: string;
  recipient_id?: string;
  message_id?: string;
  action_type: MessageActivityType;
  details: MessageActivityDetails & {
    timestamp: string;
  };
}
