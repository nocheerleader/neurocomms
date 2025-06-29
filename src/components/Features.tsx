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
          <h3 className="text-4xl font-bold font-funnel text-foreground mb-4">
            Communicate with Confidence
          </h3>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed with neurodiverse professionals in mind. Elucidare offers three tools that decode workplace communication and help you respond appropriately every time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-[#FBDCE2]"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-full flex-shrink-0 bg-primary text-primary-foreground">
                  <feature.icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel mb-3 text-foreground">
                    {feature.title}
                  </h4>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}