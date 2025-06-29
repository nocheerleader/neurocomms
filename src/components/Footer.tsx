import React from 'react';
import { ChatBubbleLeftRightIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <img src="/logo.svg" alt="ToneWise Logo" className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-funnel">Elucidare</h4>
                <p className="text-sidebar-foreground text-sm font-semibold">Professional Communication Tool</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              Empowering neurodiverse professionals with clear, confident communication tools. 
              Built with accessibility and privacy in mind.
            </p>
            <div className="flex items-center gap-4 text-sm text-sidebar-foreground font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>Support Available</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold font-funnel text-sidebar-foreground mb-4">Product</h5>
            <ul className="space-y-2 text-primary-foreground">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Pricing</a></li>
              </ul>
          </div>

          <div>
            <h5 className="primary-foreground font-funnel text-sidebar-foreground mb-4">Support</h5>
            <ul className="space-y-2 text-primary-foreground">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-primary-foreground">
          <p>&copy; 2025 Elucidare. Built for neurodiverse professionals.</p>
        </div>
      </div>
    </footer>
  );
}