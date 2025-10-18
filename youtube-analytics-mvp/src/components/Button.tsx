/**
 * Component: components/Button.tsx
 * Purpose: Reusable button component with variants.
 * Props:
 *   - variant: 'primary' | 'secondary' | 'disabled'
 *   - children: React.ReactNode
 *   - onClick?: () => void
 *   - disabled?: boolean
 */

'use client';

import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'disabled';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  variant, 
  children, 
  onClick, 
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'px-6 py-2 font-freight-neo-pro font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-sandy-yellow text-ebony-clay hover:bg-sandy-yellow/90 focus:ring-sandy-yellow border border-sandy-yellow',
    secondary: 'bg-transparent text-ebony-clay border border-ebony-clay hover:bg-ebony-clay hover:text-whitesmoke focus:ring-ebony-clay',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
  };

  const isDisabled = disabled || variant === 'disabled';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}