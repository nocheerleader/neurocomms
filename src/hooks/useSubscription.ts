import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

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
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   // --- START OF NEW "GOLDEN TICKET" LOGIC ---
  // If the user is the demo user, grant permanent premium access
  if (user?.email === 'demo@elucidare.app') {
    return {
      subscription: { // Mock a subscription object for consistency
        customer_id: 'cus_demo',
        subscription_id: 'sub_demo',
        subscription_status: 'active',
        price_id: 'price_premium_demo',
        current_period_start: Date.now() / 1000,
        current_period_end: (Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        cancel_at_period_end: false,
        payment_method_brand: 'visa',
        payment_method_last4: '4242',
      },
      loading: false, // Not loading
      error: null,    // No error
      isActive: true, // They are active
      isTrialing: false, // Not in a trial
      isPremium: true,   // They are premium!
      trialDaysRemaining: null,
      refetch: () => Promise.resolve(), // Dummy refetch function
    };
  }
  // --- END OF NEW "GOLDEN TICKET" LOGIC ---

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

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

  const isActive = subscription?.subscription_status === 'active';
  const isTrialing = subscription?.subscription_status === 'trialing';
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
    refetch: fetchSubscription,
  };
}