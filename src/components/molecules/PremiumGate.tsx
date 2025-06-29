import React from 'react';
import { StarIcon, CheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { useSubscription } from '../../hooks/useSubscription';
import { redirectToCheckout } from '../../services/stripe';
import { products } from '../../stripe-config';

interface PremiumGateProps {
  feature: string;
  description: string;
  benefits: string[];
}

export function PremiumGate({ feature, description, benefits }: PremiumGateProps) {
  const { isTrialing } = useSubscription();
  const [upgrading, setUpgrading] = React.useState(false);

  const handleUpgrade = async () => {
    const premiumProduct = products.find(p => p.name === 'Premium');
    if (!premiumProduct) return;

    try {
      setUpgrading(true);
      await redirectToCheckout({ priceId: premiumProduct.priceId, mode: 'subscription' });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const getButtonText = () => {
    if (upgrading) return <LoadingSpinner />;
    if (isTrialing) return 'Continue with Trial';
    return 'Start 7-Day Free Trial';
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-black/5">
      <div className="p-6 border-b border-black/5 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <LockClosedIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {feature} is a Premium Feature
        </h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <StarIcon className="h-5 w-5 text-primary" />
          What's Included with Premium
        </h4>
        <ul className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          <StarIcon className="h-5 w-5" />
          {getButtonText()}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            7-day free trial • Cancel anytime • No commitment
          </p>
        </div>
      </div>
    </div>
  );
}