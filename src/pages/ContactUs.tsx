import React from 'react';
import { ArrowLeftIcon, EnvelopeIcon, ClockIcon, ChatBubbleLeftRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export function ContactUs() {
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
              <div className="bg-accent p-2 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
                <p className="text-sm text-muted-foreground">Get help and support</p>
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
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 lg:p-12">
          <div className="space-y-8">
            {/* Introduction */}
            <section className="text-center mb-8">
              <h2 className="text-3xl font-bold font-funnel text-foreground mb-4">
                We're Here to Help
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Whether you have questions about using Elucidare, need technical support, or want to share feedback, 
                we're committed to helping you communicate with confidence.
              </p>
            </section>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* General Support */}
              <div className="bg-accent/20 border border-accent/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-accent p-2 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">General Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Questions about features, account issues, or general help using Elucidare.
                </p>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Email: support@tonewise.app</p>
                  <p className="text-muted-foreground text-sm">Response time: Within 24 hours</p>
                </div>
              </div>

              {/* Technical Issues */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-destructive/20 p-2 rounded-lg">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Technical Issues</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Bugs, errors, or problems with the app not working as expected.
                </p>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Email: tech@tonewise.app</p>
                  <p className="text-muted-foreground text-sm">Response time: Within 12 hours</p>
                </div>
              </div>

              {/* Enterprise Sales */}
              <div className="bg-chart-2/10 border border-chart-2/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-chart-2/20 p-2 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Enterprise Sales</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Team dashboards, admin controls, and enterprise features for organizations.
                </p>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Email: enterprise@tonewise.app</p>
                  <p className="text-muted-foreground text-sm">Response time: Within 4 hours</p>
                </div>
              </div>

              {/* Feature Requests */}
              <div className="bg-chart-5/10 border border-chart-5/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-chart-5/20 p-2 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-chart-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Feature Requests & Feedback</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Ideas for new features or feedback on existing functionality.
                </p>
                <div className="space-y-2">
                  <p className="text-foreground font-medium">Email: feedback@tonewise.app</p>
                  <p className="text-muted-foreground text-sm">Response time: Within 48 hours</p>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <section className="bg-muted/50 border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">Support Hours</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-foreground font-medium">Monday - Friday</p>
                  <p className="text-muted-foreground">9:00 AM - 6:00 PM EST</p>
                </div>
                <div>
                  <p className="text-foreground font-medium">Saturday - Sunday</p>
                  <p className="text-muted-foreground">Limited support (urgent issues only)</p>
                </div>
              </div>
            </section>

            {/* What to Include */}
            <section>
              <h3 className="text-xl font-semibold text-foreground mb-4">When Contacting Support</h3>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">
                  To help us assist you quickly, please include:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>A clear description of the issue or question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>What you were trying to do when the problem occurred</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Your account email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Any error messages you received</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>Your browser type (Chrome, Safari, Firefox, etc.)</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Emergency Contact */}
            <section className="text-center bg-destructive/5 border border-destructive/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Urgent Issues
              </h3>
              <p className="text-muted-foreground text-sm">
                For critical issues affecting your work or account security, mark your email as "URGENT" 
                and we'll prioritize your request.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}