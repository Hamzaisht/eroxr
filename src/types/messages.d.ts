export type MessageActivityType = 
  | 'send_attempt' 
  | 'send_success' 
  | 'send_failed' 
  | 'read' 
  | 'delivered' 
  | 'media_upload'
  | 'document_upload'
  | 'reaction'
  | 'reply'
  | 'delete'
  | 'edit';
