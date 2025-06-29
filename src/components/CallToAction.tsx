import React from 'react';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const benefits = [
  'Understand if emails are urgent, friendly, or professional in seconds',
  'Generate 3 response options for any workplace or social situation ',
  'Your messages are never stored or shared - complete privacy',
  'Practice responses with voice playback (Premium)'
];

export function CallToAction() {
  const handleStartUsing = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="py-20 bg-[#FBDCE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold font-funnel text-foreground mb-4">
            Decode Workplace Messages. Craft Confident Responses.
          </h3>
          <p className="text-base text-foreground/80 max-w-2xl mx-auto mb-8">
            Join a community of neurodiverse professionals who use Elucidare to understand message tone and respond appropriately in workplace situations.
          </p>
          
          <button 
            onClick={handleStartUsing}
            className="border border-foreground text-foreground px-5 py-2 rounded-full font-bold text-sm hover:bg-primary/5 hover:shadow-2xl transition-all duration-700 flex items-center justify-center gap-2 mx-auto mb-12"
          >
            Analyze Your First Message
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-primary-foreground">
              <CheckCircleIcon className="h-6 w-6 text-chart-2 flex-shrink-0" />
              <span className="text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}