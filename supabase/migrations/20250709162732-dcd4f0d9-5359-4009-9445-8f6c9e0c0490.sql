-- Remove moderation system - set all ads to approved and active
UPDATE dating_ads 
SET moderation_status = 'approved', 
    is_active = true 
WHERE moderation_status = 'pending' OR moderation_status IS NULL;

-- Change default moderation status to approved for new ads
ALTER TABLE dating_ads 
ALTER COLUMN moderation_status SET DEFAULT 'approved';