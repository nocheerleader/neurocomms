import React from 'react';
import { ArrowRightIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

export function Hero() {
  const handleTryNow = () => {
    window.location.href = '/signup';
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-background py-20 pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Text Content */}
          <div className="flex-1 text-left">
            <p className="text-sm text-chart-3 mb-4">
              Elucidare from the Latin: to make clear
            </p>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-funnel font-light text-foreground mb-6 leading-tight">
              Communicate with 
              <br />
              Confidence
            </h1>
            
            <p className="text-base text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Elucidare helps neurodiverse professionals analyze message tone and generate appropriate responses. 
              Clear communication made simple with visual feedback and guided suggestions.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleTryNow}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium text-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                Try Elucidare Now
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              
              <button 
                onClick={handleLearnMore}
                className="border-2 border-primary text-primary px-5 py-2 rounded-full font-medium text-sm hover:bg-primary/5 hover:shadow-md transition-all duration-200"
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground">
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

          {/* Right Column - Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="/hero-img.png"
                alt="Person using laptop for professional communication"
                className="w-full max-w-lg h-auto rounded-2xl shadow-2xl"
              />
              {/* Decorative gradient overlay for better visual appeal */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}