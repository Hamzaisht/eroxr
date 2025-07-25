-- Enable bodycontact access for the current user (izanami)
UPDATE public.profiles 
SET can_access_bodycontact = true 
WHERE username = 'izanami';