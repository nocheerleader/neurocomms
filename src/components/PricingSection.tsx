import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { redirectToCheckout } from '../services/stripe';
import { products } from '../stripe-config';
import { LoadingSpinner } from './atoms/LoadingSpinner';

const PricingSection = () => {
  const { user } = useAuth();
  const { subscription, isPremium } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string) => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }

    try {
      setLoading(priceId);
      await redirectToCheckout({
        priceId,
        mode: 'subscription',
      });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const premiumProduct = products.find(p => p.name === 'Premium');

  const getPremiumButtonText = () => {
    if (loading === premiumProduct?.priceId) {
      return <LoadingSpinner />;
    }
    
    if (isPremium) {
      return "Current Plan";
    }
    
    if (user) {
      return "Upgrade to Premium";
    }
    
    return "Start 7-Day Free Trial";
  };

  const getTrialStatus = () => {
    if (subscription?.subscription_status === 'trialing') {
      return 'Currently on trial';
    }
    return null;
  };

  return (
    <section id="pricing" className="relative z-10 overflow-hidden bg-white pb-12 pt-20 lg:pb-20 lg:pt-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Pricing Plans
              </span>
              <h2 className="mb-4 text-3xl font-bold font-funnel leading-tight text-foreground sm:text-4xl md:text-5xl">
                Choose Your Communication Plan
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
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
              buttonText={user ? "Current Plan" : "Get Started Free"}
              buttonAction={() => !user && (window.location.href = '/signup')}
              disabled={user && !isPremium}
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
              buttonText={getPremiumButtonText()}
              buttonAction={() => premiumProduct && !isPremium && handleUpgrade(premiumProduct.priceId)}
              active={!isPremium}
              disabled={isPremium || loading === premiumProduct?.priceId}
              trialBadge={!user}
              trialStatus={getTrialStatus()}
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
              description="For organizations supporting neurodiverse professionals."
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
  buttonText: React.ReactNode;
  buttonAction: () => void;
  active?: boolean;
  disabled?: boolean;
  trialBadge?: boolean;
  trialStatus?: string | null;
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
  disabled = false,
  trialBadge = false,
  trialStatus = null,
}: PricingCardProps) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className={`relative z-10 mb-10 overflow-hidden rounded-lg border-2 bg-white px-8 py-10 shadow-lg sm:p-12 lg:px-6 lg:py-10 xl:p-12 ${
        active 
          ? 'border-primary shadow-xl' 
          : 'border-border hover:border-border/80'
      }`}>
        {active && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
            Most Popular
          </div>
        )}

        {trialBadge && (
          <div className="absolute top-0 left-0 bg-chart-2 text-primary-foreground px-4 py-1 text-sm font-medium rounded-br-lg">
            7-Day Free Trial
          </div>
        )}
        
        <span className={`mb-3 block text-lg font-semibold ${
          active ? 'text-primary' : 'text-primary'
        }`}>
          {type}
        </span>

        {trialStatus && (
          <div className="mb-3 text-sm text-chart-2 font-medium">
            {trialStatus}
          </div>
        )}
        
        <h2 className="mb-5 text-4xl font-bold text-foreground">
          {price}
          <span className="text-base font-medium text-muted-foreground">
            / {subscription}
          </span>
        </h2>
        
        <p className="mb-8 border-b border-border pb-8 text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <ul className="mb-9 flex flex-col gap-3">{children}</ul>
        
        <button
          onClick={buttonAction}
          disabled={disabled}
          className={`block w-full rounded-full border px-5 py-2 text-center text-sm font-medium transition-all duration-200 hover:shadow-md ${
            disabled
              ? 'border-border bg-secondary text-muted-foreground cursor-not-allowed'
              : active
              ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border-2 border-primary bg-transparent text-primary hover:bg-primary/5'
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
    <li className="flex items-center gap-3 text-base text-muted-foreground">
      <CheckIcon className="h-5 w-5 text-chart-2 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
};