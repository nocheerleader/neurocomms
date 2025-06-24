/*
  # Monthly Usage Reset Function

  1. Functions
    - `reset_monthly_voice_usage()` - Resets voice synthesis monthly counters
    - Scheduled to run on the 1st of each month
    - Updates all users' voice_syntheses_monthly back to 0

  2. Cron Job Setup
    - Uses pg_cron extension to run monthly reset
    - Runs at midnight on the 1st of each month (UTC)
    - Logs reset activity for monitoring
*/

-- Create function to reset monthly voice usage
CREATE OR REPLACE FUNCTION reset_monthly_voice_usage()
RETURNS void AS $$
DECLARE
  reset_count integer;
BEGIN
  -- Reset monthly voice synthesis counters for all users
  UPDATE daily_usage
  SET 
    voice_syntheses_monthly = 0,
    updated_at = now()
  WHERE voice_syntheses_monthly > 0;
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  
  -- Log the reset activity
  RAISE NOTICE 'Monthly voice usage reset completed. Updated % records.', reset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean old daily usage records (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_usage_records()
RETURNS void AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete usage records older than 90 days
  DELETE FROM daily_usage
  WHERE date < CURRENT_DATE - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Cleaned up % old usage records (>90 days).', deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean old tone analyses (keep last 180 days for premium, 30 days for free)
CREATE OR REPLACE FUNCTION cleanup_old_analyses()
RETURNS void AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete old analyses based on user tier
  DELETE FROM tone_analyses ta
  WHERE ta.created_at < (
    CASE 
      WHEN (SELECT subscription_tier FROM user_profiles WHERE id = ta.user_id) = 'premium' 
      THEN CURRENT_DATE - INTERVAL '180 days'
      ELSE CURRENT_DATE - INTERVAL '30 days'
    END
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Cleaned up % old tone analysis records.', deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create comprehensive monthly maintenance function
CREATE OR REPLACE FUNCTION monthly_maintenance()
RETURNS void AS $$
BEGIN
  -- Reset monthly voice usage
  PERFORM reset_monthly_voice_usage();
  
  -- Clean up old records
  PERFORM cleanup_old_usage_records();
  PERFORM cleanup_old_analyses();
  
  RAISE NOTICE 'Monthly maintenance completed successfully.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: To enable the cron job, run this in your Supabase SQL editor:
-- SELECT cron.schedule('monthly-maintenance', '0 0 1 * *', 'SELECT monthly_maintenance();');
-- This schedules the maintenance to run at midnight on the 1st of each month

-- Function to manually trigger usage limits check (useful for testing)
CREATE OR REPLACE FUNCTION get_user_usage_status(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  usage_info jsonb;
  user_tier text;
  today_usage daily_usage;
BEGIN
  -- Get user tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Get today's usage
  today_usage := get_or_create_daily_usage(p_user_id);
  
  -- Build usage status
  SELECT jsonb_build_object(
    'subscription_tier', user_tier,
    'today', jsonb_build_object(
      'tone_analyses', jsonb_build_object(
        'used', today_usage.tone_analyses_count,
        'limit', CASE WHEN user_tier = 'premium' THEN 'unlimited' ELSE '5' END,
        'remaining', CASE WHEN user_tier = 'premium' THEN 'unlimited' ELSE (5 - today_usage.tone_analyses_count) END
      ),
      'script_generations', jsonb_build_object(
        'used', today_usage.script_generations_count,
        'limit', CASE WHEN user_tier = 'premium' THEN 'unlimited' ELSE '3' END,
        'remaining', CASE WHEN user_tier = 'premium' THEN 'unlimited' ELSE (3 - today_usage.script_generations_count) END
      ),
      'voice_syntheses', jsonb_build_object(
        'used_today', today_usage.voice_syntheses_count,
        'used_monthly', today_usage.voice_syntheses_monthly,
        'monthly_limit', CASE WHEN user_tier = 'premium' THEN '10' ELSE '0' END,
        'remaining_monthly', CASE WHEN user_tier = 'premium' THEN (10 - today_usage.voice_syntheses_monthly) ELSE 0 END
      )
    )
  ) INTO usage_info;
  
  RETURN usage_info;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;