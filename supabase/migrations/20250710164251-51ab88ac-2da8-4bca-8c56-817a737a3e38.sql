-- Enable realtime for user_sessions table
ALTER TABLE user_sessions REPLICA IDENTITY FULL;

-- Add user_sessions to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;