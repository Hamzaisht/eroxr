-- Run the call history and notifications migration
-- This creates the tables needed for the call functionality

-- Create call_history table
CREATE TABLE IF NOT EXISTS public.call_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  call_type text NOT NULL CHECK (call_type IN ('audio', 'video')),
  status text NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'connected', 'ended', 'missed')),
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  connected_at timestamp with time zone,
  ended_at timestamp with time zone,
  duration integer, -- in seconds
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create call_notifications table
CREATE TABLE IF NOT EXISTS public.call_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  call_id uuid NOT NULL REFERENCES public.call_history(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('incoming_call', 'missed_call', 'call_ended')),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.call_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for call_history
CREATE POLICY "Users can view their own call history" ON public.call_history
  FOR SELECT USING ((auth.uid() = caller_id) OR (auth.uid() = recipient_id));

CREATE POLICY "Users can create call records" ON public.call_history
  FOR INSERT WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can update their own call records" ON public.call_history
  FOR UPDATE USING ((auth.uid() = caller_id) OR (auth.uid() = recipient_id));

-- RLS Policies for call_notifications
CREATE POLICY "Users can view their own call notifications" ON public.call_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create call notifications" ON public.call_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own call notifications" ON public.call_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_history_caller_id ON public.call_history(caller_id);
CREATE INDEX IF NOT EXISTS idx_call_history_recipient_id ON public.call_history(recipient_id);
CREATE INDEX IF NOT EXISTS idx_call_history_created_at ON public.call_history(created_at);
CREATE INDEX IF NOT EXISTS idx_call_notifications_user_id ON public.call_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_call_notifications_call_id ON public.call_notifications(call_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_call_history_updated_at
  BEFORE UPDATE ON public.call_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function and trigger for missed call notifications
CREATE OR REPLACE FUNCTION public.create_missed_call_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification for missed calls
  IF NEW.status = 'missed' AND OLD.status != 'missed' THEN
    INSERT INTO public.call_notifications (user_id, call_id, notification_type)
    VALUES (NEW.recipient_id, NEW.id, 'missed_call');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_missed_call_notification_trigger
  AFTER UPDATE ON public.call_history
  FOR EACH ROW
  EXECUTE FUNCTION public.create_missed_call_notification();