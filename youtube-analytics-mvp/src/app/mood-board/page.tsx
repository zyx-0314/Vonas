/**
 * Page: app/mood-board/page.tsx
 * Purpose: Mood board showcase for design system and components.
 */

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function MoodBoardPage() {
  return (
    <div className="flex flex-col bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-orbi font-bold text-ebony-clay text-4xl">
              Design Mood Board
            </h1>
            <p className="mx-auto max-w-2xl font-freight-neo-pro text-ebony-clay/80 text-lg">
              A minimal techno design system for the YouTube Analytics MVP featuring clean typography, 
              modern components, and a sophisticated color palette.
            </p>
          </div>

          {/* Typography Section */}
          <Card title="Typography" className="mb-8">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-orbi font-bold text-ebony-clay text-2xl">Orbi - Headers</h4>
                <p className="font-freight-neo-pro text-ebony-clay/60">Used for headings and navigation</p>
              </div>
              <div>
                <h4 className="mb-2 font-freight-neo-pro font-medium text-ebony-clay text-lg">Freight Neo Pro - Body</h4>
                <p className="font-freight-neo-pro text-ebony-clay/60">Used for body text and descriptions</p>
              </div>
            </div>
          </Card>

          {/* Color Palette Section */}
          <Card title="Color Palette" className="mb-8">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-sandy-yellow mb-3 border border-ebony-clay/20 rounded-lg w-full h-20"></div>
                <h5 className="font-orbi font-semibold text-ebony-clay">Sandy Yellow</h5>
                <p className="font-freight-neo-pro text-ebony-clay/60 text-sm">#F4D03F (Primary)</p>
              </div>
              <div className="text-center">
                <div className="bg-ebony-clay mb-3 rounded-lg w-full h-20"></div>
                <h5 className="font-orbi font-semibold text-ebony-clay">Ebony Clay</h5>
                <p className="font-freight-neo-pro text-ebony-clay/60 text-sm">#2C3E50 (Dark)</p>
              </div>
              <div className="text-center">
                <div className="bg-whitesmoke mb-3 border border-ebony-clay/20 rounded-lg w-full h-20"></div>
                <h5 className="font-orbi font-semibold text-ebony-clay">Whitesmoke</h5>
                <p className="font-freight-neo-pro text-ebony-clay/60 text-sm">#F5F5F5 (Light)</p>
              </div>
            </div>
          </Card>

          {/* Button Components Section */}
          <Card title="Button Components" className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="disabled">Disabled Button</Button>
            </div>
            <div className="bg-ebony-clay/5 mt-6 p-4 rounded-lg">
              <h5 className="mb-2 font-orbi font-semibold text-ebony-clay">Usage Guidelines:</h5>
              <ul className="space-y-1 font-freight-neo-pro text-ebony-clay/80 text-sm">
                <li>• Primary: Main actions (login, submit, save)</li>
                <li>• Secondary: Alternative actions (cancel, view more)</li>
                <li>• Disabled: Inactive states</li>
              </ul>
            </div>
          </Card>

          {/* Card Component Section */}
          <Card title="Card Component" className="mb-8">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <Card title="Sample Card">
                <p className="text-ebony-clay/80">
                  This is a sample card component showcasing the minimal techno design. 
                  It features clean borders, subtle shadows, and consistent spacing.
                </p>
                <div className="mt-4">
                  <Button variant="primary">Action</Button>
                </div>
              </Card>
              <Card title="Analytics Card">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-ebony-clay/60">Total Views:</span>
                    <span className="font-semibold">1,234,567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ebony-clay/60">Subscribers:</span>
                    <span className="font-semibold">12,345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ebony-clay/60">Watch Time:</span>
                    <span className="font-semibold">98,765 hrs</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          {/* Design Principles */}
          <Card title="Design Principles">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <h5 className="mb-3 font-orbi font-semibold text-ebony-clay">Minimal Techno Aesthetic</h5>
                <ul className="space-y-2 font-freight-neo-pro text-ebony-clay/80 text-sm">
                  <li>• Clean, geometric layouts</li>
                  <li>• Subtle shadows and borders</li>
                  <li>• Consistent spacing system</li>
                  <li>• Focus on functionality</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 font-orbi font-semibold text-ebony-clay">User Experience</h5>
                <ul className="space-y-2 font-freight-neo-pro text-ebony-clay/80 text-sm">
                  <li>• High contrast for readability</li>
                  <li>• Smooth transitions</li>
                  <li>• Accessible color combinations</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}