-- Create table to track PDF exports
CREATE TABLE public.pdf_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL DEFAULT 'eroboard_analytics',
  exported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  file_size INTEGER,
  export_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pdf_exports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own exports" 
ON public.pdf_exports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exports" 
ON public.pdf_exports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to check monthly export limit
CREATE OR REPLACE FUNCTION public.check_monthly_export_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  export_count INTEGER;
BEGIN
  -- Count exports in current month
  SELECT COUNT(*) INTO export_count
  FROM public.pdf_exports
  WHERE user_id = p_user_id
    AND export_type = 'eroboard_analytics'
    AND exported_at >= DATE_TRUNC('month', NOW())
    AND exported_at < DATE_TRUNC('month', NOW()) + INTERVAL '1 month';
  
  -- Return true if under limit (3 per month)
  RETURN export_count < 3;
END;
$$;

-- Create function to get user export count for current month
CREATE OR REPLACE FUNCTION public.get_monthly_export_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  export_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO export_count
  FROM public.pdf_exports
  WHERE user_id = p_user_id
    AND export_type = 'eroboard_analytics'
    AND exported_at >= DATE_TRUNC('month', NOW())
    AND exported_at < DATE_TRUNC('month', NOW()) + INTERVAL '1 month';
  
  RETURN export_count;
END;
$$;