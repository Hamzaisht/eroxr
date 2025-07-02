-- Create direct messages table for messaging functionality
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
  media_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view their own messages
CREATE POLICY "Users can view messages they sent or received" ON public.direct_messages
FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);

-- Create policy for users to send messages
CREATE POLICY "Users can send messages" ON public.direct_messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid()
);

-- Create policy for users to update their own messages (for read receipts)
CREATE POLICY "Users can update messages they received" ON public.direct_messages
FOR UPDATE USING (
  recipient_id = auth.uid()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_id ON public.direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient_id ON public.direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON public.direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation ON public.direct_messages(sender_id, recipient_id, created_at);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_direct_messages_updated_at
  BEFORE UPDATE ON public.direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();