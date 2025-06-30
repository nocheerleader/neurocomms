import React from 'react';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export function Terms() {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#FDF6F8]">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-accent p-2 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
                <p className="text-sm text-muted-foreground">Your agreement for using Elucidare</p>
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
          <div className="prose max-w-none">
            {/* Last Updated */}
            <div className="mb-8 p-4 bg-accent/50 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Last updated:</p>
              <p className="text-sm font-medium text-foreground">June 26, 2025</p>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to Elucidare! These Terms of Service ("Terms") govern your use of the Elucidare platform, 
                a communication assistance tool designed specifically for neurodiverse professionals. By creating an 
                account or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Please read these Terms carefully. If you do not agree with any part of these Terms, 
                you may not use our services.
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Elucidare provides AI-powered communication assistance services, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Message tone analysis and interpretation</li>
                <li>Professional response script generation</li>
                <li>Personal communication template library</li>
                <li>Voice synthesis and practice tools (Premium feature)</li>
                <li>Communication style assessment and personalization</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts and Eligibility</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Account Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>You must be at least 16 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>One account per person; no account sharing permitted</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">Account Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                You are solely responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account. Please notify us immediately of any unauthorized use.
              </p>
            </section>

            {/* Acceptable Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Permitted Uses</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Elucidare is designed to help you communicate more effectively in personal and professional settings. 
                You may use our services for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Analyzing tone and sentiment in business communications</li>
                <li>Generating appropriate responses for various social contexts</li>
                <li>Building and organizing your personal communication templates</li>
                <li>Practicing communication skills with voice synthesis tools</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">Prohibited Uses</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">You may not use Elucidare to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Generate or analyze content that is harmful, threatening, or harassing</li>
                <li>Create misleading, deceptive, or fraudulent communications</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to reverse engineer or compromise our AI systems</li>
                <li>Use our services for spam or unsolicited communications</li>
                <li>Share your account credentials with others</li>
                <li>Attempt to circumvent usage limits or security measures</li>
              </ul>
            </section>

            {/* Subscription Plans */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription Plans and Billing</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Plan Types</h3>
              <div className="space-y-4 text-muted-foreground mb-6">
                <div className="border border-border rounded-lg p-4">
                  <p className="font-medium text-foreground mb-2">Free Plan</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Limited tone analyses per month</li>
                    <li>Basic script templates</li>
                    <li>Email support</li>
                  </ul>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="font-medium text-foreground mb-2">Premium Plan ($19/month)</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Unlimited tone analyses and script generation</li>
                    <li>Voice synthesis features (10 per month)</li>
                    <li>Advanced personal script library</li>
                    <li>Priority support</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-medium text-foreground mb-3">Billing and Payment</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Premium subscriptions are billed monthly in advance</li>
                <li>All payments are processed securely through Stripe</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Price changes will be communicated 30 days in advance</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Your Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of all content you input into Elucidare. We only use your content to provide 
                our services and do not claim ownership of your messages, scripts, or personal data.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3">Our Platform</h3>
              <p className="text-muted-foreground leading-relaxed">
                Elucidare and all related technologies, algorithms, and intellectual property are owned by us or our 
                licensors. You may not copy, modify, distribute, or create derivative works based on our platform.
              </p>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy and Data Handling</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your privacy is important to us. Our data practices are governed by our Privacy Policy, which is 
                incorporated into these Terms by reference. Key points include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We process your content only to provide our services</li>
                <li>Your messages are not stored permanently or used for AI training</li>
                <li>You can delete your data at any time</li>
                <li>We implement strong security measures to protect your information</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer and Limitation of Liability</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Service Disclaimer</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Elucidare is a communication assistance tool that uses AI to provide suggestions and analysis. 
                While we strive for accuracy, our services are provided "as is" and should not be considered 
                infallible or a substitute for professional advice.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Elucidare and its team shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of our services. Our total 
                liability is limited to the amount you paid for our services in the 12 months preceding the claim.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Account Termination</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Termination by You</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may terminate your account at any time through your account settings or by contacting us. 
                Upon termination, your access to paid features will continue until the end of your current billing period.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3">Termination by Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, 
                or if required by law. We will provide reasonable notice when possible.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-accent/50 border border-border rounded-lg p-4">
                <p className="text-foreground"><strong>Email:</strong> legal@elucidare.io</p>
                <p className="text-foreground"><strong>Subject Line:</strong> Terms of Service Inquiry</p>
                <p className="text-muted-foreground text-sm mt-2">
                  We will respond to legal inquiries within 5 business days.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to These Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms periodically to reflect changes in our services or applicable laws. 
                Material changes will be communicated via email or platform notification at least 30 days before 
                they take effect. Your continued use of Elucidare after such changes constitutes acceptance of the 
                updated Terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
