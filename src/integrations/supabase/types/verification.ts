export type IdVerification = {
  id: string;
  user_id: string | null;
  document_type: string;
  document_url: string;
  status: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  rejected_reason: string | null;
};