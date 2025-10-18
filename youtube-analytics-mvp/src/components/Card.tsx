/**
 * Component: components/Card.tsx
 * Purpose: Reusable card component with minimal techno design.
 * Props:
 *   - title?: string
 *   - children: React.ReactNode
 *   - className?: string
 */

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-whitesmoke border border-ebony-clay/20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${className}`}>
      {title && (
        <h3 className="mb-4 font-orbi font-semibold text-ebony-clay text-lg">
          {title}
        </h3>
      )}
      <div className="font-freight-neo-pro text-ebony-clay">
        {children}
      </div>
    </div>
  );
}