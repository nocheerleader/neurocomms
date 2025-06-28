import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/atoms/LoadingSpinner';
import { PasswordStrength } from '../../components/atoms/PasswordStrength';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, PlayIcon } from '@heroicons/react/24/outline';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');

    const demoEmail = 'demo@tonewise.app';
    const demoPassword = 'demopassword123';

    // First try to sign in with demo credentials
    const { error: signInError } = await signIn(demoEmail, demoPassword);
    
    if (!signInError) {
      // Successful login, redirect to main app
      window.location.href = '/';
      setDemoLoading(false);
      return;
    }

    // If sign in failed, try to create the demo account first
    if (signInError.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await signUp(demoEmail, demoPassword);
      
      if (signUpError) {
        // If signup also fails, show error
        setError('Demo setup failed. Please try creating a regular account.');
        setDemoLoading(false);
        return;
      }

      // Account created, now try to sign in again
      const { error: secondSignInError } = await signIn(demoEmail, demoPassword);
      
      if (secondSignInError) {
        setError('Demo login failed after account creation. Please try creating a regular account.');
      } else {
        // Successful demo login
        window.location.href = '/';
      }
    } else {
      // Some other error occurred
      setError('Demo login failed. Please try creating a regular account.');
    }
    
    setDemoLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Account created successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Please check your email to verify your account. You may need to check your spam folder.
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800"
            >
              Continue to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div>



              
              <h1 className="text-2xl font-bold font-funnel text-foreground">ToneWise</h1>
              <p className="text-sm text-muted-foreground">Professional Communication Tool</p>
            </div>
          </div>
          <h2 className="text-center text-3xl font-bold font-funnel text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join ToneWise and start communicating with confidence.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-lg shadow-sm placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 border border-border rounded-lg shadow-sm placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>
          </div>

          

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Create account'}
            </button>
          </div>

          {/* Demo Bypass Button for Hackathon Judges */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">For Hackathon Judges</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-chart-2 text-sm font-medium rounded-lg text-chart-2 bg-chart-2/10 hover:bg-chart-2/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chart-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {demoLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Continue as Demo User
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              Demo account with pre-populated data for evaluation purposes
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}