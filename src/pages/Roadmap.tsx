import React from 'react';
import { ArrowLeftIcon, ClockIcon, MicrophoneIcon, CircleStackIcon } from '@heroicons/react/24/outline';

export function Roadmap() {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e05d38' }}>
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-funnel text-foreground">Product Roadmap</h1>
                <p className="text-sm text-muted-foreground">Upcoming features and improvements</p>
              </div>
            </div>
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-funnel text-foreground mb-4">
              What's Coming Next
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're continuously improving ToneWise based on feedback from our neurodiverse community. 
              Here are the exciting features we're working on to make communication even easier.
            </p>
          </div>

          {/* Upcoming Features */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold font-funnel text-foreground mb-6" style={{ color: '#e05d38' }}>
              Upcoming Features
            </h3>

            {/* Feature 1: Instant CueCards */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e05d38' }}>
                  <MicrophoneIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel text-foreground mb-3">
                    Instant CueCards
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Provides real-time voice-powered prompts and affirmations to assist users during live conversations, 
                    meetings, or phone calls, reducing anxiety and cognitive overwhelm.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Key Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Real-time conversation support</li>
                      <li>Reduces social anxiety during important calls</li>
                      <li>Voice-activated prompts for smooth conversations</li>
                      <li>Personalized affirmations and talking points</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Limitless Pendant Integration */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e05d38' }}>
                  <CircleStackIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel text-foreground mb-3">
                    Limitless Pendant Integration
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Integrates conversation recordings from Limitless Pendant to provide personalized, 
                    actionable insights on user's own communication patterns.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Key Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Analyze your own conversation patterns</li>
                      <li>Identify areas for communication improvement</li>
                      <li>Track progress over time</li>
                      <li>Personalized recommendations based on real conversations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-accent/50 border border-border rounded-lg p-6 mt-12">
            <h3 className="text-lg font-semibold font-funnel text-foreground mb-4">
              Development Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e05d38' }}></div>
                <span className="text-foreground font-medium">Q1 2025:</span>
                <span className="text-muted-foreground">Instant CueCards beta testing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#e05d38' }}></div>
                <span className="text-foreground font-medium">Q2 2025:</span>
                <span className="text-muted-foreground">Limitless Pendant integration development</span>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="text-center mt-12 p-8 bg-card rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold font-funnel text-foreground mb-4">
              Want to Shape Our Roadmap?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your feedback helps us prioritize features that matter most to the neurodiverse community. 
              Let us know what communication challenges you'd like us to solve next.
            </p>
            <a
              href="mailto:feedback@tonewise.app"
              className="inline-flex items-center px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#e05d38' }}
            >
              Share Your Ideas
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}