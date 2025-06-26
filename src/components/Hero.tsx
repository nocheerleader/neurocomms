import React from 'react';
import { ArrowRightIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

export function Hero() {
  const handleTryNow = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="bg-gradient-to-b from-accent to-card py-20 pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Communicate with Confidence
          </h2>
          <p className="text-xl text-card-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            ToneWise helps neurodiverse professionals analyze message tone and generate appropriate responses. 
            Clear communication made simple with visual feedback and guided suggestions.
          </p>
          
          <div className="flex justify-center mb-12">
            <button 
              onClick={handleTryNow}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Try ToneWise Now
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-chart-2" />
              <span>Privacy-focused design</span>
            </div>
            <div className="flex items-center gap-2">
              <BoltIcon className="h-5 w-5 text-chart-2" />
              <span>Instant tone analysis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}