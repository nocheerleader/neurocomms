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
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { canUse: false, message: 'Failed to verify user account' };
    }

    if (profile.subscription_tier === 'premium') {
      return { canUse: true };
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: usage, error: usageError } = await supabase
      .from('daily_usage')
      .select('tone_analyses_count')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      return { canUse: false, message: 'Failed to check usage limits' };
    }

    const currentUsage = usage?.tone_analyses_count || 0;
    if (currentUsage >= 5) {
      return { canUse: false, message: 'Daily usage limit exceeded' };
    }

    return { canUse: true };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { canUse: false, message: 'Failed to verify usage limits' };
  }
}

// Analyze tone using OpenAI
async function analyzeWithOpenAI(text: string) {
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // --- THIS IS THE UPDATED PROMPT ---
  const prompt = `Analyze the tone of the following message.

Message to analyze: "${text}"

Provide the output in this exact JSON format.
- For "explanation", provide a JSON array of 3 short, direct, literal sentences.
- DO NOT use vague words like 'might', 'seems', 'somewhat', or 'a bit'.

{
  "tones": {
    "professional": [number],
    "friendly": [number], 
    "urgent": [number],
    "neutral": [number]
  },
  "confidence": [number between 0.0 and 1.0],
  "explanation": [
    "[Sentence 1: State the primary tone and its direct meaning. Example: 'The primary tone is Professional, which means this is a formal work communication.']",
    "[Sentence 2: State a secondary tone and its direct meaning. Example: 'There is a low amount of Urgency, which means you should reply soon but it is not an emergency.']",
    "[Sentence 3: Give a clear, overall conclusion. Example: 'Overall, this is a standard work request with no hidden negative emotion.']"
  ],
  "suggestions": [
    "[suggestion 1]",
    "[suggestion 2]"
  ]
}`;
  // --- END OF UPDATED PROMPT ---

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

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
            content: 'You are a communication assistant for neurodiverse users. Be literal, direct, and clear. Avoid all ambiguous language.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
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

    const analysis = JSON.parse(content);

    if (!analysis.tones || !analysis.confidence || !analysis.explanation || !analysis.suggestions) {
      throw new Error('Invalid response format from OpenAI');
    }

    const toneSum = Object.values(analysis.tones).reduce((sum: number, value: any) => sum + value, 0);
    if (Math.abs(toneSum - 100) > 1) {
      const factor = 100 / toneSum;
      Object.keys(analysis.tones).forEach(key => {
        analysis.tones[key] = Math.round(analysis.tones[key] * factor);
      });
    }

    return analysis;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Analysis timeout - please try again');
    }
    throw error;
  }
}

// Save analysis to database
async function saveAnalysis(userId: string, inputText: string, analysisResult: any, confidence: number, processingTime: number) {
  try {
    const { data, error } = await supabase
      .from('tone_analyses')
      .insert({
        user_id: userId,
        input_text: inputText,
        analysis_result: analysisResult,
        confidence_score: confidence,
        processing_time_ms: processingTime
      })
      .select()
      .single();

    if (error) throw error;

    if (!data || !data.id || typeof data.id !== 'string') {
      throw new Error('Database insert succeeded but did not return a valid record ID');
    }

    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('daily_usage')
      .upsert({
        user_id: userId,
        date: today,
        tone_analyses_count: 1
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      });

    await supabase.rpc('increment_usage_counter', {
      p_user_id: userId,
      p_feature: 'tone_analyses_count',
      p_date: today
    }).catch(() => {
      supabase
        .from('daily_usage')
        .update({ 
          tone_analyses_count: supabase.sql`tone_analyses_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('date', today);
    });

    return data;
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis');
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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return corsResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return corsResponse({ error: 'Invalid authentication token' }, 401);
    }

    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return corsResponse({ error: 'Text is required' }, 400);
    }

    if (text.length > 2000) {
      return corsResponse({ error: 'Text too long (max 2000 characters)' }, 400);
    }

    if (text.trim().length === 0) {
      return corsResponse({ error: 'Text cannot be empty' }, 400);
    }

    const moderation = moderateContent(text);
    if (!moderation.isAppropriate) {
      return corsResponse({ 
        error: 'Content moderation failed',
        reason: moderation.reason 
      }, 400);
    }
    
    if (user.email !== 'demo@elucidare.app') {
      const usageCheck = await checkUsageLimit(user.id);
      if (!usageCheck.canUse) {
        return corsResponse({ 
          error: 'Usage limit exceeded',
          message: usageCheck.message 
        }, 429);
      }
    } else {
      console.log('Demo user detected, bypassing usage check for tone analysis.');
    }

    const startTime = Date.now();
    const analysis = await analyzeWithOpenAI(text);
    const processingTime = Date.now() - startTime;

    const savedAnalysis = await saveAnalysis(
      user.id,
      text,
      analysis,
      analysis.confidence,
      processingTime
    );

    return corsResponse({
      id: savedAnalysis.id,
      tones: analysis.tones,
      confidence: analysis.confidence,
      explanation: analysis.explanation,
      suggestions: analysis.suggestions,
      processing_time_ms: processingTime
    });

  } catch (error: any) {
    console.error('Tone analysis error:', error);
    
    if (error.message?.includes('timeout')) {
      return corsResponse({ error: 'Analysis timeout - please try again' }, 408);
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