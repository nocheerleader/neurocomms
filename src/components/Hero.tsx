import React from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Communicate with Confidence
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            ToneWise helps neurodiverse professionals analyze message tone and generate appropriate responses. 
            Clear communication made simple with visual feedback and guided suggestions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
              Try ToneWise Now
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition-colors">
              Watch Demo
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-600" />
              <span>Privacy-focused design</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-600" />
              <span>Instant tone analysis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}