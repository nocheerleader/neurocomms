import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  
  const getStrengthText = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return 'Very Weak';
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {getStrengthText()}
        </span>
      </div>
      <div className="text-xs text-gray-600">
        <p>Password should contain:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li className={password.length >= 8 ? 'text-green-600' : ''}>
            At least 8 characters
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
            Lowercase letter
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
            Uppercase letter
          </li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
            Number
          </li>
          <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>
            Special character
          </li>
        </ul>
      </div>
    </div>
  );
}