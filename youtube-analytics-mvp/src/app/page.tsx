import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function Home() {
  return (
    <div className="flex flex-col bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 font-orbi font-bold text-ebony-clay text-5xl md:text-6xl">
              YouTube Analytics
            </h1>
            <h2 className="mb-8 font-orbi font-semibold text-sandy-yellow text-2xl md:text-3xl">
              MVP Dashboard
            </h2>
            <p className="mx-auto mb-12 max-w-3xl font-freight-neo-pro text-ebony-clay/80 text-xl">
              A minimal techno design for comprehensive YouTube analytics visualization. 
              Track your channel performance with clean, modern interfaces and powerful insights.
            </p>
            <div className="flex sm:flex-row flex-col justify-center gap-4">
              <Button variant="primary">Get Started</Button>
              <Button variant="secondary">View Design System</Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card title="Analytics Dashboard">
              <p className="mb-4 text-ebony-clay/70">
                Comprehensive overview of your YouTube channel performance with real-time metrics and insights.
              </p>
              <div className="text-ebony-clay/60 text-sm">
                • View counts and trends<br/>
                • Subscriber analytics<br/>
                • Watch time metrics
              </div>
            </Card>

            <Card title="Minimal Design">
              <p className="mb-4 text-ebony-clay/70">
                Clean, techno-inspired interface focused on functionality and user experience.
              </p>
              <div className="text-ebony-clay/60 text-sm">
                • Orbi typography for headers<br/>
                • Freight Neo Pro for body text<br/>
                • Sandy yellow & ebony clay palette
              </div>
            </Card>

            <Card title="Performance Tracking">
              <p className="mb-4 text-ebony-clay/70">
                Monitor your channel&apos;s growth with detailed performance metrics and visualizations.
              </p>
              <div className="text-ebony-clay/60 text-sm">
                • Growth tracking<br/>
                • Engagement metrics<br/>
                • Revenue insights
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-ebony-clay p-12 rounded-2xl text-center">
            <h3 className="mb-4 font-orbi font-bold text-whitesmoke text-3xl">
              Ready to Analyze Your Channel?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl font-freight-neo-pro text-whitesmoke/80 text-lg">
              Connect your YouTube account and start tracking your performance with our minimal, 
              techno-inspired analytics dashboard.
            </p>
            <Button variant="primary">Connect YouTube Account</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
