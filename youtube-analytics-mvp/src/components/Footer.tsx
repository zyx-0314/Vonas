/**
 * Component: components/Footer.tsx
 * Purpose: Footer with mood board button and basic information.
 * Props: None
 */

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ebony-clay w-full text-whitesmoke">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex md:flex-row flex-col justify-between items-center space-y-4 md:space-y-0">
          {/* Footer Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/mood-board" 
              className="font-freight-neo-pro text-sandy-yellow hover:text-whitesmoke decoration-sandy-yellow hover:decoration-whitesmoke underline underline-offset-4 transition-colors duration-200"
            >
              View Mood Board
            </Link>
            <Link 
              href="/about-project" 
              className="font-freight-neo-pro text-whitesmoke/80 hover:text-sandy-yellow transition-colors duration-200"
            >
              About Project
            </Link>
          </div>

          {/* Basic Information */}
          <div className="text-center md:text-right">
            <p className="font-freight-neo-pro text-whitesmoke/80 text-sm">
              © 2025 YouTube Analytics MVP. Built with Next.js & Tailwind CSS.
            </p>
            <p className="mt-1 font-freight-neo-pro text-whitesmoke/60 text-xs">
              A minimal techno design for analytics visualization.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}