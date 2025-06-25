export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          subscription_tier: 'free' | 'premium'
          communication_style: Json | null
          ui_preferences: Json | null
          onboarding_completed: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          subscription_tier?: 'free' | 'premium'
          communication_style?: Json | null
          ui_preferences?: Json | null
          onboarding_completed?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          subscription_tier?: 'free' | 'premium'
          communication_style?: Json | null
          ui_preferences?: Json | null
          onboarding_completed?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      daily_usage: {
        Row: {
          id: string
          user_id: string
          date: string
          tone_analyses_count: number
          script_generations_count: number
          voice_syntheses_count: number
          voice_syntheses_monthly: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          tone_analyses_count?: number
          script_generations_count?: number
          voice_syntheses_count?: number
          voice_syntheses_monthly?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          tone_analyses_count?: number
          script_generations_count?: number
          voice_syntheses_count?: number
          voice_syntheses_monthly?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tone_analyses: {
        Row: {
          id: string
          user_id: string
          input_text: string
          analysis_result: Json
          confidence_score: number | null
          processing_time_ms: number | null
          title: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          input_text: string
          analysis_result: Json
          confidence_score?: number | null
          processing_time_ms?: number | null
          title?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          input_text?: string
          analysis_result?: Json
          confidence_score?: number | null
          processing_time_ms?: number | null
          title?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}