-- Add last_dob_change tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN last_dob_change timestamp with time zone DEFAULT NULL;

-- Create function to check if DOB can be changed (once per 6 months)
CREATE OR REPLACE FUNCTION public.can_change_dob(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
    SELECT 
        CASE 
            WHEN last_dob_change IS NULL THEN TRUE
            WHEN last_dob_change < NOW() - INTERVAL '6 months' THEN TRUE
            ELSE FALSE
        END
    FROM public.profiles 
    WHERE id = user_id;
$$;