/**
 * Page: /login
 * Purpose: User login form with email/password authentication.
 * Features:
 *   - Form validation
 *   - JWT authentication
 *   - Redirect after login
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('admin');
    setError('');
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center bg-whitesmoke min-h-screen">
        <div className="text-ebony-clay">Loading...</div>
      </div>
    );
  }

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="flex justify-center items-center bg-whitesmoke min-h-screen px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-orbi font-bold text-ebony-clay text-2xl hover:text-ebony-clay/80 transition-colors">
            YouTube Analytics MVP
          </Link>
          <p className="mt-2 font-freight-neo-pro text-ebony-clay/70">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 font-freight-neo-pro font-medium text-ebony-clay text-sm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-ebony-clay/20 focus:border-sandy-yellow focus:ring-sandy-yellow bg-whitesmoke px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 w-full text-ebony-clay focus:outline-none transition-colors"
                placeholder="admin@gmail.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 font-freight-neo-pro font-medium text-ebony-clay text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-ebony-clay/20 focus:border-sandy-yellow focus:ring-sandy-yellow bg-whitesmoke px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 w-full text-ebony-clay focus:outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Demo Credentials Info */}
            <div className="bg-sandy-yellow/10 border border-sandy-yellow/20 p-3 rounded-lg">
              <div className="flex sm:flex-row flex-col justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-freight-neo-pro text-ebony-clay text-sm">
                    <strong>Demo Credentials:</strong><br />
                    Email: admin@gmail.com<br />
                    Password: admin
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="bg-sandy-yellow hover:bg-sandy-yellow/90 px-3 py-1.5 rounded text-ebony-clay text-sm font-freight-neo-pro font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sandy-yellow focus:ring-offset-1 whitespace-nowrap"
                >
                  Fill Form
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-sandy-yellow hover:bg-sandy-yellow/90 disabled:bg-gray-300 disabled:text-gray-500 px-6 py-2 rounded-lg w-full font-freight-neo-pro font-medium text-ebony-clay transition-colors focus:outline-none focus:ring-2 focus:ring-sandy-yellow focus:ring-offset-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-ebony-clay/10 text-center">
            <Link
              href="/"
              className="font-freight-neo-pro text-ebony-clay/60 hover:text-ebony-clay text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}