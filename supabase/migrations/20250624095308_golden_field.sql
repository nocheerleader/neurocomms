/*
  # Payment History Table

  1. New Tables
    - `payment_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `stripe_payment_intent_id` (text, Stripe payment reference)
      - `amount` (integer, amount in cents)
      - `currency` (text, currency code)
      - `status` (text, payment status)
      - `receipt_url` (text, Stripe receipt URL)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_history` table
    - Add policies for users to read their own payment history
    - Only service role can insert payment records via webhooks
    - Track all payment attempts for audit and support
*/

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id text NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'usd' CHECK (char_length(currency) = 3),
  status text NOT NULL CHECK (status IN ('succeeded', 'failed', 'canceled', 'processing', 'requires_action')),
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all payment records (for webhooks)
CREATE POLICY "Service role can manage payment history"
  ON payment_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_intent ON payment_history(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);

-- Function to record payment (for webhook use)
CREATE OR REPLACE FUNCTION record_payment(
  p_user_id uuid,
  p_stripe_payment_intent_id text,
  p_amount integer,
  p_currency text DEFAULT 'usd',
  p_status text DEFAULT 'succeeded',
  p_receipt_url text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  payment_id uuid;
BEGIN
  INSERT INTO payment_history (
    user_id,
    stripe_payment_intent_id,
    amount,
    currency,
    status,
    receipt_url
  )
  VALUES (
    p_user_id,
    p_stripe_payment_intent_id,
    p_amount,
    p_currency,
    p_status,
    p_receipt_url
  )
  ON CONFLICT (stripe_payment_intent_id) DO UPDATE SET
    status = EXCLUDED.status,
    receipt_url = EXCLUDED.receipt_url
  RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get payment summary for a user
CREATE OR REPLACE FUNCTION get_payment_summary(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  summary jsonb;
BEGIN
  WITH payment_stats AS (
    SELECT 
      COUNT(*) as total_payments,
      COUNT(CASE WHEN status = 'succeeded' THEN 1 END) as successful_payments,
      SUM(CASE WHEN status = 'succeeded' THEN amount ELSE 0 END) as total_paid_cents,
      MAX(created_at) as last_payment_date,
      MIN(created_at) as first_payment_date
    FROM payment_history
    WHERE user_id = p_user_id
  )
  SELECT jsonb_build_object(
    'total_payments', total_payments,
    'successful_payments', successful_payments,
    'total_paid_usd', ROUND(total_paid_cents / 100.0, 2),
    'last_payment_date', last_payment_date,
    'first_payment_date', first_payment_date,
    'customer_since', DATE(first_payment_date)
  ) INTO summary
  FROM payment_stats;
  
  RETURN COALESCE(summary, '{"total_payments": 0, "successful_payments": 0, "total_paid_usd": 0}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent payment history for user dashboard
CREATE OR REPLACE FUNCTION get_recent_payments(p_user_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  amount_usd decimal,
  status text,
  receipt_url text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ph.id,
    ROUND(ph.amount / 100.0, 2) as amount_usd,
    ph.status,
    ph.receipt_url,
    ph.created_at
  FROM payment_history ph
  WHERE ph.user_id = p_user_id
  ORDER BY ph.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;