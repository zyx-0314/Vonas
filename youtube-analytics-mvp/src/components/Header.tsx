/**
 * Component: components/Header.tsx
 * Purpose: Main navigation header with project name and user authentication.
 * Props: None
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserDropdown } from './UserDropdown';
import { Button } from './Button';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-whitesmoke border-ebony-clay/10 border-b w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Project Name */}
          <div className="flex items-center">
            <Link href="/" className="font-orbi font-semibold text-ebony-clay hover:text-ebony-clay/80 text-xl transition-colors">
              YouTube Analytics MVP
            </Link>
          </div>

          {/* Navigation & Authentication Area */}
          <div className="flex items-center gap-6">
            {/* Navigation Menu (only show when authenticated) */}
            {user && (
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/dashboard" 
                  className="font-medium text-ebony-clay hover:text-sandy-yellow transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/content" 
                  className="font-medium text-ebony-clay hover:text-sandy-yellow transition-colors"
                >
                  Content Analysis
                </Link>
              </nav>
            )}

            {/* Authentication */}
            {loading ? (
              <div className="text-ebony-clay/60 text-sm">Loading...</div>
            ) : user ? (
              <UserDropdown />
            ) : (
              <Link href="/login">
                <Button variant="primary">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}