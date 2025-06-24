/*
  # User Subscriptions Management Table

  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, unique)
      - `stripe_customer_id` (text, Stripe customer reference)
      - `stripe_subscription_id` (text, Stripe subscription reference)
      - `plan_id` (text, premium_monthly/premium_annual)
      - `status` (text, active/canceled/past_due/unpaid)
      - `current_period_start` (timestamptz, billing period start)
      - `current_period_end` (timestamptz, billing period end)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_subscriptions` table
    - Add policies for users to read their own subscription data
    - Only system can update subscription data via webhooks
    - Automatic profile tier updates based on subscription status
*/

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  plan_id text NOT NULL CHECK (plan_id IN ('premium_monthly', 'premium_annual')),
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period_end ON user_subscriptions(current_period_end);

-- Function to update user profile tier based on subscription status
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS trigger AS $$
BEGIN
  -- Update user profile subscription tier based on subscription status
  UPDATE user_profiles
  SET 
    subscription_tier = CASE 
      WHEN NEW.status IN ('active', 'past_due') THEN 'premium'
      ELSE 'free'
    END,
    updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-update user tier
CREATE TRIGGER update_user_tier_on_subscription_change
  AFTER INSERT OR UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tier();

-- Function to handle subscription cancellation
CREATE OR REPLACE FUNCTION handle_subscription_cancellation()
RETURNS trigger AS $$
BEGIN
  -- When subscription is canceled, update user tier to free
  IF NEW.status = 'canceled' AND OLD.status != 'canceled' THEN
    UPDATE user_profiles
    SET 
      subscription_tier = 'free',
      updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for cancellation handling
CREATE TRIGGER handle_subscription_cancellation_trigger
  AFTER UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_cancellation();

-- Function to create or update subscription (for webhook use)
CREATE OR REPLACE FUNCTION upsert_subscription(
  p_user_id uuid,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_plan_id text,
  p_status text,
  p_current_period_start timestamptz,
  p_current_period_end timestamptz
)
RETURNS uuid AS $$
DECLARE
  subscription_id uuid;
BEGIN
  INSERT INTO user_subscriptions (
    user_id, 
    stripe_customer_id, 
    stripe_subscription_id, 
    plan_id, 
    status, 
    current_period_start, 
    current_period_end
  )
  VALUES (
    p_user_id,
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_plan_id,
    p_status,
    p_current_period_start,
    p_current_period_end
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    stripe_customer_id = EXCLUDED.stripe_customer_id,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    plan_id = EXCLUDED.plan_id,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = now()
  RETURNING id INTO subscription_id;
  
  RETURN subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subscription status for a user
CREATE OR REPLACE FUNCTION get_subscription_status(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  subscription_info jsonb;
BEGIN
  SELECT jsonb_build_object(
    'has_subscription', (s.id IS NOT NULL),
    'status', COALESCE(s.status, 'none'),
    'plan_id', s.plan_id,
    'current_period_end', s.current_period_end,
    'is_active', (s.status IN ('active', 'past_due'))
  ) INTO subscription_info
  FROM user_profiles up
  LEFT JOIN user_subscriptions s ON s.user_id = up.id
  WHERE up.id = p_user_id;
  
  RETURN COALESCE(subscription_info, '{"has_subscription": false, "status": "none", "is_active": false}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;