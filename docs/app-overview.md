**App Overview**

# Name (working): ToneWise (consider a punchier, more distinctive alternative later).

## UPDATED NAME: Elucidare 

## Purpose: Help neurodiverse (ND) individuals decode and improve written and verbal communication, empowering them to respond confidently in personal and professional scenarios.

## Platform & Stack:
- Vite + React frontend + Supabase backend
- UI: TailwindCSS, shadcn and Heroicons 
- APIs: 
-- OpenAI integration for tone analysis
-- ElevenLabs Voice AI
-- Stripe for payments

------

** Core Problem to be Solved**

## Primary users: Neurodiverse individuals (ADHD, ASD, social anxiety) experiencing challenges decoding and calibrating professional and social interactions.

Example user: "I literally cannot tell if this person is being sarcastic, passive-aggressive, friendly or neutral and I need to respond appropriately without making it weird and awkward."

## Specific Pain Points:

1. Email tone misinterpretation leading to workplace anxiety.
2. Going blank in social/professional conversations.
3. Inability to verbalize clear thoughts despite understanding them mentally.
4. Social media reply confusion causing relationship stress.

------

**Core Features** 

## MVP Feature Priority: Must Haves


### (1) ToneTuner Analyzer

**Concise Explanation:**
Analyzes incoming text messages to clarify emotional tone, sentiment, and intent, helping users craft nuanced, effective responses.

**User Story:**
"I receive an ambiguous Slack message from my manager. ToneTuner analyzes the message, identifies it as 'frustrated but professional,' reassures me they're stressed about deadlines—not annoyed at me—so I respond appropriately."

**Tech Explainer:**
Leverages advanced sentiment analysis API to categorize text. Offers explanations, flags unclear phrases, and uses ElevenLabs voice API to preview outgoing message tone.

**User Flow:**

* User pastes/uploads incoming text.
* App breaks down emotional tone clearly ("65% frustrated, 30% professional").
* Highlights and flags potentially misunderstood phrases.
* User drafts a reply.
* App suggests tone adjustments and provides a voice preview before sending.

---

### (2) Social Script Generator

**Concise Explanation:**
Helps users generate and practice context-specific responses with varying tones, boosting confidence in social interactions.

**User Story:**
"As a neurodiverse professional, I feel anxious responding to difficult emails. I use Elucidare to generate three scripts, practice them aloud with AI-generated voice, and confidently send an appropriate reply."

**Tech Explainer:**
Uses text-to-script generation models (PicaOS OneTool) combined with ElevenLabs API for voice playback. Saves user scripts and tracks confidence ratings in Supabase.

**User Flow:**

* User inputs conversation context.
* Receives multiple scripts with different tone levels.
* Practices scripts aloud via ElevenLabs audio playback.
* Saves successful scripts to a personal library.
* Rates scripts to improve recommendations.

---

## (3) Response Script Generator

**Concise Explanation:**
Automatically suggests pre-crafted responses tailored to the emotional tone of incoming communications, simplifying and speeding up thoughtful replies.

**User Story:**
"A client emails me angrily about a missed deadline. The app detects frustration and immediately provides three professionally crafted de-escalation responses, making it simple for me to reply calmly and confidently."

**Tech Explainer:**
Combines tone analysis results with prompt-based script generation (PicaOS API) to produce suitable response options in varying conversational styles.

**User Flow:**

* Incoming message analyzed automatically.
* Generates 3 tone-aligned response options:

  * Safe/Professional
  * Warm/Engaging
  * Direct/Efficient
* Each response has a clear explanation for selection rationale.
* User selects and customizes the response to send.



