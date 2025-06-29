// project/src/hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

// Keep this interface definition
interface SubscriptionData {
  customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  // ALL HOOKS ARE NOW CALLED UNCONDITIONALLY AT THE TOP
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for the demo user *inside* the useEffect
    if (user?.email === 'demo@elucidare.app') {
      // It's the demo user! Set the state to our mocked premium data.
      setSubscription({
        customer_id: 'cus_demo',
        subscription_id: 'sub_demo',
        subscription_status: 'active',
        price_id: 'price_premium_demo',
        current_period_start: Date.now() / 1000,
        current_period_end: (Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        cancel_at_period_end: false,
        payment_method_brand: 'visa',
        payment_method_last4: '4242',
      });
      setLoading(false); // We're done loading.
      setError(null);    // No error.
      return; // Exit the useEffect early, which is safe.
    }

    // If it's NOT the demo user, run the normal logic.
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]); // The dependency array is correct.

  const isActive = subscription?.subscription_status === 'active';
  const isTrialing = subscription?.subscription_status === 'trialing';
  // This logic now works correctly for BOTH real and demo users
  const isPremium = isActive || isTrialing;

  const getTrialDaysRemaining = () => {
    if (!isTrialing || !subscription?.current_period_end) return null;
    
    const trialEndDate = new Date(subscription.current_period_end * 1000);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return {
    subscription,
    loading,
    error,
    isActive,
    isTrialing,
    isPremium,
    trialDaysRemaining: getTrialDaysRemaining(),
    refetch: () => Promise.resolve(), // Dummy refetch for demo user
  };
}