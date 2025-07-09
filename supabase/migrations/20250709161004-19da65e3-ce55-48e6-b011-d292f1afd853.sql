-- Add privacy and management columns to video_folders table
ALTER TABLE video_folders 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update trigger for video_folders
CREATE OR REPLACE FUNCTION update_video_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_folders_updated_at_trigger
  BEFORE UPDATE ON video_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_video_folders_updated_at();