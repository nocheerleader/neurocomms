import React from 'react';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function Privacy() {
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
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground">How we protect and handle your data</p>
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
                At Elucidare, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                communication assistance platform designed for neurodiverse professionals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We understand the sensitive nature of communication assistance tools and have designed our privacy practices 
                with the highest standards of data protection in mind.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Email address and account credentials (encrypted)</li>
                <li>Communication preferences and settings</li>
                <li>Subscription and billing information</li>
                <li>Usage analytics and feature preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">Content Data</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Text messages you analyze for tone detection</li>
                <li>Generated response scripts and templates</li>
                <li>Personal script library content</li>
                <li>Voice synthesis audio files (temporarily processed)</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">Technical Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Device information and browser type</li>
                <li>IP address and general location data</li>
                <li>Usage patterns and feature utilization</li>
                <li>Error logs and performance metrics</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide and improve our tone analysis and script generation services</li>
                <li>Personalize your experience based on communication preferences</li>
                <li>Process payments and manage your subscription</li>
                <li>Send important updates about your account and our services</li>
                <li>Ensure platform security and prevent misuse</li>
                <li>Analyze usage patterns to improve our features for neurodiverse users</li>
                <li>Provide customer support and respond to your inquiries</li>
              </ul>
            </section>

            {/* Data Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Protection and Security</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We implement industry-standard security measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>End-to-end encryption for all communication content</li>
                  <li>Secure data storage with regular security audits</li>
                  <li>Limited access controls for our team members</li>
                  <li>Regular deletion of temporary processing data</li>
                  <li>Compliance with GDPR and CCPA privacy regulations</li>
                </ul>
                <p>
                  <strong>Important:</strong> Your message content is processed only to provide our services and is never 
                  stored permanently or used for training AI models without your explicit consent.
                </p>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the 
                following limited circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (payment processing, hosting)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition (with notice to users)</li>
                <li><strong>Consent:</strong> When you explicitly authorize us to share specific information</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Privacy Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access and review your personal data</li>
                <li>Correct or update your information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of non-essential communications</li>
                <li>Request details about data processing activities</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="bg-accent/50 border border-border rounded-lg p-4">
                <p className="text-foreground"><strong>Email:</strong> privacy@elucidare.io</p>
                <p className="text-foreground"><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                <p className="text-muted-foreground text-sm mt-2">
                  We will respond to privacy-related inquiries within 30 days.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. 
                We will notify you of significant changes by email or through our platform. Your continued use of Elucidare 
                after such modifications constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
