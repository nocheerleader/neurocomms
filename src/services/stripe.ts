import { supabase } from '../lib/supabase';
import { handleApiError, withRetry, CustomError, ErrorType } from '../utils/errorHandling';

interface CreateCheckoutSessionParams {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession({
  priceId,
  mode,
  successUrl = `${window.location.origin}/profile?success=true`,
  cancelUrl = `${window.location.origin}/profile?canceled=true`,
}: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new CustomError(
        'No authentication token found',
        ErrorType.AUTH,
        'Your session has expired. Please sign in again.'
      );
    }

    return await withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            price_id: priceId,
            mode,
            success_url: successUrl,
            cancel_url: cancelUrl,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown payment error' }));
          
          if (response.status === 400) {
            throw new CustomError(
              'Invalid payment request',
              ErrorType.VALIDATION,
              'There was an issue with your payment request. Please try again.',
              400
            );
          }

          throw new CustomError(
            errorData.error || 'Failed to create checkout session',
            ErrorType.SERVER,
            'Unable to process your payment request. Please try again.',
            response.status
          );
        }
        
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof CustomError) {
          throw error;
        }
        
        throw handleApiError(error, { action: 'createCheckoutSession', priceId, mode });
      }
    }, 2); // Retry up to 2 times for network errors
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    
    throw new CustomError(
      'Failed to redirect to checkout',
      ErrorType.SERVER,
      'Unable to redirect to the payment page. Please try again.',
      undefined,
      error as Error
    );
  }
}

export async function redirectToCheckout(params: CreateCheckoutSessionParams): Promise<void> {
  try {
    const { url } = await createCheckoutSession(params);
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    
    if (error instanceof CustomError) {
      throw error;
    }
    
    throw new CustomError(
      'Failed to redirect to checkout',
      ErrorType.SERVER,
      'Unable to redirect to the payment page. Please try again.',
      undefined,
      error as Error
    );
  }
}