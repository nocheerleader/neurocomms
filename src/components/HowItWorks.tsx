import React from 'react';

const steps = [
  {
    number: '1',
    title: 'Start With Any Message',
    description: 'Paste confusing emails, texts, or Slack messages. Or describe a situation you need to respond to.'
  },
  {
    number: '2',
    title: 'Understand the Context',
    description: 'Get instant tone analysis: "Direct but not angry" or "Urgent deadline request" plus response suggestions.'
  },
  {
    number: '3',
    title: 'Reply with Confidence',
    description: 'Use the suggestions to refine your message or generate a new response that matches your goals.'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#FBDCE2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold font-funnel text-foreground mb-4">
            Three Tools, Three Simple Steps
          </h3>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            No complex setup or confusing interfaces. Handle any workplace communication challenge in three clear steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="bg-card border-4 border-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{step.number}</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold font-funnel text-foreground mb-4">
                {step.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}