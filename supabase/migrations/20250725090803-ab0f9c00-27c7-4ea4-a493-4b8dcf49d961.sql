-- Add can_access_bodycontact column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'can_access_bodycontact'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN can_access_bodycontact boolean DEFAULT false;
    END IF;
END $$;

-- Add last_seen column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'last_seen'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN last_seen timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Update RLS policies for profiles to allow reading bodycontact status
CREATE POLICY "Allow reading bodycontact status" ON public.profiles
    FOR SELECT USING (true);

-- Add index for efficient filtering of online bodycontact users
CREATE INDEX IF NOT EXISTS idx_profiles_bodycontact_last_seen 
ON public.profiles (can_access_bodycontact, last_seen) 
WHERE can_access_bodycontact = true;