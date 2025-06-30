import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'Is my communication data private and secure?',
    answer: 'Yes, absolutely. Privacy is our highest priority. The messages you analyze and the scripts you generate are processed securely and are never stored permanently or used to train AI models. Your personal script library is encrypted and only accessible to you.'
  },
  {
    question: 'Is this tool only for neurodiverse people?',
    answer: 'Elucidare was specifically designed with the needs of neurodiverse professionals in mind, using literal language and clear, structured feedback. However, anyone who wants to improve their communication clarity, reduce misunderstandings, and respond more effectively in the workplace will find it valuable.'
  },
  {
    question: 'How does the AI work? What technology are you using?',
    answer: "We use a combination of leading AI models from providers like OpenAI for text analysis and script generation, and ElevenLabs for natural voice synthesis. Our system adds a layer of specific instructions on top of these models to ensure the output is safe, literal, and tailored to a professional context."
  },
  {
    question: 'What if the tone analysis or a suggested script is wrong?',
    answer: "That's a great question. Think of Elucidare as a knowledgeable co-pilot or an assistant, not an infallible oracle. It provides suggestions based on common communication patterns. You are always in control and should use our analysis as a data point to inform your own judgment, not as a command."
  },
  {
    question: 'Why should I upgrade to a Premium account?',
    answer: 'Our free plan is great for occasional help. Upgrading to Premium gives you unlimited analysis and script generation, which is perfect for daily use. You also unlock advanced features like the Voice Practice tool and the ability to build an extensive personal Script Library, turning Elucidare into a powerful, long-term resource.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold font-funnel text-foreground mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Have questions? We have answers. Here are some common things people ask.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border border-border rounded-lg p-6 bg-slate-50/20">
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-lg font-medium text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`h-6 w-6 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}