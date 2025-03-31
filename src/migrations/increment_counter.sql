
-- This function increments a counter (like view_count, share_count) in a specified table
CREATE OR REPLACE FUNCTION increment_counter(
  row_id UUID,
  counter_name TEXT,
  table_name TEXT DEFAULT 'posts'
)
RETURNS VOID AS $$
DECLARE
  query TEXT;
BEGIN
  -- Validate inputs to prevent SQL injection
  IF table_name NOT IN ('posts', 'videos', 'stories') THEN
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;
  
  IF counter_name NOT IN ('view_count', 'share_count', 'likes_count', 'comments_count') THEN
    RAISE EXCEPTION 'Invalid counter name: %', counter_name;
  END IF;

  -- Build and execute dynamic query
  query := format('
    UPDATE %I 
    SET %I = COALESCE(%I, 0) + 1 
    WHERE id = %L',
    table_name, counter_name, counter_name, row_id
  );
  
  EXECUTE query;
END;
$$ LANGUAGE plpgsql;
