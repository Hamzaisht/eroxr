-- ===== RLS POLICIES AND INDEXES =====

-- Enable RLS on all new tables
ALTER TABLE public.stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppv_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_accounts
CREATE POLICY "Users can view own stripe account" ON stripe_accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own stripe account" ON stripe_accounts
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Creators can manage own subscription plans" ON subscription_plans
  FOR ALL USING (creator_id = auth.uid());

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (subscriber_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "Users can create subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (subscriber_id = auth.uid());

CREATE POLICY "Edge functions can manage subscriptions" ON subscriptions
  FOR ALL USING (true);

-- RLS Policies for ppv_unlocks
CREATE POLICY "Users can view own PPV unlocks" ON ppv_unlocks
  FOR SELECT USING (user_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "Users can create PPV unlocks" ON ppv_unlocks
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for creator_payouts
CREATE POLICY "Creators can view own payouts" ON creator_payouts
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Admin can view all payouts" ON creator_payouts
  FOR SELECT USING (is_admin_user(auth.uid()));

-- RLS Policies for webhook_events (admin only)
CREATE POLICY "Admin can view webhook events" ON webhook_events
  FOR ALL USING (is_admin_user(auth.uid()));

-- Performance indexes
CREATE INDEX idx_stripe_accounts_user_id ON stripe_accounts(user_id);
CREATE INDEX idx_subscription_plans_creator_id ON subscription_plans(creator_id);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_ppv_unlocks_user_content ON ppv_unlocks(user_id, content_id, content_type);
CREATE INDEX idx_creator_payouts_creator_id ON creator_payouts(creator_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed, created_at);
CREATE INDEX idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_stripe_accounts_updated_at
  BEFORE UPDATE ON stripe_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_payouts_updated_at
  BEFORE UPDATE ON creator_payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();