import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

const PricingSection = () => {
  return (
    <section className="relative z-10 overflow-hidden bg-white pb-12 pt-20 lg:pb-20 lg:pt-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="mb-2 block text-lg font-semibold text-blue-700">
                Pricing Plans
              </span>
              <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
                Choose Your Communication Plan
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Start free and upgrade as your communication confidence grows. 
                All plans designed specifically for neurodiverse professionals.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center">
          <div className="flex flex-wrap -mx-4">
            <PricingCard
              type="Free"
              price="$0"
              subscription="forever"
              description="Perfect for getting started with tone analysis and basic communication support."
              buttonText="Get Started Free"
              buttonAction={() => window.location.href = '/signup'}
            >
              <PricingFeature>10 tone analyses per month</PricingFeature>
              <PricingFeature>Basic script templates</PricingFeature>
              <PricingFeature>Email support</PricingFeature>
              <PricingFeature>Mobile-friendly interface</PricingFeature>
              <PricingFeature>Privacy-focused design</PricingFeature>
            </PricingCard>
            
            <PricingCard
              type="Premium"
              price="$19"
              subscription="month"
              description="Unlimited access to all features for professional communication confidence."
              buttonText="Start Premium Trial"
              buttonAction={() => window.location.href = '/signup'}
              active
            >
              <PricingFeature>Unlimited tone analyses</PricingFeature>
              <PricingFeature>Advanced script generation</PricingFeature>
              <PricingFeature>Voice synthesis (10/month)</PricingFeature>
              <PricingFeature>Personal script library</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
              <PricingFeature>Usage analytics</PricingFeature>
            </PricingCard>
            
            <PricingCard
              type="Enterprise"
              price="Custom"
              subscription="contact us"
              description="Team dashboards and admin controls for organizations supporting neurodiverse professionals."
              buttonText="Contact Sales"
              buttonAction={() => window.location.href = 'mailto:sales@tonewise.app'}
            >
              <PricingFeature>Everything in Premium</PricingFeature>
              <PricingFeature>Team management dashboard</PricingFeature>
              <PricingFeature>Admin controls & reporting</PricingFeature>
              <PricingFeature>Training modules</PricingFeature>
              <PricingFeature>Custom integrations</PricingFeature>
              <PricingFeature>Dedicated support manager</PricingFeature>
            </PricingCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

interface PricingCardProps {
  children: React.ReactNode;
  description: string;
  price: string;
  type: string;
  subscription: string;
  buttonText: string;
  buttonAction: () => void;
  active?: boolean;
}

const PricingCard = ({
  children,
  description,
  price,
  type,
  subscription,
  buttonText,
  buttonAction,
  active = false,
}: PricingCardProps) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className={`relative z-10 mb-10 overflow-hidden rounded-lg border-2 bg-white px-8 py-10 shadow-lg sm:p-12 lg:px-6 lg:py-10 xl:p-12 ${
        active 
          ? 'border-blue-700 shadow-xl' 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        {active && (
          <div className="absolute top-0 right-0 bg-blue-700 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
            Most Popular
          </div>
        )}
        
        <span className={`mb-3 block text-lg font-semibold ${
          active ? 'text-blue-700' : 'text-blue-700'
        }`}>
          {type}
        </span>
        
        <h2 className="mb-5 text-4xl font-bold text-gray-900">
          {price}
          <span className="text-base font-medium text-gray-600">
            / {subscription}
          </span>
        </h2>
        
        <p className="mb-8 border-b border-gray-200 pb-8 text-base text-gray-600 leading-relaxed">
          {description}
        </p>
        
        <ul className="mb-9 flex flex-col gap-3">{children}</ul>
        
        <button
          onClick={buttonAction}
          className={`block w-full rounded-lg border p-3 text-center text-base font-medium transition-all ${
            active
              ? 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800 hover:border-blue-800'
              : 'border-gray-300 bg-transparent text-blue-700 hover:border-blue-700 hover:bg-blue-700 hover:text-white'
          }`}
        >
          {buttonText}
        </button>
        
        {/* Decorative elements */}
        <div>
          <span className="absolute right-0 top-7 z-[-1]">
            <svg
              width={77}
              height={172}
              viewBox="0 0 77 172"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={86} cy={86} r={86} fill="url(#paint0_linear)" />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1={86}
                  y1={0}
                  x2={86}
                  y2={172}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" stopOpacity="0.09" />
                  <stop offset={1} stopColor="#C4C4C4" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

interface PricingFeatureProps {
  children: React.ReactNode;
}

const PricingFeature = ({ children }: PricingFeatureProps) => {
  return (
    <li className="flex items-center gap-3 text-base text-gray-600">
      <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
};