import React from 'react';
import { DocumentCheckIcon, ChartBarIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    number: 1,
    title: 'Complete your assessment',
    description: 'Takes 2 minutes to personalize your experience.',
    icon: DocumentCheckIcon,
    href: '/settings',
    cta: 'Start Assessment'
  },
  {
    number: 2,
    title: 'Try analyzing a message',
    description: 'Paste any text to see how it sounds.',
    icon: ChartBarIcon,
    href: '/tone-analyzer',
    cta: 'Analyze a Message'
  },
  {
    number: 3,
    title: 'Generate your first script',
    description: 'Get help writing professional responses.',
    icon: ChatBubbleLeftRightIcon,
    href: '/script-generator',
    cta: 'Generate a Script'
  },
];

export function GettingStartedCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-black/5">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Get Started in 3 Simple Steps
      </h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-lg">
            <div className="flex-shrink-0">
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-gray-800">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => window.location.href = step.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                {step.cta}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}