import React from 'react';
import { ChartBarIcon, ChatBubbleLeftRightIcon, BookOpenIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: ChartBarIcon,
    title: 'Visual Tone Analysis',
    description: 'See exactly how your message will be perceived with clear visual indicators for tone, formality, and emotional impact.'
  },
  {
    icon: BookOpenIcon,
    title: 'Template Library',
    description: 'Save and organize your most effective responses. Build a personal library of communication templates that work.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Smart Response Generation',
    description: 'Generate professional responses with adjustable tone settings. Choose from formal, friendly, direct, or empathetic styles.'
  },
  {
    icon: CursorArrowRaysIcon,
    title: 'Context-Aware Suggestions',
    description: 'Get specific recommendations based on the situation, recipient, and desired outcome of your communication.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Built for Clear Communication
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed with neurodiverse professionals in mind, 
            providing the clarity and confidence you need in professional communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            // Apply different styling based on card position
            const isPrimaryCard = index === 0 || index === 1;
            
            return (
              <div 
                key={index} 
                className={`p-8 rounded-xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  isPrimaryCard
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-full flex-shrink-0 ${
                    isPrimaryCard
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-semibold mb-3 ${
                      isPrimaryCard ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {feature.title}
                    </h4>
                    <p className={`leading-relaxed ${
                      isPrimaryCard ? 'text-primary-foreground/90' : 'text-muted-foreground'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}