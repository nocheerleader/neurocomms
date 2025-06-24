NeuroComm App Technical Specification
1. Executive Summary
Project Overview and Objectives
NeuroComm is a web application designed to empower neurodiverse individuals with AI-powered communication tools. The app provides tone analysis, response generation, and voice synthesis capabilities to help users navigate social and professional communication with confidence. Built with accessibility and simplicity as core principles, the application targets the 15-20% of people who struggle with interpreting social cues and crafting appropriate responses.
Key Technical Decisions and Rationale

Supabase Backend: Chosen for rapid development with built-in authentication, real-time database, and Edge Functions for API integration
React + Vite Frontend: Modern React setup with fast build times and excellent developer experience
Netlify Hosting: Simple deployment with automatic HTTPS and global CDN
Usage-Based Pricing Model: Simple daily/monthly counters stored in PostgreSQL for cost control
No Caching Strategy: Maintaining simplicity for MVP while keeping infrastructure requirements minimal

High-Level Architecture Diagram
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   User Browser  │    │  Netlify Frontend   │    │ Supabase Backend    │
│                 │◄──►│  React + Vite       │◄──►│ Auth + DB + Edge    │
└─────────────────┘    └─────────────────────┘    └─────────────────────┘
                                                              │
                        ┌─────────────────────────────────────┼─────────────────────────────────────┐
                        │                                     │                                     │
                   ┌────▼────┐                        ┌─────▼─────┐                        ┌─────▼─────┐
                   │ OpenAI  │                        │ElevenLabs │                        │  Stripe   │
                   │GPT-3.5  │                        │   Voice   │                        │ Payments  │
                   └─────────┘                        └───────────┘                        └───────────┘
Technology Stack Recommendations

Frontend: React 18.2+, Vite 4+, Tailwind CSS 3+
Backend: Supabase Edge Functions (Deno runtime)
Database: PostgreSQL 15+ (Supabase managed)
Authentication: Supabase Auth with email/password
External APIs: OpenAI GPT-3.5-turbo, ElevenLabs, Stripe
Deployment: Netlify with automatic deployments from Git

2. System Architecture
2.1 Architecture Overview
System Components and Relationships
The NeuroComm application follows a serverless architecture pattern with clear separation of concerns:
Frontend Layer (React + Vite)

User interface components built with React functional components and hooks
State management using React Context and useState/useReducer hooks
Routing handled by React Router for single-page application experience
Tailwind CSS for consistent styling and responsive design

Backend Layer (Supabase)

Authentication service managing user sessions and JWT tokens
PostgreSQL database with real-time subscriptions for live updates
Edge Functions serving as API gateway for external service integrations
Row-level security policies enforcing data access controls

External Service Layer

OpenAI API for tone analysis and script generation
ElevenLabs API for voice synthesis functionality
Stripe API for payment processing and subscription management

Data Flow Diagrams
User Action → Frontend Component → Supabase Client → Edge Function → External API
                     ↓                    ↓              ↓              ↓
            State Update ← Database Update ← API Response ← External Response
Authentication Flow:
Login Request → Supabase Auth → JWT Token → Client Storage → API Authorization
Tone Analysis Flow:
Text Input → Usage Check → Edge Function → OpenAI API → Response Processing → Database Log
Infrastructure Requirements

Compute: Netlify hosting with global CDN distribution
Database: Supabase PostgreSQL with 500MB storage (expandable)
API Gateway: Supabase Edge Functions with automatic scaling
External API Quotas: OpenAI GPT-3.5-turbo, ElevenLabs voice synthesis
Storage: Minimal file storage requirements (text-only data)

2.2 Technology Stack
Frontend Technologies and Frameworks

React 18.2+: Component-based UI with hooks for state management
Vite 4+: Fast build tool with hot module replacement
Tailwind CSS 3+: Utility-first CSS framework for rapid styling
React Router 6+: Client-side routing for single-page application
Lucide React: Icon library for consistent iconography

Backend Technologies and Frameworks

Supabase Edge Functions: Deno-based serverless functions
Supabase Auth: JWT-based authentication with email/password
Supabase Realtime: WebSocket connections for live updates
PostgreSQL 15+: Relational database with ACID compliance

Database and Storage Solutions

Primary Database: Supabase PostgreSQL with row-level security
Session Storage: JWT tokens in browser localStorage
File Storage: No file storage required for MVP (text-only content)
Caching: No caching layer for MVP simplicity

Third-Party Services and APIs

OpenAI GPT-3.5-turbo: Text analysis and generation
ElevenLabs: Voice synthesis and audio generation
Stripe: Payment processing and subscription management
Netlify: Static site hosting and continuous deployment

3. Feature Specifications
3.1 Authentication & User Management
User Stories and Acceptance Criteria
US-001: As a neurodiverse professional, I want to create an account with just email and password, so that I can quickly access communication tools without complex setup.

AC-001.1: User can register with valid email and password (8+ characters)
AC-001.2: Email validation occurs in real-time with visual feedback
AC-001.3: Password strength indicator shows weak/medium/strong levels
AC-001.4: Registration completes within 3 seconds with success confirmation

US-002: As a returning user, I want to log in securely and be remembered across sessions, so that I can access my saved scripts and preferences immediately.

AC-002.1: Login persists for 7 days with JWT token refresh
AC-002.2: "Remember me" option extends session to 30 days
AC-002.3: Automatic redirect to dashboard after successful login
AC-002.4: Clear error messages for invalid credentials

Technical Requirements and Constraints

Email/password authentication only (no social logins for MVP)
JWT token expiration: 7 days default, 30 days with "remember me"
Password requirements: minimum 8 characters, no complexity requirements
Rate limiting: 5 failed login attempts per hour per IP address
Session timeout: automatic logout after 24 hours of inactivity

Detailed Implementation Approach

Registration Flow:

Frontend form validation using controlled components
Real-time email format validation with regex pattern
Password strength calculation using character diversity
Supabase Auth integration with error handling
Automatic profile creation in users table


Login Flow:

Credential validation through Supabase Auth
JWT token storage in localStorage with expiration tracking
Automatic session refresh 24 hours before expiration
Redirect logic based on user subscription status


Session Management:

React Context for authentication state management
Protected route wrapper component for authenticated pages
Automatic token validation on app initialization
Graceful session timeout handling with re-authentication prompt



API Endpoints
typescript// Supabase Auth handles these endpoints internally
POST /auth/v1/signup
POST /auth/v1/signin
POST /auth/v1/signout
GET /auth/v1/user
Data Models Involved
sql-- Handled by Supabase Auth
auth.users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  encrypted_password VARCHAR,
  created_at TIMESTAMP,
  confirmed_at TIMESTAMP
)

-- Custom user profiles
public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  subscription_tier VARCHAR DEFAULT 'free',
  communication_style JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
Error Handling and Edge Cases

Invalid email format: Real-time validation with clear error message
Password too short: Inline validation with character count
Email already exists: Clear message with login option
Network connectivity issues: Retry mechanism with offline indicator
Session expiration: Automatic redirect to login with preserved form data

Performance Considerations

Client-side form validation to reduce server requests
Debounced email validation to prevent excessive API calls
JWT token refresh in background to maintain seamless experience
Loading states for all authentication actions with 2-second timeout

3.2 ToneTuner (AI-Powered Tone Analysis)
User Stories and Acceptance Criteria
US-003: As a neurodiverse professional, I want to paste a message and understand its emotional tone with clear explanations, so that I can interpret the sender's intent accurately.

AC-003.1: Text analysis completes within 2 seconds for messages up to 1000 characters
AC-003.2: Results show percentage breakdown for 4 tone categories with confidence levels
AC-003.3: Plain English explanations accompany each tone category
AC-003.4: Analysis history saves automatically for future reference

US-004: As a free user, I want to understand my daily limits clearly, so that I can use my analyses strategically.

AC-004.1: Usage counter displays "X of 5 daily analyses remaining" prominently
AC-004.2: Warning appears when only 1 analysis remains
AC-004.3: Clear upgrade path when daily limit is reached
AC-004.4: Daily limits reset at midnight UTC with confirmation

Technical Requirements and Constraints

Daily limits: 5 analyses for free users, unlimited for premium
Response time: Maximum 2 seconds, timeout at 10 seconds
Input limits: 1000 characters maximum per analysis
Content moderation: OpenAI moderation API integration required
Usage tracking: Daily counters stored in PostgreSQL

Detailed Implementation Approach

Text Input Processing:

Character counter with real-time updates
Input sanitization and validation
Content moderation check before analysis
Usage limit validation before API call


OpenAI Integration:

GPT-3.5-turbo model with specific tone analysis prompt
Structured response format for consistent parsing
Error handling for rate limits and content violations
Response caching disabled for MVP simplicity


Results Display:

Four tone categories: Professional, Friendly, Urgent, Neutral
Percentage confidence with color-coded indicators
Plain English explanations for each detected tone
Analysis history with search and filter capabilities



User Flow Diagrams
[Text Input] → [Character Validation] → [Usage Check] → [Content Moderation] 
     ↓
[OpenAI Analysis] → [Response Processing] → [Results Display] → [History Save]
API Endpoints
typescript// Edge Function for tone analysis
POST /functions/v1/analyze-tone
{
  text: string,
  user_id: string
}

// Response format
{
  tones: {
    professional: { percentage: number, confidence: number, explanation: string },
    friendly: { percentage: number, confidence: number, explanation: string },
    urgent: { percentage: number, confidence: number, explanation: string },
    neutral: { percentage: number, confidence: number, explanation: string }
  },
  overall_confidence: number,
  analysis_id: string
}
Data Models Involved
sql-- Usage tracking
daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  date DATE DEFAULT CURRENT_DATE,
  tone_analyses_count INTEGER DEFAULT 0,
  script_generations_count INTEGER DEFAULT 0,
  voice_syntheses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
)

-- Analysis history
tone_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  input_text TEXT,
  analysis_result JSONB,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
)
Error Handling and Edge Cases

Content moderation failure: Clear message about inappropriate content
OpenAI API timeout: Retry mechanism with exponential backoff
Daily limit exceeded: Upgrade prompt with feature comparison
Invalid input: Character limit and format validation
Network errors: Offline indicator with retry option

Performance Considerations

Input debouncing to prevent excessive character counting
Optimized OpenAI prompt for faster response times
Database indexing on user_id and date for usage queries
Client-side loading states with progress indicators

3.3 Social Script Generator
User Stories and Acceptance Criteria
US-005: As someone who struggles with appropriate responses, I want to input a situation and receive multiple response options with different tones, so that I can choose what feels right for me.

AC-005.1: Three response variations generated: Casual, Professional, Direct
AC-005.2: Each response includes context explanation and "why this works" section
AC-005.3: Generation completes within 5 seconds with progress indicator
AC-005.4: Option to regenerate responses with different parameters

US-006: As a professional, I want to save successful scripts to my personal library, so that I can reuse effective communication patterns.

AC-006.1: One-click save to library with category selection
AC-006.2: Scripts automatically categorized based on context
AC-006.3: Copy-to-clipboard functionality with confirmation
AC-006.4: Integration with tone analyzer for generated responses

Technical Requirements and Constraints

Daily limits: 3 generations for free users, unlimited for premium
Response variations: Exactly 3 options per generation
Input limits: 500 characters for situation description
Content moderation: Required for both input and generated responses
Save functionality: Automatic categorization with manual override

Detailed Implementation Approach

Situation Input Processing:

Dropdown templates for common situations
Custom text area for specific contexts
Relationship context selector (colleague, friend, family, etc.)
Situation validation and content moderation


Response Generation:

Structured OpenAI prompt for three distinct tone variations
Context-aware generation based on relationship type
Response explanation generation for learning purposes
Quality validation and regeneration options


Script Management:

Automatic save to personal library
Category assignment with smart suggestions
Copy-to-clipboard with platform formatting
Integration with existing script library



User Flow Diagrams
[Situation Input] → [Context Selection] → [Usage Validation] → [OpenAI Generation]
     ↓
[Three Responses] → [Save to Library] → [Category Assignment] → [Copy/Share Options]
API Endpoints
typescript// Edge Function for script generation
POST /functions/v1/generate-scripts
{
  situation: string,
  relationship_context: string,
  user_id: string
}

// Response format
{
  responses: [
    {
      type: 'casual' | 'professional' | 'direct',
      text: string,
      explanation: string,
      confidence: number
    }
  ],
  generation_id: string
}
Data Models Involved
sql-- Generated scripts
generated_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  situation_context TEXT,
  relationship_type VARCHAR(50),
  responses JSONB,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Personal script library
personal_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255),
  content TEXT,
  category VARCHAR(100),
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
Error Handling and Edge Cases

Inappropriate situation input: Content moderation with specific guidance
Generation timeout: Progressive timeout with partial results
Daily limit reached: Clear upgrade messaging with value proposition
Save conflicts: Duplicate detection with merge options
Category errors: Fallback to "Uncategorized" with manual correction

Performance Considerations

Template caching for common situations
Batch processing for multiple response types
Database indexing for script library searches
Optimized prompt engineering for faster generation

3.4 Voice Synthesis System
User Stories and Acceptance Criteria
US-007: As a premium user, I want to hear my scripts read aloud with natural voice, so that I can practice delivery and pronunciation.

AC-007.1: Audio generation completes within 30 seconds for 500-word scripts
AC-007.2: Playback controls include speed adjustment (0.75x to 1.25x)
AC-007.3: Text highlighting synchronized with audio playback
AC-007.4: Download option for offline practice

US-008: As a mobile user, I want voice synthesis to work reliably on my device, so that I can practice anywhere.

AC-008.1: MP3 format compatible with all mobile browsers
AC-008.2: Responsive audio controls that work with touch input
AC-008.3: Background playback support for multitasking
AC-008.4: Automatic pause when switching browser tabs

Technical Requirements and Constraints

Premium-only feature with 10 monthly generations limit
Audio format: MP3 for universal compatibility
File streaming: Direct browser playback without server storage
Timeout: 15 seconds for generation, 30 seconds for long scripts
Quality: Standard quality to balance speed and file size

Detailed Implementation Approach

Premium Access Control:

Subscription validation before feature access
Usage counter for monthly voice generation limits
Clear upgrade messaging for free users
Feature preview with locked controls


ElevenLabs Integration:

Text preprocessing for optimal voice synthesis
Voice selection with consistent personality
Quality settings optimized for web playback
Error handling for generation failures


Audio Playback System:

Custom HTML5 audio player with app styling
Speed control implementation with browser APIs
Text highlighting using audio timemarks
Download functionality with appropriate file naming



User Flow Diagrams
[Script Text] → [Premium Check] → [Usage Validation] → [ElevenLabs Generation]
     ↓
[Audio Stream] → [HTML5 Player] → [Playback Controls] → [Download Option]
API Endpoints
typescript// Edge Function for voice synthesis
POST /functions/v1/synthesize-voice
{
  text: string,
  user_id: string,
  voice_settings?: {
    voice_id: string,
    speed: number,
    stability: number
  }
}

// Response format
{
  audio_url: string,
  duration: number,
  file_size: number,
  generation_id: string
}
Data Models Involved
sql-- Voice generation tracking
voice_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  text_content TEXT,
  audio_duration DECIMAL(5,2),
  file_size INTEGER,
  voice_settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Monthly usage tracking (extends daily_usage)
ALTER TABLE daily_usage ADD COLUMN voice_syntheses_monthly INTEGER DEFAULT 0;
Error Handling and Edge Cases

ElevenLabs quota exceeded: Clear messaging with alternative solutions
Audio generation timeout: Partial generation with retry option
Browser compatibility issues: Fallback to basic audio controls
Network interruption during playback: Resume functionality
File download failures: Alternative streaming-only mode

Performance Considerations

Text preprocessing to optimize generation speed
Progressive audio loading for long scripts
Memory management for audio file handling
Bandwidth optimization for mobile users

3.5 Personal Script Library
User Stories and Acceptance Criteria
US-009: As a frequent user, I want to organize my successful scripts by category, so that I can quickly find appropriate responses for different situations.

AC-009.1: Category system with custom categories and color coding
AC-009.2: Search functionality across script content and metadata
AC-009.3: Sorting options by date, usage frequency, and alphabetical
AC-009.4: Bulk operations for organizing multiple scripts

US-010: As someone who communicates across platforms, I want to search and copy scripts easily, so that I can use them in emails, texts, or social media.

AC-010.1: One-click copy-to-clipboard with visual confirmation
AC-010.2: Export options for individual scripts and bulk export
AC-010.3: Platform-specific formatting (email, social media, formal)
AC-010.4: Usage tracking to identify most effective scripts

Technical Requirements and Constraints

Storage limit: 1000 scripts per user for free tier, unlimited for premium
Search performance: Results within 500ms for up to 10,000 scripts
Export formats: PDF, plain text, CSV for spreadsheet compatibility
Real-time sync: Changes reflected across all user sessions within 2 seconds
Backup frequency: Daily automated backups with 30-day retention

Detailed Implementation Approach

Script Storage System:

PostgreSQL with full-text search capabilities
JSON metadata for flexible script attributes
Category management with hierarchical organization
Tag system for cross-category organization


Search and Filter Implementation:

Real-time search with debounced input handling
Multi-criteria filtering (category, date range, usage frequency)
Saved search functionality for power users
Search result highlighting for better usability


Export and Sharing:

PDF generation with custom formatting templates
CSV export with structured data for analysis
Individual script sharing with privacy controls
Import functionality for script migration



User Flow Diagrams
[Library View] → [Search/Filter] → [Script Selection] → [Action Menu]
     ↓
[Copy/Edit/Export/Share] → [Confirmation] → [Usage Tracking Update]
API Endpoints
typescript// Script library management
GET /api/scripts?search=&category=&limit=&offset=
POST /api/scripts
PUT /api/scripts/:id
DELETE /api/scripts/:id

// Bulk operations
POST /api/scripts/bulk-export
POST /api/scripts/bulk-update
DELETE /api/scripts/bulk-delete

// Categories management
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
Data Models Involved
sql-- Personal scripts (updated schema)
personal_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES script_categories(id),
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2) DEFAULT 0.00,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Full-text search index
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || content || ' ' || array_to_string(tags, ' '))
  ) STORED
)

-- Script categories
script_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#8B5CF6',
  description TEXT,
  parent_category_id UUID REFERENCES script_categories(id),
  created_at TIMESTAMP DEFAULT NOW()
)

-- Usage analytics
script_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES personal_scripts(id),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50), -- 'viewed', 'copied', 'edited', 'marked_successful'
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW()
)
Error Handling and Edge Cases

Search timeout: Progressive results with "show more" option
Export failures: Retry mechanism with format fallbacks
Storage limits: Clear warnings at 90% capacity with upgrade options
Category conflicts: Automatic resolution with user confirmation
Sync failures: Offline mode with conflict resolution on reconnection

Performance Considerations

Database indexing on search_vector, user_id, category_id, created_at
Pagination for large script libraries (50 scripts per page)
Lazy loading for script content in list views
Debounced search input (300ms delay) to reduce server load
Client-side caching for frequently accessed scripts

3.6 Payment Integration
User Stories and Acceptance Criteria
US-011: As a free user, I want to clearly understand premium benefits and pricing, so that I can make an informed upgrade decision.

AC-011.1: Feature comparison table highlighting premium benefits
AC-011.2: Usage-based upgrade prompts showing value ("You've used 45 of 50 analyses")
AC-011.3: Clear pricing display with annual discount calculation
AC-011.4: Secure payment processing with multiple payment methods

US-012: As a premium subscriber, I want to manage my billing and subscription easily, so that I can modify or cancel if needed.

AC-012.1: Subscription dashboard with current plan and next billing date
AC-012.2: Billing history with downloadable receipts
AC-012.3: Easy cancellation flow with retention offers
AC-012.4: Payment method updates with security validation

Technical Requirements and Constraints

Payment processor: Stripe Checkout for PCI compliance
Subscription model: Single premium tier at $9.99/month or $99/year
Payment methods: Credit cards, PayPal, Apple Pay, Google Pay
Billing cycles: Monthly or annual with automatic renewal
Trial period: None for MVP (simple upgrade model)

Detailed Implementation Approach

Pricing and Upgrade Flow:

Feature comparison component with real-time usage data
Stripe Checkout integration with secure payment forms
Subscription activation with immediate feature unlock
Welcome sequence for new premium users


Subscription Management:

Stripe Customer Portal for billing management
Webhook handling for subscription status changes
Grace period handling for payment failures
Prorated billing for plan changes


Feature Access Control:

Subscription status validation for premium features
Usage limit enforcement based on subscription tier
Graceful degradation when subscription expires
Clear upgrade prompts within premium features



User Flow Diagrams
[Free User] → [Usage Limit] → [Upgrade Prompt] → [Stripe Checkout]
     ↓
[Payment Success] → [Subscription Activation] → [Feature Unlock] → [Welcome Tour]

[Premium User] → [Billing Dashboard] → [Manage Subscription] → [Customer Portal]
API Endpoints
typescript// Subscription management
POST /functions/v1/create-checkout-session
POST /functions/v1/create-customer-portal-session
POST /functions/v1/webhook/stripe

// Subscription status
GET /api/subscription/status
GET /api/subscription/usage

// Internal endpoints
PUT /api/users/:id/subscription
GET /api/billing/receipts
Data Models Involved
sql-- Subscription tracking
user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_id VARCHAR(100), -- 'premium_monthly' or 'premium_annual'
  status VARCHAR(50), -- 'active', 'canceled', 'past_due', 'unpaid'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Payment history
payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id VARCHAR(255),
  amount INTEGER, -- in cents
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50),
  description TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
Error Handling and Edge Cases

Payment failures: Clear error messages with retry options
Subscription conflicts: Automatic resolution with customer support escalation
Webhook failures: Retry mechanism with exponential backoff
Proration calculations: Transparent billing with detailed explanations
Cancellation edge cases: Immediate vs. end-of-period cancellation options

Performance Considerations

Webhook processing within 30 seconds for subscription updates
Cached subscription status for frequent feature access checks
Asynchronous payment processing with status polling
Optimized database queries for billing history retrieval

4. Data Architecture
4.1 Data Models
User Management Entities
auth.users (Supabase managed)

Purpose: Core authentication and user identity management
Attributes:

id (UUID, PRIMARY KEY): Unique user identifier
email (VARCHAR, UNIQUE): User email address for authentication
encrypted_password (VARCHAR): Securely hashed password
created_at (TIMESTAMP): Account creation timestamp
confirmed_at (TIMESTAMP): Email confirmation timestamp


Relationships: One-to-one with user_profiles
Indexes: Automatic indexing by Supabase on id and email

user_profiles

Purpose: Extended user information and preferences
Attributes:

id (UUID, PRIMARY KEY): References auth.users(id)
subscription_tier (VARCHAR): 'free' or 'premium'
communication_style (JSONB):


RetryCWContinueEdituser_profiles (continued)

Attributes:

communication_style (JSONB): Stores onboarding assessment results
json{
  "formality_preference": "professional",
  "response_style": "direct",
  "context_needs": "high",
  "tone_sensitivity": "medium"
}

preferences (JSONB): User interface and feature preferences
json{
  "default_voice": "professional",
  "auto_save_scripts": true,
  "notification_settings": {
    "usage_warnings": true,
    "daily_summary": false
  }
}

onboarding_completed (BOOLEAN): Tracks completion of initial setup
created_at (TIMESTAMP DEFAULT NOW()): Profile creation date
updated_at (TIMESTAMP DEFAULT NOW()): Last modification date


Relationships: One-to-one with auth.users, one-to-many with personal_scripts
Indexes: PRIMARY KEY on id, INDEX on subscription_tier for feature access queries

Usage Tracking Entities
daily_usage

Purpose: Track and enforce daily/monthly usage limits for cost control
Attributes:

id (UUID, PRIMARY KEY): Unique record identifier
user_id (UUID, REFERENCES auth.users(id)): User association
date (DATE DEFAULT CURRENT_DATE): Usage tracking date
tone_analyses_count (INTEGER DEFAULT 0): Daily tone analysis usage
script_generations_count (INTEGER DEFAULT 0): Daily script generation usage
voice_syntheses_count (INTEGER DEFAULT 0): Daily voice synthesis usage
voice_syntheses_monthly (INTEGER DEFAULT 0): Monthly voice synthesis counter
last_reset_at (TIMESTAMP): Timestamp of last counter reset
created_at (TIMESTAMP DEFAULT NOW()): Record creation


Relationships: Many-to-one with auth.users
Indexes:

UNIQUE constraint on (user_id, date) for single record per user per day
INDEX on date for efficient daily reset operations
INDEX on user_id for user-specific queries



Content Management Entities
script_categories

Purpose: Organize personal scripts with hierarchical categorization
Attributes:

id (UUID, PRIMARY KEY): Category identifier
user_id (UUID, REFERENCES auth.users(id)): Category owner
name (VARCHAR(100) NOT NULL): Display name for category
color (VARCHAR(7) DEFAULT '#8B5CF6'): Hex color for UI display
description (TEXT): Optional category description
parent_category_id (UUID, REFERENCES script_categories(id)): Hierarchical parent
sort_order (INTEGER DEFAULT 0): User-defined ordering
created_at (TIMESTAMP DEFAULT NOW()): Creation timestamp


Relationships:

Many-to-one with auth.users
Self-referencing for hierarchical categories
One-to-many with personal_scripts


Indexes:

INDEX on (user_id, name) for category searches
INDEX on parent_category_id for hierarchy queries



personal_scripts

Purpose: Store user-created and saved communication scripts with metadata
Attributes:

id (UUID, PRIMARY KEY): Script identifier
user_id (UUID, REFERENCES auth.users(id)): Script owner
title (VARCHAR(255) NOT NULL): User-defined script title
content (TEXT NOT NULL): Full script text content
category_id (UUID, REFERENCES script_categories(id)): Category assignment
tags (TEXT[]): Array of user-defined tags for flexible organization
metadata (JSONB DEFAULT '{}'): Flexible metadata storage
json{
  "source": "generated|manual",
  "original_situation": "Meeting follow-up",
  "relationship_context": "professional",
  "tone_analysis": {...},
  "effectiveness_rating": 4.2
}

usage_count (INTEGER DEFAULT 0): Number of times script was used
success_rate (DECIMAL(3,2) DEFAULT 0.00): User-reported success percentage
last_used_at (TIMESTAMP): Most recent usage timestamp
is_favorite (BOOLEAN DEFAULT false): User favoriting flag
created_at (TIMESTAMP DEFAULT NOW()): Creation timestamp
updated_at (TIMESTAMP DEFAULT NOW()): Last modification timestamp
search_vector (tsvector): Full-text search index


Relationships:

Many-to-one with auth.users and script_categories
One-to-many with script_usage_analytics


Indexes:

INDEX on user_id for user-specific queries
INDEX on category_id for category filtering
GIN INDEX on search_vector for full-text search
INDEX on (user_id, last_used_at DESC) for recent scripts
INDEX on (user_id, usage_count DESC) for popular scripts



AI Interaction Entities
tone_analyses

Purpose: Store tone analysis results for history and learning
Attributes:

id (UUID, PRIMARY KEY): Analysis identifier
user_id (UUID, REFERENCES auth.users(id)): User who requested analysis
input_text (TEXT NOT NULL): Original text analyzed
analysis_result (JSONB NOT NULL): Structured analysis results
json{
  "tones": {
    "professional": {"percentage": 75, "confidence": 0.89, "explanation": "..."},
    "friendly": {"percentage": 20, "confidence": 0.65, "explanation": "..."},
    "urgent": {"percentage": 5, "confidence": 0.45, "explanation": "..."},
    "neutral": {"percentage": 0, "confidence": 0.12, "explanation": "..."}
  },
  "overall_confidence": 0.73,
  "key_indicators": ["formal vocabulary", "structured sentences"],
  "model_version": "gpt-3.5-turbo-1106"
}

confidence_score (DECIMAL(3,2)): Overall analysis confidence (0.00-1.00)
processing_time_ms (INTEGER): Analysis duration for performance tracking
created_at (TIMESTAMP DEFAULT NOW()): Analysis timestamp


Relationships: Many-to-one with auth.users
Indexes:

INDEX on user_id for user history
INDEX on created_at for chronological ordering
INDEX on confidence_score for quality analysis



generated_scripts

Purpose: Track AI-generated script responses for usage analytics
Attributes:

id (UUID, PRIMARY KEY): Generation identifier
user_id (UUID, REFERENCES auth.users(id)): Requesting user
situation_context (TEXT NOT NULL): Input situation description
relationship_type (VARCHAR(50)): Context type (colleague, friend, family, etc.)
responses (JSONB NOT NULL): Generated response options
json{
  "casual": {
    "text": "Hey, thanks for letting me know!",
    "explanation": "Informal tone shows appreciation...",
    "confidence": 0.92
  },
  "professional": {
    "text": "Thank you for bringing this to my attention.",
    "explanation": "Professional tone maintains...",
    "confidence": 0.87
  },
  "direct": {
    "text": "Got it. Will handle this today.",
    "explanation": "Direct approach shows...",
    "confidence": 0.84
  }
}

selected_response (VARCHAR(20)): Which response user chose (if any)
saved_to_library (BOOLEAN DEFAULT false): Whether user saved any responses
generation_time_ms (INTEGER): Processing duration
created_at (TIMESTAMP DEFAULT NOW()): Generation timestamp


Relationships: Many-to-one with auth.users
Indexes:

INDEX on user_id for user analytics
INDEX on relationship_type for pattern analysis
INDEX on created_at for usage trends



Subscription and Billing Entities
user_subscriptions

Purpose: Track subscription status and billing information
Attributes:

id (UUID, PRIMARY KEY): Subscription record identifier
user_id (UUID, REFERENCES auth.users(id) UNIQUE): Associated user
stripe_customer_id (VARCHAR(255) UNIQUE): Stripe customer reference
stripe_subscription_id (VARCHAR(255) UNIQUE): Stripe subscription reference
plan_id (VARCHAR(100)): Plan identifier ('premium_monthly', 'premium_annual')
status (VARCHAR(50)): Current status ('active', 'canceled', 'past_due', 'unpaid')
current_period_start (TIMESTAMP): Billing period start
current_period_end (TIMESTAMP): Billing period end
cancel_at (TIMESTAMP): Scheduled cancellation date
canceled_at (TIMESTAMP): Actual cancellation timestamp
trial_start (TIMESTAMP): Trial period start (future feature)
trial_end (TIMESTAMP): Trial period end (future feature)
created_at (TIMESTAMP DEFAULT NOW()): Subscription creation
updated_at (TIMESTAMP DEFAULT NOW()): Last status update


Relationships: One-to-one with auth.users
Indexes:

UNIQUE INDEX on user_id for single subscription per user
INDEX on stripe_customer_id for webhook processing
INDEX on status for subscription status queries
INDEX on current_period_end for billing cycle processing



4.2 Data Storage
Database Selection and Rationale
PostgreSQL 15+ via Supabase was selected for the following reasons:

ACID Compliance: Ensures data consistency for financial transactions and user data
JSON Support: Native JSONB for flexible metadata storage without schema changes
Full-Text Search: Built-in search capabilities for script library functionality
Real-Time Capabilities: Supabase real-time subscriptions for live UI updates
Row-Level Security: Database-level security policies for multi-tenant architecture
Managed Service: Reduces operational overhead with automatic backups and scaling

Data Persistence Strategies
Transactional Data:

User authentication and profile information
Subscription and billing records
Usage tracking with ACID compliance for billing accuracy

Content Data:

Personal scripts with full-text search indexing
AI analysis results with JSON storage for flexibility
Category and tag management with referential integrity

Analytics Data:

Usage patterns and performance metrics
Script effectiveness tracking
Feature adoption analytics

Caching Mechanisms
Application-Level Caching (No external cache for MVP):

React Query for client-side API response caching
Browser localStorage for user preferences and session data
In-memory caching for frequently accessed categories and tags

Database-Level Optimization:

Strategic indexing on frequently queried columns
Query optimization for complex searches and analytics
Connection pooling through Supabase for efficient resource usage

Backup and Recovery Procedures
Automated Backups (via Supabase):

Daily full database backups with 30-day retention
Point-in-time recovery capability for the last 7 days
Automated backup testing and verification

Data Export Capabilities:

User-initiated data exports in multiple formats (JSON, CSV, PDF)
Administrative data exports for compliance and migration
Automated compliance reporting for GDPR/CCPA requirements

Disaster Recovery:

Multi-region backup storage for geographic redundancy
Recovery time objective (RTO): 4 hours for critical systems
Recovery point objective (RPO): 1 hour maximum data loss

5. API Specifications
5.1 Internal APIs
Authentication Endpoints
POST /auth/v1/signup (Supabase managed)

Purpose: Create new user account with email and password
Request Parameters:
typescript{
  email: string, // Valid email format, max 255 characters
  password: string, // Minimum 8 characters
  data?: {
    communication_style?: object,
    onboarding_source?: string
  }
}

Response Schema:
typescript// Success (201)
{
  user: {
    id: string,
    email: string,
    created_at: string,
    confirmed_at: string | null
  },
  session: {
    access_token: string,
    refresh_token: string,
    expires_at: number
  }
}

// Error (400/422)
{
  error: {
    message: string,
    code: string
  }
}

Authentication: None required
Rate Limiting: 5 attempts per hour per IP address
Example Request:
bashcurl -X POST https://project.supabase.co/auth/v1/signup \
  -H "Content-Type: application/json" \
  -H "apikey: your-anon-key" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'


POST /auth/v1/signin (Supabase managed)

Purpose: Authenticate existing user and create session
Request Parameters:
typescript{
  email: string,
  password: string
}

Response Schema: Same as signup success response
Authentication: None required
Rate Limiting: 5 failed attempts per hour per IP address
Example Request:
bashcurl -X POST https://project.supabase.co/auth/v1/signin \
  -H "Content-Type: application/json" \
  -H "apikey: your-anon-key" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'


Core Feature Endpoints
POST /functions/v1/analyze-tone

Purpose: Analyze emotional tone of input text using OpenAI
Request Parameters:
typescript{
  text: string, // 1-1000 characters
  options?: {
    include_confidence: boolean, // default: true
    detailed_analysis: boolean // default: false
  }
}

Response Schema:
typescript// Success (200)
{
  analysis_id: string,
  tones: {
    professional: {
      percentage: number, // 0-100
      confidence: number, // 0.0-1.0
      explanation: string
    },
    friendly: {
      percentage: number,
      confidence: number,
      explanation: string
    },
    urgent: {
      percentage: number,
      confidence: number,
      explanation: string
    },
    neutral: {
      percentage: number,
      confidence: number,
      explanation: string
    }
  },
  overall_confidence: number, // 0.0-1.0
  processing_time_ms: number,
  usage_remaining: number
}

// Usage limit exceeded (429)
{
  error: "Daily limit exceeded",
  usage_info: {
    daily_limit: number,
    used_today: number,
    resets_at: string // ISO timestamp
  },
  upgrade_url: string
}

Authentication: Bearer token required
Rate Limiting: 5 per user per day (free), unlimited (premium)
Timeout: 10 seconds
Example Request:
bashcurl -X POST https://project.supabase.co/functions/v1/analyze-tone \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I need this report completed by tomorrow morning please.",
    "options": {
      "include_confidence": true
    }
  }'


POST /functions/v1/generate-scripts

Purpose: Generate multiple response options for given situation
Request Parameters:
typescript{
  situation: string, // 1-500 characters
  relationship_context: 'colleague' | 'friend' | 'family' | 'manager' | 'stranger' | 'customer',
  tone_preferences?: string[], // ['casual', 'professional', 'direct']
  custom_context?: string
}

Response Schema:
typescript// Success (200)
{
  generation_id: string,
  responses: [
    {
      type: 'casual',
      text: string,
      explanation: string,
      confidence: number,
      estimated_effectiveness: number
    },
    {
      type: 'professional',
      text: string,
      explanation: string,
      confidence: number,
      estimated_effectiveness: number
    },
    {
      type: 'direct',
      text: string,
      explanation: string,
      confidence: number,
      estimated_effectiveness: number
    }
  ],
  processing_time_ms: number,
  usage_remaining: number
}

Authentication: Bearer token required
Rate Limiting: 3 per user per day (free), unlimited (premium)
Timeout: 15 seconds
Example Request:
bashcurl -X POST https://project.supabase.co/functions/v1/generate-scripts \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "situation": "Declining a social invitation politely",
    "relationship_context": "friend"
  }'


POST /functions/v1/synthesize-voice

Purpose: Convert text to speech using ElevenLabs (Premium only)
Request Parameters:
typescript{
  text: string, // 1-2000 characters
  voice_settings?: {
    voice_id: 'professional' | 'friendly' | 'clear',
    speed: number, // 0.75-1.25
    stability: number // 0.0-1.0
  }
}

Response Schema:
typescript// Success (200)
{
  synthesis_id: string,
  audio_url: string, // Temporary URL for streaming
  duration_seconds: number,
  file_size_bytes: number,
  voice_settings: object,
  usage_remaining: number
}

// Premium required (402)
{
  error: "Premium subscription required",
  feature: "voice_synthesis",
  upgrade_url: string
}

Authentication: Bearer token required + Premium subscription
Rate Limiting: 10 per user per month (premium only)
Timeout: 30 seconds
Example Request:
bashcurl -X POST https://project.supabase.co/functions/v1/synthesize-voice \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thank you for bringing this to my attention. I will review the document and get back to you by Friday.",
    "voice_settings": {
      "voice_id": "professional",
      "speed": 1.0
    }
  }'


Script Library Management
GET /api/scripts

Purpose: Retrieve user's personal script library with filtering and search
Request Parameters (Query string):
typescript{
  search?: string, // Full-text search query
  category?: string, // Category ID or name
  tags?: string[], // Array of tag names
  sort?: 'recent' | 'popular' | 'alphabetical' | 'effectiveness',
  limit?: number, // Default: 50, Max: 100
  offset?: number, // For pagination
  include_content?: boolean // Default: true
}

Response Schema:
typescript// Success (200)
{
  scripts: [
    {
      id: string,
      title: string,
      content?: string, // If include_content=true
      category: {
        id: string,
        name: string,
        color: string
      },
      tags: string[],
      usage_count: number,
      success_rate: number,
      is_favorite: boolean,
      last_used_at: string | null,
      created_at: string,
      updated_at: string
    }
  ],
  total_count: number,
  page_info: {
    has_next_page: boolean,
    has_previous_page: boolean,
    current_offset: number
  }
}

Authentication: Bearer token required
Rate Limiting: 100 requests per minute per user
Example Request:
bashcurl "https://api.neurocomm.app/api/scripts?search=meeting&category=work&limit=20" \
  -H "Authorization: Bearer your-jwt-token"


POST /api/scripts

Purpose: Create new script in user's library
Request Parameters:
typescript{
  title: string, // 1-255 characters
  content: string, // 1-10000 characters
  category_id?: string,
  tags?: string[],
  metadata?: {
    source?: 'manual' | 'generated',
    original_situation?: string,
    effectiveness_rating?: number
  }
}

Response Schema:
typescript// Success (201)
{
  id: string,
  title: string,
  content: string,
  category: object | null,
  tags: string[],
  usage_count: 0,
  success_rate: 0,
  created_at: string
}

// Storage limit exceeded (402)
{
  error: "Script storage limit exceeded",
  current_count: number,
  limit: number,
  upgrade_url: string
}

Authentication: Bearer token required
Rate Limiting: 50 creates per hour per user
Example Request:
bashcurl -X POST https://api.neurocomm.app/api/scripts \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Polite meeting postponement",
    "content": "I apologize, but I need to reschedule our meeting...",
    "tags": ["meeting", "professional", "postponement"]
  }'


Usage and Analytics
GET /api/usage/summary

Purpose: Get current usage statistics for rate limiting display
Request Parameters: None
Response Schema:
typescript// Success (200)
{
  daily_usage: {
    tone_analyses: {
      used: number,
      limit: number,
      resets_at: string
    },
    script_generations: {
      used: number,
      limit: number,
      resets_at: string
    }
  },
  monthly_usage: {
    voice_syntheses: {
      used: number,
      limit: number,
      resets_at: string
    }
  },
  subscription: {
    tier: 'free' | 'premium',
    status: 'active' | 'canceled' | 'past_due'
  }
}

Authentication: Bearer token required
Rate Limiting: 20 requests per minute per user
Caching: 60 seconds server-side cache

5.2 External Integrations
OpenAI Integration
Service Description and Purpose:
OpenAI GPT-3.5-turbo provides natural language processing for tone analysis and script generation. The integration handles both analytical tasks (understanding emotional tone) and generative tasks (creating response options).
Authentication Mechanisms:

API Key authentication via Authorization header
Organization ID for usage tracking and billing
Rate limiting handled by OpenAI's built-in mechanisms

API Endpoints and Usage:
Tone Analysis Integration:
javascript// Edge Function implementation
const openaiRequest = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: `You are a communication expert helping neurodiverse individuals understand tone in messages. Analyze the emotional tone and provide percentage breakdowns for Professional, Friendly, Urgent, and Neutral categories. Include confidence levels and plain English explanations for each category.`
    },
    {
      role: "user",
      content: `Analyze this message: "${inputText}"`
    }
  ],
  max_tokens: 500,
  temperature: 0.3,
  functions: [
    {
      name: "analyze_tone",
      parameters: {
        type: "object",
        properties: {
          tones: {
            type: "object",
            properties: {
              professional: { type: "object" },
              friendly: { type: "object" },
              urgent: { type: "object" },
              neutral: { type: "object" }
            }
          }
        }
      }
    }
  ],
  function_call: { name: "analyze_tone" }
};
Script Generation Integration:
javascriptconst scriptGenerationRequest = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: `Generate three response options (casual, professional, direct) for the given situation. Each response should be appropriate for the relationship context and include an explanation of why it works.`
    },
    {
      role: "user",
      content: `Situation: ${situation}\nRelationship: ${relationshipContext}`
    }
  ],
  max_tokens: 800,
  temperature: 0.7
};
Error Handling and Fallback Strategies:

Rate limit handling with exponential backoff (1s, 2s, 4s, 8s)
Content moderation integration for inappropriate input/output
Timeout handling (10s for analysis, 15s for generation)
Fallback to cached similar responses for common scenarios
Graceful degradation with manual input options

Data Synchronization Approaches:

No persistent data sync required (stateless API calls)
Usage tracking for billing and rate limiting
Response caching disabled for personalized results
Error logging for debugging and quality improvement

ElevenLabs Integration
Service Description and Purpose:
ElevenLabs provides high-quality text-to-speech synthesis for script practice. The integration converts user scripts to natural-sounding audio for pronunciation practice and delivery improvement.
Authentication Mechanisms:

API Key authentication via xi-api-key header
Subscription tier validation for premium feature access
Usage quota tracking for monthly limits

API Endpoints and Usage:
Voice Synthesis Integration:
javascript// Edge Function for voice synthesis
const elevenlabsRequest = {
  text: inputText,
  model_id: "eleven_monolingual_v1",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true
  }
};

const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  method: 'POST',
  headers: {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': process.env.ELEVENLABS_API_KEY
  },
  body: JSON.stringify(elevenlabsRequest)
});
Voice Selection Configuration:
javascriptconst voiceProfiles = {
  professional: "21m00Tcm4TlvDq8ikWAM", // Rachel - Professional female
  friendly: "AZnzlk1XvdvUeBnXmlld", // Domi - Friendly female  
  clear: "EXAVITQu4vr4xnSDxMaL", // Bella - Clear articulation
};
Error Handling and Fallback Strategies:

Quota exceeded: Clear messaging with usage reset information
Generation timeout: 30-second limit with progress updates
Audio format issues: Fallback to browser-compatible MP3
Network failures: Retry mechanism with user notification
Premium access validation: Upgrade prompts for free users

Stripe Integration
Service Description and Purpose:
Stripe handles all payment processing, subscription management, and billing operations. The integration provides secure payment collection and automated subscription lifecycle management.
Authentication Mechanisms:

Secret key for server-side operations (Edge Functions)
Publishable key for client-side checkout forms
Webhook signing secret for secure event validation

API Endpoints and Usage:
Checkout Session Creation:
javascript// Edge Function for creating checkout session
const session = await stripe.checkout.sessions.create({
  customer_email: userEmail,
  payment_method_types: ['card'],
  line_items: [
    {
      price: process.env.STRIPE_PREMIUM_PRICE_ID,
      quantity: 1,
    },
  ],
  mode: 'subscription',
  success_url: `${process.env.FRONTEND_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/pricing`,
  metadata: {
    user_id: userId
  }
});
Customer Portal Session:
javascriptconst portalSession = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${process.env.FRONTEND_URL}/dashboard`,
});
Webhook Event Handling:
javascript// Handle subscription events
const handleWebhook = async (event) => {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await updateUserSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await cancelUserSubscription(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
  }
};
Error Handling and Fallback Strategies:

Payment failures: Clear error messages with retry options
Webhook delivery failures: Exponential backoff retry (up to 3 attempts)
Subscription conflicts: Automatic resolution with support escalation
Network timeouts: 30-second limit with user notification
Currency/region issues: Automatic currency detection with manual override

Data Synchronization Approaches:

Real-time webhook processing for subscription status updates
Daily reconciliation job for subscription status validation
Immediate feature access updates upon successful payment
Grace period handling for temporary payment failures
Audit logging for all financial transactions

6. Security & Privacy
6.1 Authentication & Authorization
Authentication Mechanism and Flow
Primary Authentication System:
The application uses Supabase Auth with email/password authentication as the sole login method for MVP simplicity. This approach reduces complexity while maintaining security standards appropriate for neurodiverse users who may struggle with multiple authentication options.
Authentication Flow:
mermaidsequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase Auth
    participant D as Database
    
    U->>F: Enter email/password
    F->>F: Client-side validation
    F->>S: Authentication request
    S->>S: Credential verification
    S->>D: User lookup
    D->>S: User data
    S->>F: JWT token + user info
    F->>F: Store token in localStorage
    F->>U: Redirect to dashboard
Token Management:

JWT Token Structure: Standard Supabase JWT with user ID, email, and subscription claims
Token Expiration: 7 days default, 30 days with "remember me" option
Refresh Mechanism: Automatic refresh 24 hours before expiration
Storage: localStorage with secure flags and expiration tracking
Invalidation: Immediate logout on token tampering or manual logout

Authorization Strategies and Role Definitions
Role-Based Access Control:
typescript// User roles and permissions
interface UserRole {
  tier: 'free' | 'premium';RetryCWContinueEditAuthorization Strategies and Role Definitions (continued)
Role-Based Access Control:
typescript// User roles and permissions
interface UserRole {
  tier: 'free' | 'premium';
  permissions: {
    tone_analyses: {
      daily_limit: number;
      features: string[];
    };
    script_generation: {
      daily_limit: number;
      features: string[];
    };
    voice_synthesis: {
      monthly_limit: number;
      enabled: boolean;
    };
    script_library: {
      storage_limit: number;
      export_formats: string[];
    };
  };
}

// Permission definitions
const ROLE_PERMISSIONS = {
  free: {
    tone_analyses: { daily_limit: 5, features: ['basic_analysis'] },
    script_generation: { daily_limit: 3, features: ['three_variants'] },
    voice_synthesis: { monthly_limit: 0, enabled: false },
    script_library: { storage_limit: 1000, export_formats: ['txt'] }
  },
  premium: {
    tone_analyses: { daily_limit: -1, features: ['basic_analysis', 'detailed_insights'] },
    script_generation: { daily_limit: -1, features: ['three_variants', 'regeneration'] },
    voice_synthesis: { monthly_limit: 10, enabled: true },
    script_library: { storage_limit: -1, export_formats: ['txt', 'pdf', 'csv'] }
  }
};
Feature Access Control Implementation:
typescript// Middleware for feature access validation
const validateFeatureAccess = async (userId: string, feature: string, action: string) => {
  const userSubscription = await getUserSubscription(userId);
  const permissions = ROLE_PERMISSIONS[userSubscription.tier];
  
  switch (feature) {
    case 'tone_analysis':
      const dailyUsage = await getDailyUsage(userId);
      if (permissions.tone_analyses.daily_limit > 0 && 
          dailyUsage.tone_analyses_count >= permissions.tone_analyses.daily_limit) {
        throw new Error('DAILY_LIMIT_EXCEEDED');
      }
      break;
    
    case 'voice_synthesis':
      if (!permissions.voice_synthesis.enabled) {
        throw new Error('PREMIUM_REQUIRED');
      }
      const monthlyUsage = await getMonthlyUsage(userId);
      if (monthlyUsage.voice_syntheses_count >= permissions.voice_synthesis.monthly_limit) {
        throw new Error('MONTHLY_LIMIT_EXCEEDED');
      }
      break;
  }
  
  return true;
};
Session Management
Session Lifecycle:

Session Creation: JWT token generated on successful authentication
Session Validation: Token verification on each API request
Session Renewal: Automatic refresh before expiration
Session Termination: Manual logout or token expiration
Concurrent Sessions: Multiple sessions allowed across devices

Security Controls:
typescript// Session security middleware
const validateSession = async (request: Request) => {
  const token = extractTokenFromHeader(request);
  
  if (!token) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }
  
  try {
    const payload = await verifyJWT(token);
    
    // Check token expiration
    if (payload.exp < Date.now() / 1000) {
      throw new Error('TOKEN_EXPIRED');
    }
    
    // Validate user still exists and is active
    const user = await getUserById(payload.sub);
    if (!user || user.status !== 'active') {
      throw new Error('USER_INVALID');
    }
    
    return { userId: payload.sub, userTier: payload.app_metadata?.subscription_tier };
  } catch (error) {
    throw new Error('INVALID_TOKEN');
  }
};
Token Handling and Refresh Strategies
Token Refresh Implementation:
typescript// Client-side token refresh logic
const refreshTokenIfNeeded = async () => {
  const token = localStorage.getItem('supabase.auth.token');
  if (!token) return false;
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;
  
  // Refresh if token expires within 24 hours
  if (timeUntilExpiry < 24 * 60 * 60 * 1000) {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      return true;
    } catch (error) {
      // Force re-authentication
      await supabase.auth.signOut();
      window.location.href = '/login';
      return false;
    }
  }
  
  return true;
};
6.2 Data Security
Encryption Strategies (At Rest and In Transit)
Data at Rest Encryption:

Database Encryption: AES-256 encryption for all data at rest via Supabase
Sensitive Data: Additional application-level encryption for PII using AES-GCM
Key Management: Encryption keys managed by Supabase with automatic rotation
Backup Encryption: All database backups encrypted with separate key rotation

Data in Transit Encryption:

TLS 1.3: All API communications use TLS 1.3 with perfect forward secrecy
Certificate Management: Automatic SSL certificate renewal via Netlify
API Security: HTTPS enforcement with HSTS headers
Internal Communications: Encrypted connections between Supabase services

Application-Level Encryption:
typescript// Sensitive data encryption utility
import { createCipher, createDecipher } from 'crypto';

const encryptSensitiveData = (data: string, userId: string): string => {
  const key = deriveUserKey(userId, process.env.ENCRYPTION_SALT);
  const cipher = createCipher('aes-256-gcm', key);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  return `${encrypted}:${authTag.toString('hex')}`;
};

const decryptSensitiveData = (encryptedData: string, userId: string): string => {
  const [encrypted, authTag] = encryptedData.split(':');
  const key = deriveUserKey(userId, process.env.ENCRYPTION_SALT);
  
  const decipher = createDecipher('aes-256-gcm', key);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
PII Handling and Protection
Personal Information Classification:
typescript// PII data classification
const PIIClassification = {
  HIGHLY_SENSITIVE: ['password', 'payment_info', 'ssn'],
  MODERATELY_SENSITIVE: ['email', 'full_name', 'phone'],
  LOW_SENSITIVITY: ['communication_preferences', 'usage_analytics'],
  PUBLIC: ['user_id', 'subscription_tier', 'created_at']
};
Data Minimization Practices:

Collection Limitation: Only collect data necessary for core functionality
Purpose Limitation: Use data only for stated purposes
Retention Policies: Automatic deletion of unused data after defined periods
Access Controls: Strict role-based access to PII data

PII Protection Implementation:
typescript// Data access logging
const logDataAccess = async (userId: string, dataType: string, action: string, accessor: string) => {
  await insertAuditLog({
    user_id: userId,
    data_type: dataType,
    action: action, // 'read', 'write', 'delete'
    accessor: accessor,
    timestamp: new Date(),
    ip_address: getClientIP(),
    user_agent: getUserAgent()
  });
};

// Automatic PII masking for logs
const maskPII = (data: object): object => {
  const masked = { ...data };
  
  // Mask email addresses
  if (masked.email) {
    masked.email = masked.email.replace(/(.{2}).*@/, '$1***@');
  }
  
  // Remove sensitive fields entirely
  delete masked.password;
  delete masked.payment_info;
  
  return masked;
};
Compliance Requirements (GDPR, CCPA, etc.)
GDPR Compliance Implementation:
Right to Access:
typescript// Data export functionality
const exportUserData = async (userId: string) => {
  const userData = {
    profile: await getUserProfile(userId),
    scripts: await getUserScripts(userId),
    analyses: await getUserAnalyses(userId),
    usage_history: await getUserUsageHistory(userId),
    subscription: await getUserSubscription(userId)
  };
  
  // Remove system-internal fields
  return sanitizeForExport(userData);
};
Right to Rectification:
typescript// Data correction with audit trail
const updateUserData = async (userId: string, updates: object, requestedBy: string) => {
  const oldData = await getUserData(userId);
  
  await updateUser(userId, updates);
  
  await logDataChange({
    user_id: userId,
    old_values: maskPII(oldData),
    new_values: maskPII(updates),
    requested_by: requestedBy,
    timestamp: new Date()
  });
};
Right to Erasure (Right to be Forgotten):
typescript// Complete data deletion with verification
const deleteUserData = async (userId: string, verificationToken: string) => {
  // Verify deletion request
  const isValid = await verifyDeletionToken(userId, verificationToken);
  if (!isValid) throw new Error('INVALID_DELETION_REQUEST');
  
  // Anonymize rather than delete analytics data
  await anonymizeAnalyticsData(userId);
  
  // Delete personal data
  await deleteUserScripts(userId);
  await deleteUserProfile(userId);
  await deleteUserSessions(userId);
  
  // Mark user as deleted but keep record for audit
  await markUserDeleted(userId);
  
  // Log deletion for compliance
  await logDataDeletion(userId);
};
CCPA Compliance:

Consumer Rights: Same technical implementation as GDPR rights
Do Not Sell: No data selling practices implemented
Opt-Out Mechanisms: Clear privacy controls in user settings
Disclosure Requirements: Transparent privacy policy with data usage details

Security Audit Procedures
Automated Security Scanning:
typescript// Daily security checks
const runSecurityAudit = async () => {
  const auditResults = {
    suspicious_logins: await detectSuspiciousLogins(),
    failed_access_attempts: await getFailedAccessAttempts(),
    data_access_anomalies: await detectDataAccessAnomalies(),
    api_usage_spikes: await detectAPIUsageSpikes()
  };
  
  if (auditResults.suspicious_logins.length > 0) {
    await alertSecurityTeam('SUSPICIOUS_LOGIN_DETECTED', auditResults.suspicious_logins);
  }
  
  return auditResults;
};

// Anomaly detection
const detectDataAccessAnomalies = async () => {
  const recentAccess = await getDataAccessLogs(24); // Last 24 hours
  
  const anomalies = recentAccess.filter(access => {
    // Detect unusual access patterns
    return access.requests_per_hour > 100 || 
           access.accessed_records > 1000 ||
           access.off_hours_access;
  });
  
  return anomalies;
};
Manual Security Reviews:

Quarterly Code Reviews: Security-focused code audits
Penetration Testing: Annual third-party security testing
Compliance Audits: Semi-annual GDPR/CCPA compliance reviews
Access Reviews: Monthly review of user access permissions

6.3 Application Security
Input Validation and Sanitization
Client-Side Validation:
typescript// Input validation schemas using Zod
import { z } from 'zod';

const toneAnalysisSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(1000, 'Text must be under 1000 characters')
    .refine(text => !containsMaliciousPatterns(text), 'Invalid content detected')
});

const scriptCreationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Title contains invalid characters'),
  content: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content too long'),
  tags: z.array(z.string().regex(/^[a-zA-Z0-9\-_]+$/)).optional()
});

// Malicious pattern detection
const containsMaliciousPatterns = (input: string): boolean => {
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,  // Script tags
    /javascript:/gi,                 // JavaScript protocols
    /on\w+\s*=/gi,                  // Event handlers
    /data:text\/html/gi,            // Data URLs
    /vbscript:/gi                   // VBScript
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};
Server-Side Sanitization:
typescript// Input sanitization middleware
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: string, options: SanitizationOptions = {}) => {
  // Remove potentially dangerous HTML
  let sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: options.allowedTags || [],
    ALLOWED_ATTR: options.allowedAttributes || [],
    ALLOW_DATA_ATTR: false
  });
  
  // Additional text-specific sanitization
  sanitized = sanitized
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .substring(0, options.maxLength || 10000);
  
  return sanitized;
};

// SQL injection prevention through parameterized queries
const getUserScripts = async (userId: string, filters: ScriptFilters) => {
  const query = `
    SELECT id, title, content, created_at 
    FROM personal_scripts 
    WHERE user_id = $1 
    AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4
  `;
  
  return await db.query(query, [
    userId,
    filters.search || null,
    filters.limit || 50,
    filters.offset || 0
  ]);
};
OWASP Compliance Measures
OWASP Top 10 Protection Implementation:
A01: Broken Access Control
typescript// Row-level security policies in Supabase
const createRLSPolicies = () => {
  return `
    -- Users can only access their own data
    CREATE POLICY "Users can view own scripts" ON personal_scripts
      FOR SELECT USING (auth.uid() = user_id);
    
    -- Premium users can access voice synthesis
    CREATE POLICY "Premium voice access" ON voice_generations
      FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        (SELECT subscription_tier FROM user_profiles WHERE id = auth.uid()) = 'premium'
      );
  `;
};
A02: Cryptographic Failures
typescript// Secure random generation for sensitive tokens
import { randomBytes } from 'crypto';

const generateSecureToken = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

// Password hashing (handled by Supabase Auth)
const hashPassword = async (password: string): Promise<string> => {
  // Supabase uses bcrypt with salt rounds >= 10
  return await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
};
A03: Injection Attacks
typescript// Content Security Policy implementation
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.openai.com https://api.elevenlabs.io",
    "frame-src https://js.stripe.com"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
A05: Security Misconfiguration
typescript// Environment variable validation
const validateEnvironmentConfig = () => {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
    'ELEVENLABS_API_KEY',
    'STRIPE_SECRET_KEY'
  ];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
  
  // Validate API key formats
  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format');
  }
};
Security Headers and Policies
HTTP Security Headers:
typescript// Netlify _headers file configuration
const securityHeaders = `
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.openai.com https://api.elevenlabs.io https://api.stripe.com; frame-src https://js.stripe.com
`;
Content Security Policy Details:

default-src 'self': Restrict all content to same origin by default
script-src: Allow inline scripts for React and Stripe integration
connect-src: Whitelist external APIs (OpenAI, ElevenLabs, Stripe)
frame-src: Only allow Stripe checkout frames
img-src: Allow data URLs and HTTPS images
Upgrade-Insecure-Requests: Force HTTPS for all resources

Vulnerability Management
Dependency Scanning:
json// package.json scripts for security scanning
{
  "scripts": {
    "audit": "npm audit --audit-level moderate",
    "audit:fix": "npm audit fix",
    "security:check": "npm run audit && npm run lint:security",
    "lint:security": "eslint . --ext .ts,.tsx --config .eslintrc.security.js"
  }
}
Automated Vulnerability Detection:
typescript// GitHub Actions workflow for security scanning
const securityWorkflow = `
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
`;
Security Incident Response:
typescript// Security incident logging and alerting
const reportSecurityIncident = async (incident: SecurityIncident) => {
  // Log incident details
  await logSecurityEvent({
    type: incident.type,
    severity: incident.severity,
    description: incident.description,
    affected_users: incident.affectedUsers,
    timestamp: new Date(),
    source_ip: incident.sourceIP,
    user_agent: incident.userAgent
  });
  
  // Alert security team for high-severity incidents
  if (incident.severity >= SecuritySeverity.HIGH) {
    await sendSecurityAlert({
      channel: 'security-alerts',
      message: `Security incident detected: ${incident.type}`,
      details: incident,
      urgency: 'high'
    });
  }
  
  // Automatic response for certain incident types
  if (incident.type === 'BRUTE_FORCE_ATTACK') {
    await blockIPAddress(incident.sourceIP, 3600); // 1 hour block
  }
};
7. User Interface Specifications
7.1 Design System
Visual Design Principles
Accessibility-First Design Philosophy:
The NeuroComm design system prioritizes cognitive accessibility and reduces sensory overwhelm for neurodiverse users. Every design decision considers executive function challenges, attention differences, and sensory processing variations common in ADHD and ASD populations.
Core Design Principles:

Predictable Consistency: Interface elements maintain consistent behavior and appearance across all screens to reduce cognitive load and build user confidence
Clear Visual Hierarchy: Strategic use of size, color, and spacing to guide attention without overwhelming users
Generous White Space: Ample breathing room prevents visual crowding and supports focus
High Contrast Communication: Strong contrast ratios ensure readability for users with visual processing differences
Progressive Disclosure: Complex features revealed gradually to prevent information overload
Immediate Feedback: Clear, consistent responses to user actions build confidence and reduce anxiety

Brand Guidelines and Personality
Brand Personality Attributes:

Empowering: Technology that builds confidence rather than creating dependency
Clear: Direct communication without ambiguity or hidden meanings
Supportive: Helpful guidance without being condescending
Professional: Serious about accessibility while remaining approachable
Trustworthy: Reliable, secure, and transparent in all interactions

Voice and Tone Guidelines:

Use clear, concrete language with specific examples
Avoid metaphors, idioms, and abstract expressions
Provide context for all actions and their consequences
Acknowledge user expertise while offering supportive guidance
Never use infantilizing language or overly casual tone for serious features

Component Library Structure
Atomic Design Organization:
components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Icon/
│   ├── Typography/
│   └── Badge/
├── molecules/
│   ├── FormField/
│   ├── UsageCounter/
│   ├── ScriptCard/
│   └── ToneResult/
├── organisms/
│   ├── Header/
│   ├── ScriptLibrary/
│   ├── ToneAnalyzer/
│   └── VoicePlayer/
└── templates/
    ├── DashboardLayout/
    ├── AuthLayout/
    └── FeatureLayout/
Component Design Tokens:
typescript// Design token structure
export const designTokens = {
  semantic: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    neutral: 'var(--color-neutral)'
  },
  functional: {
    background: {
      primary: 'var(--bg-primary)',
      secondary: 'var(--bg-secondary)',
      elevated: 'var(--bg-elevated)'
    },
    border: {
      subtle: 'var(--border-subtle)',
      default: 'var(--border-default)',
      strong: 'var(--border-strong)'
    }
  }
};
Responsive Design Approach
Mobile-First Strategy:
All components designed for mobile screens first, then enhanced for larger viewports. This ensures core functionality remains accessible across all devices without overwhelming mobile users.
Breakpoint System:
css/* Tailwind CSS custom breakpoints */
module.exports = {
  theme: {
    screens: {
      'xs': '375px',    /* Small phones */
      'sm': '640px',    /* Large phones */
      'md': '768px',    /* Tablets */
      'lg': '1024px',   /* Small laptops */
      'xl': '1280px',   /* Desktops */
      '2xl': '1536px'   /* Large screens */
    }
  }
}
Responsive Typography Scale:
css/* Fluid typography using clamp() */
.text-heading-1 { font-size: clamp(1.75rem, 4vw, 2.25rem); }
.text-heading-2 { font-size: clamp(1.5rem, 3.5vw, 1.875rem); }
.text-heading-3 { font-size: clamp(1.25rem, 3vw, 1.5rem); }
.text-body-lg { font-size: clamp(1rem, 2.5vw, 1.125rem); }
.text-body { font-size: clamp(0.875rem, 2vw, 1rem); }
.text-small { font-size: clamp(0.75rem, 1.8vw, 0.875rem); }
Accessibility Standards (WCAG Compliance)
WCAG 2.1 AA Compliance Implementation:
Perceivable:

Color Contrast: Minimum 4.5:1 for normal text, 3:1 for large text
Text Alternatives: Alt text for all images and icons
Audio Control: User controls for voice synthesis playback
Resize Text: Support for 200% zoom without horizontal scrolling

Operable:

Keyboard Navigation: All interactive elements accessible via keyboard
Focus Management: Clear focus indicators and logical tab order
Timing: No time limits on core functionality
Seizures: No flashing content above 3Hz

Understandable:

Language: Page language declared, complex terms explained
Predictable: Consistent navigation and component behavior
Input Assistance: Clear error messages and validation guidance

Robust:

Compatibility: Valid HTML with proper semantic markup
Assistive Technology: Screen reader optimization with ARIA labels

Accessibility Implementation Example:
typescript// Accessible button component
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  return (
    <button
      className={`
        btn btn-${variant} btn-${size}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      type="button"
      {...props}
    >
      {loading && (
        <span className="sr-only">Loading...</span>
      )}
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
Platform-Specific UI Considerations
Web Browser Optimization:

Cross-Browser Compatibility: Support for Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
Progressive Enhancement: Core functionality works without JavaScript
Performance: Lazy loading for non-critical components
PWA Features: Service worker for offline script access (future enhancement)

Mobile Web Considerations:

Touch Targets: Minimum 44px touch target size
Viewport Optimization: Proper viewport meta tag configuration
iOS Safari: Specific handling for safe areas and viewport quirks
Android Chrome: Optimized for various screen densities

7.2 Design Foundations
7.2.1 Color System
Primary Color Palette:
css:root {
  /* Primary Brand Colors */
  --color-primary-50: #f0f9ff;   /* Lightest blue */
  --color-primary-100: #e0f2fe;  
  --color-primary-200: #bae6fd;  
  --color-primary-300: #7dd3fc;  
  --color-primary-400: #38bdf8;  
  --color-primary-500: #0ea5e9;  /* Primary blue */
  --color-primary-600: #0284c7;  
  --color-primary-700: #0369a1;  
  --color-primary-800: #075985;  
  --color-primary-900: #0c4a6e;  /* Darkest blue */
  
  /* Secondary Accent Colors */
  --color-secondary-50: #f8fafc;   /* Neutral light */
  --color-secondary-100: #f1f5f9;  
  --color-secondary-500: #64748b;  /* Neutral medium */
  --color-secondary-900: #0f172a;  /* Neutral dark */
  
  /* Feature-Specific Colors */
  --color-tone-analysis: #8b5cf6;  /* Purple */
  --color-script-gen: #14b8a6;     /* Teal */
  --color-voice-synthesis: #f59e0b; /* Amber */
}
Semantic Color System:
css:root {
  /* Success States */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;    /* Primary success */
  --color-success-700: #15803d;RetryCWContinueEdit7.2.1 Color System (continued)
Semantic Color System:
css:root {
  /* Success States */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;    /* Primary success */
  --color-success-700: #15803d;
  
  /* Warning States */
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;    /* Primary warning */
  --color-warning-700: #d97706;
  
  /* Error States */
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;      /* Primary error */
  --color-error-700: #dc2626;
  
  /* Information States */
  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;       /* Primary info */
  --color-info-700: #1d4ed8;
}
Dark Mode Considerations:
css@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-elevated: #334155;
    
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    
    /* Adjusted semantic colors for dark backgrounds */
    --color-success-500: #34d399;
    --color-warning-500: #fbbf24;
    --color-error-500: #f87171;
  }
}
Color Accessibility Ratios:
All color combinations meet WCAG AA standards:

Primary text on white background: 21:1 ratio
Secondary text on white background: 7.8:1 ratio
Primary buttons: 4.5:1 minimum ratio
Interactive elements: 3:1 minimum ratio for large text

7.2.2 Typography
Font Family Hierarchy:
css:root {
  /* Primary font stack */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                  Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  /* Monospace for code/technical content */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 
               'Liberation Mono', 'Courier New', monospace;
  
  /* Display font for headings (future enhancement) */
  --font-display: 'Inter', var(--font-primary);
}
Type Scale System:
css:root {
  /* Font size scale */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  
  /* Line height scale */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
}
Typography Component Classes:
css/* Heading styles */
.heading-1 {
  font-family: var(--font-primary);
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.heading-2 {
  font-family: var(--font-primary);
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--text-primary);
}

.heading-3 {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--text-primary);
}

/* Body text styles */
.body-large {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

.body-default {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

.body-small {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}
Responsive Typography Rules:
css/* Responsive font sizing */
@media (max-width: 640px) {
  .heading-1 { font-size: var(--text-3xl); }
  .heading-2 { font-size: var(--text-2xl); }
  .heading-3 { font-size: var(--text-xl); }
}

@media (max-width: 375px) {
  .heading-1 { font-size: var(--text-2xl); }
  .heading-2 { font-size: var(--text-xl); }
  .heading-3 { font-size: var(--text-lg); }
}
7.2.3 Spacing & Layout
Base Unit System:
css:root {
  /* 8px base unit system */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
Semantic Spacing Scale:
css:root {
  /* Semantic spacing names */
  --space-xs: var(--space-1);    /* 4px */
  --space-sm: var(--space-2);    /* 8px */
  --space-md: var(--space-4);    /* 16px */
  --space-lg: var(--space-6);    /* 24px */
  --space-xl: var(--space-8);    /* 32px */
  --space-2xl: var(--space-12);  /* 48px */
  --space-3xl: var(--space-16);  /* 64px */
}
Container and Layout Specifications:
css/* Container system */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { 
    max-width: 768px;
    padding-left: var(--space-lg);
    padding-right: var(--space-lg);
  }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
Grid System Specifications:
css/* Flexible grid system */
.grid-base {
  display: grid;
  gap: var(--space-md);
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}
Component Spacing Patterns:
css/* Common spacing patterns */
.stack-sm > * + * { margin-top: var(--space-sm); }
.stack-md > * + * { margin-top: var(--space-md); }
.stack-lg > * + * { margin-top: var(--space-lg); }

.inline-sm > * + * { margin-left: var(--space-sm); }
.inline-md > * + * { margin-left: var(--space-md); }
.inline-lg > * + * { margin-left: var(--space-lg); }

/* Card spacing */
.card-padding { padding: var(--space-lg); }
.card-padding-sm { padding: var(--space-md); }
.card-padding-lg { padding: var(--space-xl); }
7.2.4 Interactive Elements
Button Specifications:
css/* Base button styles */
.btn-base {
  font-family: var(--font-primary);
  font-weight: 500;
  text-align: center;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  focus:outline-none;
  focus:ring-2;
  focus:ring-offset-2;
}

/* Button sizes */
.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  min-height: 2rem;
}

.btn-md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  min-height: 2.5rem;
}

.btn-lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
  min-height: 3rem;
}

/* Button variants */
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
  transform: translateY(-1px);
}

.btn-primary:active {
  background-color: var(--color-primary-700);
  transform: translateY(0);
}

.btn-primary:focus {
  ring-color: var(--color-primary-500);
}

.btn-secondary {
  background-color: var(--color-secondary-50);
  color: var(--color-secondary-900);
  border-color: var(--color-secondary-200);
}

.btn-secondary:hover {
  background-color: var(--color-secondary-100);
  border-color: var(--color-secondary-300);
}
Form Field Specifications:
css/* Input field styles */
.form-field {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-secondary-200);
  border-radius: 0.5rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.form-field:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-field:invalid {
  border-color: var(--color-error-500);
}

.form-field::placeholder {
  color: var(--text-muted);
}

/* Form field states */
.form-field-success {
  border-color: var(--color-success-500);
}

.form-field-error {
  border-color: var(--color-error-500);
}

.form-field-disabled {
  background-color: var(--color-secondary-50);
  color: var(--text-muted);
  cursor: not-allowed;
}
Animation Timing and Easing:
css:root {
  /* Animation durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  
  /* Easing functions */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Common animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.slide-in {
  animation: slideIn var(--duration-slow) var(--ease-out);
}

.pulse {
  animation: pulse 2s var(--ease-in-out) infinite;
}
Loading and Transition Patterns:
css/* Loading states */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-secondary-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-secondary-100) 25%,
    var(--color-secondary-50) 50%,
    var(--color-secondary-100) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
7.2.5 Component Specifications
Design Tokens Structure:
typescript// Design tokens implementation
export const tokens = {
  // Color tokens
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e'
    },
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  
  // Spacing tokens
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  
  // Typography tokens
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // Border radius tokens
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  
  // Shadow tokens
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};
Core Component Variants:
typescript// Button component variants
export const buttonVariants = {
  variant: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'text-primary-500 hover:bg-primary-50',
    danger: 'bg-error-500 text-white hover:bg-error-600'
  },
  size: {
    sm: 'px-3 py-2 text-sm min-h-[2rem]',
    md: 'px-4 py-3 text-base min-h-[2.5rem]',
    lg: 'px-6 py-4 text-lg min-h-[3rem]'
  },
  state: {
    default: '',
    loading: 'opacity-75 cursor-not-allowed',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
  }
};

// Card component variants
export const cardVariants = {
  variant: {
    default: 'bg-white border border-secondary-200',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-secondary-300',
    filled: 'bg-secondary-50 border border-secondary-200'
  },
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  },
  radius: {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }
};
State Visualizations:
typescript// Component state management
export const componentStates = {
  // Loading states
  loading: {
    button: 'Loading...',
    form: 'Processing...',
    page: 'Loading content...'
  },
  
  // Empty states
  empty: {
    scripts: 'No scripts saved yet',
    analyses: 'No tone analyses performed',
    search: 'No results found'
  },
  
  // Error states
  error: {
    network: 'Connection error. Please try again.',
    validation: 'Please check your input and try again.',
    permission: 'You don\'t have permission to access this feature.'
  },
  
  // Success states
  success: {
    saved: 'Successfully saved!',
    updated: 'Changes saved successfully',
    deleted: 'Item deleted successfully'
  }
};
Platform-Specific Adaptations:
css/* iOS Safari specific adaptations */
@supports (-webkit-touch-callout: none) {
  .ios-fix {
    /* Fix for iOS viewport units */
    min-height: -webkit-fill-available;
  }
  
  .ios-input {
    /* Prevent zoom on focus */
    font-size: 16px !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .high-contrast {
    --border-width: 2px;
    --text-contrast: 1;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
7.3 User Experience Flows
Key User Journeys with Wireframes/Mockups
Primary User Journey: First-Time Tone Analysis
Flow Overview:
[Landing] → [Sign Up] → [Onboarding] → [Dashboard] → [Tone Analysis] → [Results] → [Save to Library]
Detailed Flow Steps:

Landing Page Entry:

Clear value proposition with specific examples
"Analyze a message tone" demo without requiring signup
Social proof with testimonials from neurodiverse users
Simple "Get Started" CTA with no overwhelming options


Quick Registration:

Single-form signup with email and password only
Real-time validation with green checkmarks for valid inputs
Optional communication style quick assessment (5 questions)
Clear explanation of what happens next


Guided First Analysis:

Welcome message: "Let's analyze your first message"
Pre-filled example text with option to clear and use own content
Usage counter prominently displayed: "5 free analyses today"
Large, clear "Analyze Tone" button


Results Explanation:

Four tone categories with percentage breakdown
Plain English explanations for each detected tone
Confidence indicators with star ratings
"What this means" section with practical interpretation


Action Options:

"Analyze another message" for immediate re-engagement
"Save this analysis" for future reference
"Generate response suggestions" as next logical step
"Upgrade for unlimited analyses" with clear value proposition



Secondary User Journey: Script Generation and Practice
Flow Overview:
[Dashboard] → [Script Generator] → [Situation Input] → [Three Options] → [Selection] → [Voice Practice] → [Library Save]
Detailed Flow Steps:

Generator Access:

Clear entry point from dashboard with feature explanation
Usage indicator: "2 of 3 daily generations remaining"
Quick templates for common situations
Custom situation input with helpful prompts


Context Collection:

Dropdown for relationship type (colleague, friend, family)
Optional mood or urgency indicators
Text area for specific situation details
Character counter with optimization tips


Response Generation:

Loading state with progress updates
Three distinct response cards with clear styling differences
Each response includes explanation and effectiveness rating
Option to regenerate with different parameters


Response Selection and Refinement:

Easy comparison between response options
Edit functionality for personalizing chosen response
Tone adjustment sliders for fine-tuning
Preview of how recipient might interpret the message


Practice and Save:

Voice synthesis for premium users (with usage counter)
Practice mode with text highlighting during audio playback
Save to personal library with automatic categorization
Quick copy-to-clipboard for immediate use



Navigation Structure
Information Architecture:
NeuroComm App
├── Dashboard (/)
│   ├── Quick Actions
│   ├── Recent Activity
│   ├── Usage Summary
│   └── Upgrade Prompts
├── Tone Analyzer (/analyze)
│   ├── Text Input
│   ├── Analysis Results
│   └── History
├── Script Generator (/scripts)
│   ├── Situation Input
│   ├── Response Options
│   └── Generation History
├── Script Library (/library)
│   ├── Saved Scripts
│   ├── Categories
│   ├── Search & Filter
│   └── Export Options
├── Voice Practice (/voice) [Premium]
│   ├── Text Input
│   ├── Voice Settings
│   └── Audio Player
├── Settings (/settings)
│   ├── Profile
│   ├── Preferences
│   ├── Communication Style
│   └── Account Management
└── Subscription (/subscription)
    ├── Current Plan
    ├── Usage Statistics
    ├── Billing History
    └── Plan Management
Navigation Component Implementation:
typescript// Primary navigation component
const Navigation: React.FC = () => {
  const { user, subscription } = useAuth();
  const { pathname } = useLocation();
  
  const navigationItems = [
    { href: '/', label: 'Dashboard', icon: HomeIcon },
    { href: '/analyze', label: 'Tone Analyzer', icon: AnalyzeIcon },
    { href: '/scripts', label: 'Script Generator', icon: ScriptIcon },
    { href: '/library', label: 'My Library', icon: LibraryIcon },
    { 
      href: '/voice', 
      label: 'Voice Practice', 
      icon: VoiceIcon,
      premium: true,
      badge: subscription?.tier !== 'premium' ? 'Premium' : undefined
    }
  ];
  
  return (
    <nav className="navigation" role="navigation" aria-label="Main navigation">
      <ul className="nav-list">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              <item.icon className="nav-icon" aria-hidden="true" />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge" aria-label={`${item.label} requires premium subscription`}>
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
State Management and Transitions
Application State Architecture:
typescript// Global application state structure
interface AppState {
  auth: {
    user: User | null;
    session: Session | null;
    subscription: Subscription | null;
    loading: boolean;
  };
  
  features: {
    toneAnalysis: {
      currentAnalysis: ToneAnalysis | null;
      history: ToneAnalysis[];
      usage: UsageStats;
      loading: boolean;
    };
    
    scriptGeneration: {
      currentGeneration: ScriptGeneration | null;
      history: ScriptGeneration[];
      usage: UsageStats;
      loading: boolean;
    };
    
    voiceSynthesis: {
      currentAudio: AudioFile | null;
      usage: UsageStats;
      loading: boolean;
    };
    
    scriptLibrary: {
      scripts: Script[];
      categories: Category[];
      filters: LibraryFilters;
      loading: boolean;
    };
  };
  
  ui: {
    theme: 'light' | 'dark' | 'auto';
    sidebarOpen: boolean;
    currentModal: string | null;
    notifications: Notification[];
  };
}
State Transition Patterns:
typescript// State transition hooks for consistent UX
const useFeatureState = (featureName: string) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null
  });
  
  const execute = async (action: () => Promise<any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await action();
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };
  
  return { ...state, execute };
};

// Usage in components
const ToneAnalyzer: React.FC = () => {
  const { loading, error, data, execute } = useFeatureState('toneAnalysis');
  const [inputText, setInputText] = useState('');
  
  const analyzeText = () => {
    execute(async () => {
      const result = await toneAnalysisAPI.analyze(inputText);
      // Update usage counter
      await updateUsageStats('tone_analyses');
      return result;
    });
  };
  
  return (
    <div className="tone-analyzer">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your message here..."
        disabled={loading}
        className="form-field"
      />
      
      <button
        onClick={analyzeText}
        disabled={loading || !inputText.trim()}
        className="btn-primary"
      >
        {loading ? 'Analyzing...' : 'Analyze Tone'}
      </button>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {data && <ToneResults analysis={data} />}
    </div>
  );
};
Error States and User Feedback
Error Classification and Handling:
typescript// Error types and user-friendly messages
const errorMessages = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Problem',
    message: 'Please check your internet connection and try again.',
    action: 'Retry',
    severity: 'warning'
  },
  
  // API errors
  RATE_LIMIT_EXCEEDED: {
    title: 'Daily Limit Reached',
    message: 'You\'ve used all your free analyses for today. Upgrade to premium for unlimited access.',
    action: 'Upgrade Now',
    severity: 'info'
  },RetryCWContinueEditError States and User Feedback (continued)
Error Classification and Handling:
typescript// Error types and user-friendly messages (continued)
const errorMessages = {
  // Content errors
  CONTENT_MODERATION_FAILED: {
    title: 'Content Not Supported',
    message: 'This content cannot be analyzed. Please try a different message.',
    action: 'Try Again',
    severity: 'error'
  },
  
  // Authentication errors
  SESSION_EXPIRED: {
    title: 'Session Expired',
    message: 'Please sign in again to continue using NeuroComm.',
    action: 'Sign In',
    severity: 'warning'
  },
  
  // Premium feature errors
  PREMIUM_REQUIRED: {
    title: 'Premium Feature',
    message: 'Voice synthesis is available with a premium subscription.',
    action: 'Learn More',
    severity: 'info'
  },
  
  // Validation errors
  INPUT_TOO_LONG: {
    title: 'Text Too Long',
    message: 'Please keep your message under 1,000 characters for analysis.',
    action: 'Edit Text',
    severity: 'warning'
  }
};

// Error display component
const ErrorDisplay: React.FC<{ error: AppError; onAction?: () => void }> = ({ 
  error, 
  onAction 
}) => {
  const errorConfig = errorMessages[error.type] || {
    title: 'Something went wrong',
    message: 'Please try again or contact support if the problem continues.',
    action: 'Try Again',
    severity: 'error'
  };
  
  return (
    <div 
      className={`error-display error-${errorConfig.severity}`}
      role="alert"
      aria-live="polite"
    >
      <div className="error-icon">
        {errorConfig.severity === 'error' && <AlertCircleIcon />}
        {errorConfig.severity === 'warning' && <AlertTriangleIcon />}
        {errorConfig.severity === 'info' && <InfoIcon />}
      </div>
      
      <div className="error-content">
        <h3 className="error-title">{errorConfig.title}</h3>
        <p className="error-message">{errorConfig.message}</p>
        
        {onAction && (
          <button 
            onClick={onAction}
            className={`btn btn-${errorConfig.severity === 'info' ? 'primary' : 'secondary'}`}
          >
            {errorConfig.action}
          </button>
        )}
      </div>
      
      <button 
        className="error-dismiss"
        onClick={() => {/* dismiss error */}}
        aria-label="Dismiss error message"
      >
        <XIcon />
      </button>
    </div>
  );
};
Loading and Empty States:
typescript// Loading state patterns
const LoadingStates = {
  // Skeleton loading for content
  SkeletonCard: () => (
    <div className="skeleton-card" aria-label="Loading content">
      <div className="skeleton-header" />
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
      <div className="skeleton-action" />
    </div>
  ),
  
  // Spinner for actions
  ActionSpinner: ({ message = 'Loading...' }) => (
    <div className="action-spinner" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="sr-only">{message}</span>
      <span className="spinner-text">{message}</span>
    </div>
  ),
  
  // Progress bar for longer operations
  ProgressBar: ({ progress, message }) => (
    <div className="progress-container" aria-live="polite">
      <div className="progress-label">{message}</div>
      <div 
        className="progress-bar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">{progress}%</div>
    </div>
  )
};

// Empty state patterns
const EmptyStates = {
  // No scripts in library
  EmptyLibrary: () => (
    <div className="empty-state">
      <div className="empty-icon">
        <BookOpenIcon />
      </div>
      <h3 className="empty-title">No scripts saved yet</h3>
      <p className="empty-description">
        Start by generating your first script or analyzing a message tone.
      </p>
      <div className="empty-actions">
        <Link to="/scripts" className="btn-primary">
          Generate First Script
        </Link>
        <Link to="/analyze" className="btn-secondary">
          Analyze Message Tone
        </Link>
      </div>
    </div>
  ),
  
  // No search results
  EmptySearch: ({ query, onClear }) => (
    <div className="empty-state">
      <div className="empty-icon">
        <SearchIcon />
      </div>
      <h3 className="empty-title">No results found</h3>
      <p className="empty-description">
        No scripts match "{query}". Try different keywords or clear your search.
      </p>
      <div className="empty-actions">
        <button onClick={onClear} className="btn-secondary">
          Clear Search
        </button>
      </div>
    </div>
  ),
  
  // First-time user welcome
  WelcomeState: () => (
    <div className="welcome-state">
      <div className="welcome-icon">
        <SparklesIcon />
      </div>
      <h2 className="welcome-title">Welcome to NeuroComm!</h2>
      <p className="welcome-description">
        Let's start by analyzing your first message or generating a response script.
      </p>
      <div className="welcome-actions">
        <Link to="/analyze" className="btn-primary btn-lg">
          Analyze Message Tone
        </Link>
        <Link to="/scripts" className="btn-secondary btn-lg">
          Generate Response Script
        </Link>
      </div>
      <div className="welcome-features">
        <div className="feature-preview">
          <AnalyzeIcon />
          <span>Understand emotional tone in messages</span>
        </div>
        <div className="feature-preview">
          <ScriptIcon />
          <span>Generate appropriate response options</span>
        </div>
        <div className="feature-preview">
          <VoiceIcon />
          <span>Practice with voice synthesis</span>
        </div>
      </div>
    </div>
  )
};
Feedback and Success States:
typescript// Success feedback patterns
const SuccessStates = {
  // Toast notifications for quick feedback
  Toast: ({ message, duration = 3000, onDismiss }) => {
    useEffect(() => {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }, [duration, onDismiss]);
    
    return (
      <div 
        className="toast-success"
        role="status"
        aria-live="polite"
      >
        <CheckCircleIcon className="toast-icon" />
        <span className="toast-message">{message}</span>
        <button 
          onClick={onDismiss}
          className="toast-dismiss"
          aria-label="Dismiss notification"
        >
          <XIcon />
        </button>
      </div>
    );
  },
  
  // Celebration animations for milestones
  Celebration: ({ title, description, action }) => (
    <div className="celebration-state">
      <div className="celebration-animation">
        <div className="confetti" aria-hidden="true" />
        <CheckCircleIcon className="celebration-icon" />
      </div>
      <h2 className="celebration-title">{title}</h2>
      <p className="celebration-description">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  ),
  
  // Inline success indicators
  InlineSuccess: ({ message }) => (
    <div className="inline-success" role="status">
      <CheckIcon className="success-icon" />
      <span className="success-text">{message}</span>
    </div>
  )
};

// Feedback implementation in components
const ScriptGenerator: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState(null);
  
  const handleSaveScript = async (script: Script) => {
    try {
      await saveScriptToLibrary(script);
      setShowSuccess(true);
      
      // Show celebration for first script save
      const isFirstScript = await checkIfFirstScript();
      if (isFirstScript) {
        showCelebration({
          title: 'First Script Saved!',
          description: 'Great start! Your script is now in your personal library.',
          action: {
            label: 'View Library',
            onClick: () => navigate('/library')
          }
        });
      }
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <div className="script-generator">
      {/* Generation interface */}
      
      {showSuccess && (
        <SuccessStates.Toast
          message="Script saved to library!"
          onDismiss={() => setShowSuccess(false)}
        />
      )}
      
      {generatedScripts && (
        <div className="script-results">
          {generatedScripts.map((script, index) => (
            <ScriptCard
              key={index}
              script={script}
              onSave={() => handleSaveScript(script)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
8. Infrastructure & Deployment
8.1 Infrastructure Requirements
Hosting Environment Specifications
Primary Hosting Platform: Netlify

Static Site Hosting: Optimized for React single-page applications
Global CDN: Automatic edge distribution across 200+ locations worldwide
Automatic HTTPS: SSL certificates with automatic renewal
Custom Domains: Support for custom domain configuration
Build Pipeline: Integrated CI/CD with Git-based deployments

Performance Requirements:

Time to First Byte (TTFB): < 200ms globally
Largest Contentful Paint (LCP): < 2.5 seconds
First Input Delay (FID): < 100ms
Cumulative Layout Shift (CLS): < 0.1
Core Web Vitals: All metrics in "Good" threshold

Server Requirements and Configuration
Backend Infrastructure: Supabase
yaml# Supabase configuration
Database:
  Type: PostgreSQL 15+
  Storage: 500MB (Pro plan)
  Connections: 100 concurrent
  Backup: Daily automated with 7-day retention
  Replication: Multi-region read replicas

Edge Functions:
  Runtime: Deno 1.40+
  Memory: 256MB per function
  Timeout: 30 seconds
  Concurrency: 10 per function
  Cold Start: < 100ms

Authentication:
  Provider: Supabase Auth
  Sessions: JWT with 7-day expiration
  Rate Limiting: 30 requests/minute per user
  MFA: Future enhancement capability
External Service Requirements:
yamlOpenAI API:
  Model: GPT-3.5-turbo-1106
  Rate Limit: 100 requests/minute
  Token Limit: 4096 tokens per request
  Timeout: 10 seconds
  Fallback: Cached responses for common queries

ElevenLabs API:
  Voice Models: Multilingual v1
  Audio Format: MP3, 22kHz
  Rate Limit: 20 requests/minute
  File Size Limit: 5MB per generation
  Timeout: 30 seconds

Stripe API:
  Webhooks: Signature verification required
  Rate Limit: 100 requests/second
  Timeout: 10 seconds
  Retry Logic: Exponential backoff
Network Architecture
Content Delivery Network (CDN):
User Request → Netlify Edge Location → Origin Server
     ↓               ↓                    ↓
Cache Hit → Serve Cached Content
Cache Miss → Fetch from Origin → Cache → Serve
API Gateway Architecture:
Frontend → Supabase Edge Functions → External APIs
    ↓            ↓                       ↓
  Auth Check → Rate Limiting → API Routing → Response
    ↓            ↓                       ↓
  Database → Usage Tracking → Error Handling
Security Network Configuration:

DDoS Protection: Automatic mitigation through Netlify's infrastructure
Rate Limiting: Implemented at multiple layers (Netlify, Supabase, Application)
SSL/TLS: TLS 1.3 with perfect forward secrecy
HSTS: HTTP Strict Transport Security headers
Firewall Rules: Geo-blocking for high-risk regions (configurable)

Storage Requirements
Database Storage Allocation:
sql-- Estimated storage requirements per user per year
Users Table: 1KB per user
User Profiles: 2KB per user (including preferences JSON)
Personal Scripts: 500KB per user (average 100 scripts × 5KB each)
Tone Analyses: 200KB per user (average 400 analyses × 0.5KB each)
Generated Scripts: 150KB per user (average 50 generations × 3KB each)
Usage Tracking: 50KB per user (daily records for 1 year)

Total per user per year: ~903KB
Estimated 10,000 users: ~9GB total database storage
File Storage Strategy:

No Persistent File Storage: Audio files streamed directly to users
Temporary Storage: 24-hour retention for generated audio files
Backup Storage: Database backups stored in separate geographic region
CDN Cache: Static assets cached at edge locations globally

8.2 Deployment Strategy
CI/CD Pipeline Configuration
Git Workflow Strategy:
yaml# Branch strategy
main:        # Production deployment
  - Requires PR review
  - Automatic deployment to production
  - Protected branch with status checks

develop:     # Staging deployment  
  - Integration branch for features
  - Automatic deployment to staging
  - Automated testing pipeline

feature/*:   # Feature development
  - Created from develop
  - Deploy preview on Netlify
  - Automated tests on PR creation
Netlify Build Configuration:
toml# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Branch-specific builds
[context.production]
  command = "npm run build:production"
  
[context.develop]
  command = "npm run build:staging"

[context.branch-deploy]
  command = "npm run build:preview"

# Redirect rules
[[redirects]]
  from = "/api/*"
  to = "https://project.supabase.co/functions/v1/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com"
Automated Testing Pipeline:
yaml# GitHub Actions workflow
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_BROWSERS_PATH: 0

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --audit-level high
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Netlify
        run: echo "Deployment handled by Netlify's Git integration"
Environment Management (Dev, Staging, Production)
Environment Configuration Strategy:
typescript// Environment configuration
interface EnvironmentConfig {
  name: 'development' | 'staging' | 'production';
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  stripePublishableKey: string;
  features: {
    analytics: boolean;
    errorReporting: boolean;
    debugMode: boolean;
  };
  limits: {
    maxFileSize: number;
    apiTimeout: number;
    retryAttempts: number;
  };
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    apiUrl: 'http://localhost:3000',
    supabaseUrl: process.env.VITE_SUPABASE_URL_DEV!,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY_DEV!,
    stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST!,
    features: {
      analytics: false,
      errorReporting: false,
      debugMode: true
    },
    limits: {
      maxFileSize: 1024 * 1024, // 1MB
      apiTimeout: 30000,
      retryAttempts: 1
    }
  },
  
  staging: {
    name: 'staging',
    apiUrl: 'https://staging.neurocomm.app',
    supabaseUrl: process.env.VITE_SUPABASE_URL_STAGING!,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY_STAGING!,
    stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST!,
    features: {
      analytics: true,
      errorReporting: true,
      debugMode: false
    },
    limits: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      apiTimeout: 15000,
      retryAttempts: 2
    }
  },
  
  production: {
    name: 'production',
    apiUrl: 'https://app.neurocomm.app',
    supabaseUrl: process.env.VITE_SUPABASE_URL!,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY!,
    stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY!,
    features: {
      analytics: true,
      errorReporting: true,
      debugMode: false
    },
    limits: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      apiTimeout: 10000,
      retryAttempts: 3
    }
  }
};

export const config = environments[import.meta.env.MODE] || environments.development;
Environment-Specific Features:
typescript// Feature flags by environment
const featureFlags = {
  development: {
    mockExternalAPIs: true,
    debugPanels: true,
    extendedLogging: true,
    skipAuthentication: false,
    previewFeatures: true
  },
  
  staging: {
    mockExternalAPIs: false,
    debugPanels: false,
    extendedLogging: true,
    skipAuthentication: false,
    previewFeatures: true
  },
  
  production: {
    mockExternalAPIs: false,
    debugPanels: false,
    extendedLogging: false,
    skipAuthentication: false,
    previewFeatures: false
  }
};
Deployment Procedures and Rollback Strategies
Deployment Procedure:
bash# Automated deployment process
1. Code pushed to main branch
2. GitHub Actions triggers build pipeline
3. Automated tests run (unit, integration, E2E)
4. Security scans execute
5. Build artifacts generated
6. Netlify deployment initiated
7. Health checks performed
8. Traffic gradually shifted to new version
9. Monitoring alerts activated
10. Deployment confirmation sent to team
Rollback Strategy:
yaml# Rollback procedures
Immediate Rollback (< 5 minutes):
  - Netlify instant rollback to previous deployment
  - Database migrations automatically reverted if safe
  - External API configurations restored
  - Monitoring alerts for rollback confirmation

Partial Rollback:
  - Feature flags to disable problematic features
  - Traffic splitting to route users to stable version
  - Gradual rollback over 15-30 minutes
  - User session preservation during transition

Emergency Rollback:
  - Maintenance page activation
  - Complete rollback to last known good state
  - Database point-in-time recovery if needed
  - Incident response team notification
Health Check Implementation:
typescript// Application health monitoring
const healthChecks = {
  // Frontend health check
  frontend: async () => {
    const checks = [
      { name: 'Static Assets', test: () => fetch('/assets/logo.svg') },
      { name: 'API Connectivity', test: () => fetch('/api/health') },
      { name: 'Authentication', test: () => supabase.auth.getSession() },
      { name: 'Database', test: () => supabase.from('users').select('count').single() }
    ];
    
    const results = await Promise.allSettled(checks.map(check => check.test()));
    
    return {
      status: results.every(r => r.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      checks: checks.map((check, i) => ({
        name: check.name,
        status: results[i].status === 'fulfilled' ? 'pass' : 'fail',
        error: results[i].status === 'rejected' ? results[i].reason : null
      })),
      timestamp: new Date().toISOString()
    };
  },
  
  // External service health
  external: async () => {
    const services = [
      { name: 'OpenAI', url: 'https://api.openai.com/v1/models' },
      { name: 'ElevenLabs', url: 'https://api.elevenlabs.io/v1/voices' },
      { name: 'Stripe', url: 'https://api.stripe.com/v1' }
    ];
    
    const results = await Promise.allSettled(
      services.map(service => 
        fetch(service.url, { method: 'HEAD', timeout: 5000 })
      )
    );
    
    return services.map((service, i) => ({
      name: service.name,
      status: results[i].status === 'fulfilled' ? 'healthy' : 'degraded',
      responseTime: results[i].status === 'fulfilled' ? '< 5s' : 'timeout'
    }));
  }
};

// Deployment verification
const verifyDeployment = async () => {
  const health = await healthChecks.frontend();
  const external = await healthChecks.external();
  
  if (health.status !== 'healthy') {
    throw new Error(`Deployment verification failed: ${JSON.stringify(health)}`);
  }
  
  // Log external service status for monitoring
  console.log('External services status:', external);
  
  return {
    verified: true,
    timestamp: new Date().toISOString(),
    health,
    external
  };
};
Configuration Management
Environment Variable Management:
bash# Required environment variables by environment

# Development (.env.development)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJ...dev_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ENVIRONMENT=development

# Staging (.env.staging)
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...staging_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ENVIRONMENT=staging

# Production (Netlify environment variables)
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...prod_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_ENVIRONMENT=production

# Server-side secrets (Supabase Edge Functions)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
Configuration Validation:
typescript// Runtime configuration validation
import { z } from 'zod';

const configSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),
  stripePublishableKey: z.string().startsWith('pk_'),
  environment: z.enum(['development', 'staging', 'production'])
});

const validateConfig = () => {
  try {
    return configSchema.parse({
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      environment: import.meta.env.VITE_ENVIRONMENT
    });
  } catch (error) {
    console.error('Configuration validation failed:', error);
    throw new Error('Invalid application configuration');
  }
};

// Validate configuration on application startup
export const appConfig = validateConfig();
This comprehensive technical specification provides the complete blueprint for developing the NeuroComm application. The document covers all aspects from architecture and data models to deployment strategies, ensuring development teams have clear, actionable guidance for building an accessible, scalable communication tool for neurodiverse users.
The specification emphasizes accessibility-first design, cost-effective infrastructure choices, and clear feature boundaries that align with the MVP goals while maintaining extensibility for future enhancements. All technical decisions prioritize simplicity and reliability to serve the target user base effectively.