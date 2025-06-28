# Elucidare

**Communicate with Confidence. A communication co-pilot designed for neurodiverse professionals.**

[![Built with Bolt.new](https://storage.bolt.army/white_circle_360x360.png)](https://bolt.new/?rid=5hjt0n)

*This project was built for the Bolt.new 2025 World Record Breaking hackathon.*

**Live Demo:** https://cool-zabaione-f17338.netlify.app/

---

## The Problem

Effective communication in the workplace is challenging for everyone, but it can be a significant source of anxiety and misunderstanding for neurodiverse individuals, such as those with autism or ADHD. Subtle social cues, unwritten rules, and ambiguous language can create a cognitive load that makes it difficult to respond with confidence.

Existing tools often provide generic advice, failing to address the specific, literal interpretation needs of the neurodiverse community.

## Our Solution: Elucidare

Elucidare is the Latin for "to make clear"

**Elucidare** is an AI-powered communication assistant that acts as a "co-pilot" for professional conversations. It demystifies communication by providing clear, literal, and actionable feedback.

Our platform helps users:
*   **Analyze Message Tone:** Paste a message and get a simple, visual breakdown of its perceived tone (Professional, Friendly, Urgent, Neutral) without overwhelming jargon.
*   **Generate Appropriate Responses:** Describe a situation, and Elucidare generates three distinct response options—Casual, Professional, and Direct—explaining *why* each one works.
*   **Build a Personal Library:** Save effective scripts to a personal library, creating a reusable toolkit for common communication challenges.
*   **Practice with Confidence (Premium):** Use our voice synthesis feature to hear scripts spoken aloud, helping to practice tone and delivery before a real conversation.

We built Elucidare with a "privacy-first" approach. User content is processed to provide the service but is not stored permanently or used for training AI models.

## Key Features

-   **Tone Analyzer:** Visual breakdown of message sentiment and practical response suggestions.
-   **Script Generator:** Context-aware script generation with Casual, Professional, and Direct options.
-   **Personal Script Library:** Save, categorize, and reuse your most effective communication templates.
-   **Voice Practice (Premium):** Convert text to speech with different voice styles to practice delivery.
-   **Communication Assessment:** Onboard with a quick assessment to personalize future suggestions.

## Tech Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS
-   **Backend:** Supabase (Auth, Database, Edge Functions)
-   **AI / ML:** OpenAI API (for tone analysis and script generation), ElevenLabs API (for voice synthesis)
-   **Payments:** Stripe for premium subscriptions
-   **Deployment:** Netlify (Frontend), Supabase (Backend)

## How to Run the Project Locally

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd elucidare
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file in the root directory.
    -   Copy the contents of `.env.example` (or add the following) and fill in your Supabase project URL and Anon Key.
    ```
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Demo Credentials

To make evaluation easy, you can use the pre-configured demo account to explore all features, including premium ones.

-   **Email:** `demo@tonewise.app`
-   **Password:** `demopassword123`

Alternatively, you can access the demo account directly via the "Continue as Demo User" button on the signup page.


