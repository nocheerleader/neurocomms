import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

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

// Content moderation check
function moderateContent(text: string): { isAppropriate: boolean; reason?: string } {
  const inappropriatePatterns = [
    /\b(hate|kill|murder|suicide)\b/i,
    /\b(fuck|shit|damn|hell)\b/i,
    /\b(harassment|threat|violence)\b/i,
  ];

  for (const pattern of inappropriatePatterns) {
    if (pattern.test(text)) {
      return { isAppropriate: false, reason: 'Contains inappropriate language' };
    }
  }

  return { isAppropriate: true };
}

// Check usage limits
async function checkUsageLimit(userId: string): Promise<{ canUse: boolean; message?: string }> {
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

    // Premium users have unlimited access
    if (profile.subscription_tier === 'premium') {
      return { canUse: true };
    }

    // Check today's usage for free users
    const today = new Date().toISOString().split('T')[0];
    const { data: usage, error: usageError } = await supabase
      .from('daily_usage')
      .select('script_generations_count')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      return { canUse: false, message: 'Failed to check usage limits' };
    }

    const currentUsage = usage?.script_generations_count || 0;
    if (currentUsage >= 3) {
      return { canUse: false, message: 'Daily usage limit exceeded' };
    }

    return { canUse: true };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { canUse: false, message: 'Failed to verify usage limits' };
  }
}

// Generate scripts using OpenAI
async function generateWithOpenAI(situationContext: string, relationshipType: string) {
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const relationshipPrompts = {
    colleague: 'a coworker at the same level',
    manager: 'your supervisor or boss',
    friend: 'a personal friend',
    family: 'a family member',
    client: 'a customer or client',
    acquaintance: 'someone you know casually',
    other: 'someone you interact with'
  };

  const relationshipContext = relationshipPrompts[relationshipType as keyof typeof relationshipPrompts] || 'someone you interact with';

  const prompt = `You're helping a neurodiverse person respond to a communication situation with ${relationshipContext}. 

Situation: "${situationContext}"

Generate exactly 3 different response options with these tones:

1. CASUAL: Relaxed, friendly, conversational tone
2. PROFESSIONAL: Formal, business-like, structured tone  
3. DIRECT: Clear, straightforward, concise tone

For each response, provide:
- The actual response text (50-150 words)
- An explanation of why this tone works for the situation (30-50 words)
- A confidence score (0.0 to 1.0) for how appropriate this response is

Important guidelines:
- Use clear, literal language without metaphors or idioms
- Be specific and concrete in responses
- Consider the relationship context when crafting tone
- Make responses actionable and helpful
- Avoid overwhelming or complex language

Respond in this exact JSON format:
{
  "responses": {
    "casual": {
      "content": "[response text]",
      "explanation": "[why this works]",
      "confidence": [0.0-1.0]
    },
    "professional": {
      "content": "[response text]", 
      "explanation": "[why this works]",
      "confidence": [0.0-1.0]
    },
    "direct": {
      "content": "[response text]",
      "explanation": "[why this works]", 
      "confidence": [0.0-1.0]
    }
  }
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a communication assistant helping neurodiverse individuals craft appropriate responses. Be literal, clear, and specific in your suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const generation = JSON.parse(content);

    // Validate the response structure
    if (!generation.responses || 
        !generation.responses.casual || 
        !generation.responses.professional || 
        !generation.responses.direct) {
      throw new Error('Invalid response format from OpenAI');
    }

    return generation;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Script generation timeout - please try again');
    }
    throw error;
  }
}

// Save generation to database
async function saveGeneration(userId: string, situationContext: string, relationshipType: string, responses: any) {
  try {
    const { data, error } = await supabase
      .from('generated_scripts')
      .insert({
        user_id: userId,
        situation_context: situationContext,
        relationship_type: relationshipType,
        responses: responses
      })
      .select()
      .single();

    if (error) throw error;

    // Validate that the inserted record has a valid ID
    if (!data || !data.id || typeof data.id !== 'string') {
      throw new Error('Database insert succeeded but did not return a valid record ID');
    }

    // Update usage counter
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('daily_usage')
      .upsert({
        user_id: userId,
        date: today,
        script_generations_count: 1
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      });

    // If upsert didn't work, try incrementing existing record
    await supabase.rpc('increment_usage_counter', {
      p_user_id: userId,
      p_feature: 'script_generations_count',
      p_date: today
    }).then(() => {
      // If RPC doesn't exist, that's fine - the upsert above should handle it
    }).catch(() => {
      // Fallback: manual increment
      supabase
        .from('daily_usage')
        .update({ 
          script_generations_count: supabase.sql`script_generations_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('date', today);
    });

    return data;
  } catch (error) {
    console.error('Error saving generation:', error);
    throw new Error('Failed to save script generation');
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
    const { situation_context, relationship_type } = await req.json();

    if (!situation_context || typeof situation_context !== 'string') {
      return corsResponse({ error: 'Situation context is required' }, 400);
    }

    if (!relationship_type || typeof relationship_type !== 'string') {
      return corsResponse({ error: 'Relationship type is required' }, 400);
    }

    if (situation_context.length > 1000) {
      return corsResponse({ error: 'Situation description too long (max 1000 characters)' }, 400);
    }

    if (situation_context.trim().length === 0) {
      return corsResponse({ error: 'Situation context cannot be empty' }, 400);
    }

    const validRelationships = ['colleague', 'manager', 'friend', 'family', 'client', 'acquaintance', 'other'];
    if (!validRelationships.includes(relationship_type)) {
      return corsResponse({ error: 'Invalid relationship type' }, 400);
    }

    // Content moderation
    const moderation = moderateContent(situation_context);
    if (!moderation.isAppropriate) {
      return corsResponse({ 
        error: 'Content moderation failed',
        reason: moderation.reason 
      }, 400);
    }

    // --- START: DEMO USER BYPASS ---
    // First, check if the user is our special demo user.
    if (user.email !== 'demo@elucidare.app') {
        // If it's a regular user, perform the standard usage check.
        const usageCheck = await checkUsageLimit(user.id);
        if (!usageCheck.canUse) {
            return corsResponse({
                error: 'Usage limit exceeded',
                message: usageCheck.message
            }, 429);
        }
    } else {
        // It IS the demo user, so we log it and skip the check.
        console.log('Demo user detected, bypassing usage check for script generation.');
    }
    // --- END: DEMO USER BYPASS ---

    // Generate scripts
    const startTime = Date.now();
    const generation = await generateWithOpenAI(situation_context, relationship_type);
    const processingTime = Date.now() - startTime;

    // Save to database
    const savedGeneration = await saveGeneration(
      user.id,
      situation_context,
      relationship_type,
      generation.responses
    );

    // Return the result
    return corsResponse({
      id: savedGeneration.id,
      responses: generation.responses,
      processing_time_ms: processingTime
    });

  } catch (error: any) {
    console.error('Script generation error:', error);
    
    if (error.message?.includes('timeout')) {
      return corsResponse({ error: 'Script generation timeout - please try again' }, 408);
    }
    
    if (error.message?.includes('OpenAI')) {
      return corsResponse({ error: 'AI service temporarily unavailable' }, 503);
    }

    return corsResponse({ 
      error: 'Internal server error',
      message: error.message 
    }, 500);
  }
});