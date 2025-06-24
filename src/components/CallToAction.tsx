import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'No account required to start',
  'Privacy-focused - your messages stay private',
  'Designed specifically for neurodiverse professionals',
  'Clear, visual feedback without overwhelming information'
];

export function CallToAction() {
  const handleStartUsing = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="py-20 bg-blue-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Communicate with Confidence?
          </h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join professionals who use ToneWise to navigate workplace communication 
            with clarity and confidence.
          </p>
          
          <button 
            onClick={handleStartUsing}
            className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mx-auto mb-12"
          >
            Start Using ToneWise
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-white">
              <CheckCircle className="h-6 w-6 text-teal-300 flex-shrink-0" />
              <span className="text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}