export type Story = {
  id: string;
  creator_id: string;
  media_url: string;
  created_at: string;
  expires_at: string;
  is_active: boolean | null;
  screenshot_disabled: boolean | null;
};