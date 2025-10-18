/**
 * Page: /dashboard
 * Purpose: Main YouTube analytics dashboard for authenticated users.
 * Features:
 *   - Metrics cards (Views, Subscribers, Watch Time, Revenue)
 *   - Real-time data from database
 *   - Responsive grid layout
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EngagementDonut } from '@/components/dashboard/EngagementDonut';
import { GeographyMap } from '@/components/dashboard/GeographyMap';
import { useAuth } from '@/lib/auth-context';
import { useAppStore } from '@/store/useAppStore';
import { Eye, Users, Clock, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { metrics, isLoading, error, fetchMetrics } = useAppStore();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch metrics when user is available
  useEffect(() => {
    if (user?.id) {
      fetchMetrics(user.id);
    }
  }, [user, fetchMetrics]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center bg-whitesmoke min-h-screen">
        <div className="font-freight-neo-pro text-ebony-clay">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated (prevent flash)
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="mb-2 font-orbi font-bold text-ebony-clay text-4xl">
              YouTube Analytics
            </h1>
            <p className="font-freight-neo-pro text-ebony-clay/70 text-lg">
              Welcome back, {user.name || user.email}! Here&apos;s your channel performance.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="font-freight-neo-pro text-ebony-clay/60">
                Loading your analytics...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 mb-8 p-4 border border-red-200 rounded-lg">
              <p className="font-freight-neo-pro text-red-700 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Metrics Grid */}
          {metrics && !isLoading && (
            <>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <MetricCard
                  title="Total Views"
                  value={metrics.views.toLocaleString()}
                  change={metrics.changes?.views}
                  positive={metrics.changes?.views?.startsWith('+')}
                  icon={<Eye className="w-6 h-6" />}
                  detailsLink="/analytics"
                />
                
                <MetricCard
                  title="Subscribers"
                  value={metrics.subscribers.toLocaleString()}
                  change={metrics.changes?.subscribers}
                  positive={metrics.changes?.subscribers?.startsWith('+')}
                  icon={<Users className="w-6 h-6" />}
                  detailsLink="/analytics"
                />
                
                <MetricCard
                  title="Watch Time"
                  value={`${Math.round(metrics.watchTime / 60).toLocaleString()}h`}
                  change={metrics.changes?.watchTime}
                  positive={metrics.changes?.watchTime?.startsWith('+')}
                  icon={<Clock className="w-6 h-6" />}
                  detailsLink="/analytics"
                />
                
                <MetricCard
                  title="Revenue"
                  value={`$${metrics.revenue.toLocaleString()}`}
                  change={metrics.changes?.revenue}
                  positive={metrics.changes?.revenue?.startsWith('+')}
                  icon={<DollarSign className="w-6 h-6" />}
                  detailsLink="/analytics"
                />
              </div>

              {/* Additional Analytics Components */}
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-8">
                {/* Engagement Donut Chart */}
                <EngagementDonut
                  likes={8500}
                  comments={1200}
                  shares={650}
                  saves={480}
                />

                {/* Geography Map */}
                <GeographyMap
                  data={[
                    { country: 'United States', code: 'US', views: 209600, percentage: 40.0, growth: '+12.5%' },
                    { country: 'United Kingdom', code: 'GB', views: 78600, percentage: 15.0, growth: '+8.3%' },
                    { country: 'Canada', code: 'CA', views: 62880, percentage: 12.0, growth: '+15.2%' },
                    { country: 'Australia', code: 'AU', views: 41920, percentage: 8.0, growth: '+5.7%' },
                    { country: 'Germany', code: 'DE', views: 36680, percentage: 7.0, growth: '+3.1%' },
                    { country: 'France', code: 'FR', views: 26200, percentage: 5.0, growth: '+9.8%' },
                    { country: 'Japan', code: 'JP', views: 20960, percentage: 4.0, growth: '+18.4%' },
                    { country: 'India', code: 'IN', views: 15720, percentage: 3.0, growth: '+22.1%' },
                    { country: 'Brazil', code: 'BR', views: 13120, percentage: 2.5, growth: '+7.9%' },
                    { country: 'Italy', code: 'IT', views: 10480, percentage: 2.0, growth: '+4.2%' },
                    { country: 'Spain', code: 'ES', views: 7840, percentage: 1.5, growth: '+6.8%' }
                  ]}
                />
              </div>
            </>
          )}

          {/* Empty State */}
          {!metrics && !isLoading && !error && (
            <div className="bg-sandy-yellow/10 p-8 border border-sandy-yellow/20 rounded-lg text-center">
              <h3 className="mb-2 font-orbi font-semibold text-ebony-clay text-lg">
                Welcome to Your Dashboard!
              </h3>
              <p className="font-freight-neo-pro text-ebony-clay/70">
                Your YouTube analytics data will appear here once it&apos;s available.
              </p>
            </div>
          )}

          {/* Last Updated */}
          {metrics && (
            <div className="mt-8 text-center">
              <p className="font-freight-neo-pro text-ebony-clay/60 text-sm">
                Last updated: {new Date(metrics.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}