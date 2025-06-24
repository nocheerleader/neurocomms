import React from 'react';
import { ChartBarIcon, ChatBubbleLeftRightIcon, BookOpenIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: ChartBarIcon,
    title: 'Visual Tone Analysis',
    description: 'See exactly how your message will be perceived with clear visual indicators for tone, formality, and emotional impact.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Smart Response Generation',
    description: 'Generate professional responses with adjustable tone settings. Choose from formal, friendly, direct, or empathetic styles.'
  },
  {
    icon: BookOpenIcon,
    title: 'Template Library',
    description: 'Save and organize your most effective responses. Build a personal library of communication templates that work.'
  },
  {
    icon: CursorArrowRaysIcon,
    title: 'Context-Aware Suggestions',
    description: 'Get specific recommendations based on the situation, recipient, and desired outcome of your communication.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Built for Clear Communication
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every feature is designed with neurodiverse professionals in mind, 
            providing the clarity and confidence you need in professional communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6">
              <div className="bg-blue-100 p-4 rounded-xl flex-shrink-0">
                <feature.icon className="h-8 w-8 text-blue-700" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}