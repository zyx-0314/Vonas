/**
 * Component: components/UserDropdown.tsx
 * Purpose: User avatar dropdown with logout functionality.
 * Props: None (uses auth context)
 * Features:
 *   - User avatar/initial
 *   - User name and email display
 *   - Logout functionality
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      return name
        .trim()
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center bg-sandy-yellow hover:bg-sandy-yellow/90 rounded-full focus:outline-none focus:ring-2 focus:ring-sandy-yellow focus:ring-offset-2 w-10 h-10 font-freight-neo-pro font-semibold text-ebony-clay transition-colors"
      >
        {getInitials(user.name, user.email)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="right-0 z-50 absolute bg-whitesmoke shadow-lg mt-2 py-2 border border-ebony-clay/10 rounded-lg w-64">
          {/* User Info */}
          <div className="px-4 py-3 border-ebony-clay/10 border-b">
            <div className="font-freight-neo-pro font-medium text-ebony-clay text-sm">
              {user.name || 'User'}
            </div>
            <div className="font-freight-neo-pro text-ebony-clay/70 text-xs">
              {user.email}
            </div>
            {user.isAdmin && (
              <div className="inline-block bg-sandy-yellow/20 mt-1 px-2 py-1 rounded text-ebony-clay text-xs">
                Admin
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="block hover:bg-ebony-clay/5 px-4 py-2 w-full font-freight-neo-pro text-ebony-clay text-sm text-left transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}