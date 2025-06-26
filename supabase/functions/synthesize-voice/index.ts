import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

// Helper function to create audio response
function audioResponse(audioData: ArrayBuffer) {
  return new Response(audioData, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioData.byteLength.toString(),
    },
  });
}

// Check premium subscription and usage limits
async function checkPremiumAccess(userId: string): Promise<{ canUse: boolean; message?: string }> {
  try {
    // Get user's subscription tier
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { canUse: false, message: 'Failed to verify user account' };
    }

    // Only premium users can use voice synthesis
    if (profile.subscription_tier !== 'premium') {
      return { canUse: false, message: 'Premium subscription required' };
    }

    // Check monthly usage for premium users (10 per month limit)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const { data: usage, error: usageError } = await supabase
      .from('daily_usage')
      .select('voice_syntheses_monthly')
      .eq('user_id', userId)
      .gte('date', `${currentMonth}-01`)
      .maybeSingle();

    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      return { canUse: false, message: 'Failed to check usage limits' };
    }

    const currentUsage = usage?.voice_syntheses_monthly || 0;
    if (currentUsage >= 10) {
      return { canUse: false, message: 'Monthly usage limit exceeded' };
    }

    return { canUse: true };
  } catch (error) {
    console.error('Error checking premium access:', error);
    return { canUse: false, message: 'Failed to verify premium access' };
  }
}

// Synthesize voice using ElevenLabs
async function synthesizeWithElevenLabs(text: string, voice: string, speed: number) {
  if (!elevenLabsApiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  // Map voice styles to ElevenLabs voice IDs
  // These are example voice IDs - replace with actual ElevenLabs voice IDs
  const voiceMap = {
    professional: 'ErXwobaYiN019PkySvjV', // Antoni
    friendly: '21m00Tcm4TlvDq8ikWAM',     // Rachel  
    clear: 'AZnzlk1XvdvUeBnXmlld',        // Domi
  };

  const voiceId = voiceMap[voice as keyof typeof voiceMap] || voiceMap.professional;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioData = await response.arrayBuffer();

    if (audioData.byteLength === 0) {
      throw new Error('Received empty audio data from ElevenLabs');
    }

    // Apply speed adjustment if needed (basic implementation)
    // In a real implementation, you might want to use audio processing libraries
    return audioData;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Voice synthesis timeout - please try again');
    }
    throw error;
  }
}

// Update usage counter
async function updateUsageCounter(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Update both daily and monthly counters
    await supabase
      .from('daily_usage')
      .upsert({
        user_id: userId,
        date: today,
        voice_syntheses_count: 1,
        voice_syntheses_monthly: 1
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      });

    // Increment existing record if upsert doesn't work as expected
    await supabase
      .from('daily_usage')
      .update({ 
        voice_syntheses_count: supabase.sql`voice_syntheses_count + 1`,
        voice_syntheses_monthly: supabase.sql`voice_syntheses_monthly + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('date', today);

  } catch (error) {
    console.error('Error updating usage counter:', error);
    // Don't throw - usage tracking shouldn't block voice synthesis
  }
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Get user from auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return corsResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return corsResponse({ error: 'Invalid authentication token' }, 401);
    }

    // Parse request body
    const { text, voice = 'professional', speed = 1.0 } = await req.json();

    if (!text || typeof text !== 'string') {
      return corsResponse({ error: 'Text is required' }, 400);
    }

    if (text.length > 1000) {
      return corsResponse({ error: 'Text too long (max 1000 characters)' }, 400);
    }

    if (text.trim().length === 0) {
      return corsResponse({ error: 'Text cannot be empty' }, 400);
    }

    // Validate voice option
    const validVoices = ['professional', 'friendly', 'clear'];
    if (!validVoices.includes(voice)) {
      return corsResponse({ error: 'Invalid voice option' }, 400);
    }

    // Validate speed
    if (typeof speed !== 'number' || speed < 0.5 || speed > 2.0) {
      return corsResponse({ error: 'Invalid speed (must be between 0.5 and 2.0)' }, 400);
    }

    // Check premium access and usage limits
    const accessCheck = await checkPremiumAccess(user.id);
    if (!accessCheck.canUse) {
      return corsResponse({ 
        error: 'Access denied',
        message: accessCheck.message 
      }, accessCheck.message?.includes('Premium') ? 403 : 429);
    }

    // Synthesize voice
    const audioData = await synthesizeWithElevenLabs(text, voice, speed);

    // Update usage counter (async, don't wait)
    EdgeRuntime.waitUntil(updateUsageCounter(user.id));

    // Return audio data
    return audioResponse(audioData);

  } catch (error: any) {
    console.error('Voice synthesis error:', error);
    
    if (error.message?.includes('timeout')) {
      return corsResponse({ error: 'Voice synthesis timeout - please try again' }, 408);
    }
    
    if (error.message?.includes('ElevenLabs')) {
      return corsResponse({ error: 'Voice service temporarily unavailable' }, 503);
    }

    return corsResponse({ 
      error: 'Internal server error',
      message: error.message 
    }, 500);
  }
});