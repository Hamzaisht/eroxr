
-- Function to safely get a counter value with proper error handling
CREATE OR REPLACE FUNCTION public.get_current_count(
  p_table text,
  p_column text, 
  p_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  result integer;
BEGIN
  -- Validate inputs to prevent SQL injection
  IF p_table NOT IN ('posts', 'videos', 'stories') THEN
    RAISE EXCEPTION 'Invalid table name: %', p_table;
  END IF;
  
  IF p_column NOT IN ('view_count', 'share_count', 'likes_count', 'comments_count') THEN
    RAISE EXCEPTION 'Invalid counter name: %', p_column;
  END IF;

  -- Build and execute dynamic query to get current count
  EXECUTE format('
    SELECT COALESCE(%I, 0) 
    FROM %I 
    WHERE id = %L',
    p_column, p_table, p_id
  ) INTO result;
  
  -- Return 0 if NULL or not found
  RETURN COALESCE(result, 0);
EXCEPTION
  WHEN others THEN
    -- Log error and return 0 on any exception
    RAISE NOTICE 'Error getting counter: %', SQLERRM;
    RETURN 0;
END;
$$;
