Users Table (Built-in with Supabase)

Purpose: Stores login credentials (email and password)
What it holds: Basic account information for signing in

User Profiles Table

Purpose: Stores additional information about each user beyond login details
What it holds: Subscription status (free or premium), communication preferences, whether they completed onboarding

Daily Usage Table

Purpose: Tracks how many features each user has used today
What it holds: Counts of tone analyses, script generations, and voice syntheses used per day

Script Categories Table

Purpose: Organizes scripts into folders (like "Work Emails" or "Social Responses")
What it holds: Category names, colors for visual organization, optional descriptions

Personal Scripts Table

Purpose: Stores all the communication scripts users save
What it holds: The actual script text, title, which category it belongs to, how often it's been used

Tone Analyses Table

Purpose: Keeps history of all tone analysis results
What it holds: The original message analyzed, the results (percentages for each tone), when it was analyzed

Generated Scripts Table

Purpose: Stores history of AI-generated response options
What it holds: The situation described, the three response options generated, which one (if any) the user chose

User Subscriptions Table

Purpose: Manages premium subscriptions and billing
What it holds: Stripe customer IDs, subscription status, billing dates

Payment History Table

Purpose: Records all payments made
What it holds: Payment amounts, dates, receipt links

2. Key Fields for Each Table
User Profiles

id (unique identifier) - Links to the user's login account
subscription_tier (text) - Either "free" or "premium"
communication_style (flexible data) - Stores quiz results about their communication preferences
preferences (flexible data) - Settings like "auto-save scripts" on/off
onboarding_completed (yes/no) - Whether they finished the welcome tour
created_at (timestamp) - When they joined
updated_at (timestamp) - Last time they changed settings

Daily Usage

id (unique identifier) - Record ID
user_id (link) - Which user this belongs to
date (date) - Which day this tracks
tone_analyses_count (number) - How many tone analyses used today
script_generations_count (number) - How many scripts generated today
voice_syntheses_count (number) - How many voice syntheses today
voice_syntheses_monthly (number) - Monthly voice synthesis counter

Script Categories

id (unique identifier) - Category ID
user_id (link) - Which user created this category
name (text) - Category name like "Work Emails"
color (text) - Hex color like "#8B5CF6" for purple
description (text) - Optional explanation of the category
parent_category_id (link) - For subcategories (optional)
created_at (timestamp) - When created

Personal Scripts

id (unique identifier) - Script ID
user_id (link) - Which user owns this script
title (text) - Script name like "Polite deadline extension request"
content (text) - The actual script text
category_id (link) - Which category it's filed under
tags (list of text) - Tags like ["professional", "deadline", "polite"]
usage_count (number) - Times this script has been used
success_rate (decimal) - User's rating of effectiveness (0-100%)
last_used_at (timestamp) - When last copied/used
created_at (timestamp) - When saved

Tone Analyses

id (unique identifier) - Analysis ID
user_id (link) - Which user ran this analysis
input_text (text) - The message they analyzed
analysis_result (flexible data) - Stores the tone percentages and explanations
confidence_score (decimal) - How confident the AI was (0.00-1.00)
processing_time_ms (number) - How long analysis took in milliseconds
created_at (timestamp) - When analyzed

Generated Scripts

id (unique identifier) - Generation ID
user_id (link) - Which user generated these
situation_context (text) - The situation they described
relationship_type (text) - "colleague", "friend", "family", etc.
responses (flexible data) - The three generated options with explanations
selected_response (text) - Which option they chose (if any)
saved_to_library (yes/no) - Whether they saved any response
created_at (timestamp) - When generated

User Subscriptions

id (unique identifier) - Subscription record ID
user_id (link) - Which user this subscription is for
stripe_customer_id (text) - Stripe's customer reference
stripe_subscription_id (text) - Stripe's subscription reference
plan_id (text) - "premium_monthly" or "premium_annual"
status (text) - "active", "canceled", "past_due", or "unpaid"
current_period_start (timestamp) - When current billing period started
current_period_end (timestamp) - When current billing period ends
created_at (timestamp) - When they first subscribed

Payment History

id (unique identifier) - Payment record ID
user_id (link) - Which user made this payment
stripe_payment_intent_id (text) - Stripe's payment reference
amount (number) - Payment amount in cents (999 = $9.99)
currency (text) - "usd" for US dollars
status (text) - Payment status
receipt_url (text) - Link to Stripe receipt
created_at (timestamp) - When payment was made

3. How Tables Connect (Relationships)
Here's a simple visual showing how tables link together:
Users (Supabase Auth)
    |
    └── User Profiles (1-to-1: each user has one profile)
            |
            ├── Daily Usage (1-to-many: one user, many daily records)
            |
            ├── Script Categories (1-to-many: one user, many categories)
            |       |
            |       └── Personal Scripts (1-to-many: one category, many scripts)
            |
            ├── Tone Analyses (1-to-many: one user, many analyses)
            |
            ├── Generated Scripts (1-to-many: one user, many generations)
            |
            ├── User Subscriptions (1-to-1: one user, one active subscription)
            |
            └── Payment History (1-to-many: one user, many payments)

Key Connections Explained:

Every table (except the main Users table) has a user_id field that links back to who owns that data
Personal Scripts link to Script Categories through category_id
Script Categories can link to other categories through parent_category_id for subcategories
All user data is kept separate - users can only see their own information

This structure ensures that:

Each user's data is private and secure
We can track usage limits for free vs premium users
Users can organize their scripts effectively
We have a complete history of AI interactions for improving the service
Billing and subscriptions are properly managed