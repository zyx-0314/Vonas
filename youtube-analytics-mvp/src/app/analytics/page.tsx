/**
 * Page: /analytics
 * Purpose: Detailed analytics breakdown for Views, Subscribers, Watch Time, and Revenue.
 * Features:
 *   - Demographics analysis (age, location, devices)
 *   - Time-based analytics
 *   - Content performance breakdown
 *   - Revenue sources and patterns
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { 
  Eye, 
  Users, 
  Clock, 
  DollarSign, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Calendar,
  TrendingUp,
  Globe,
  Play,
  BarChart3
} from 'lucide-react';

// Sample analytics data - in production this would come from APIs
const analyticsData = {
  views: {
    total: 524000,
    sources: [
      { name: 'YouTube Search', value: 35, count: 183400 },
      { name: 'Suggested Videos', value: 28, count: 146720 },
      { name: 'Browse Features', value: 15, count: 78600 },
      { name: 'External', value: 12, count: 62880 },
      { name: 'Direct/Unknown', value: 10, count: 52400 }
    ],
    age_groups: [
      { range: '18-24', percentage: 25, count: 131000 },
      { range: '25-34', percentage: 35, count: 183400 },
      { range: '35-44', percentage: 22, count: 115280 },
      { range: '45-54', percentage: 12, count: 62880 },
      { range: '55+', percentage: 6, count: 31440 }
    ],
    devices: [
      { type: 'Mobile', percentage: 45, count: 235800 },
      { type: 'Desktop', percentage: 35, count: 183400 },
      { type: 'Tablet', percentage: 12, count: 62880 },
      { type: 'TV', percentage: 8, count: 41920 }
    ],
    locations: [
      { country: 'United States', percentage: 40, count: 209600 },
      { country: 'United Kingdom', percentage: 15, count: 78600 },
      { country: 'Canada', percentage: 12, count: 62880 },
      { country: 'Australia', percentage: 8, count: 41920 },
      { country: 'Germany', percentage: 7, count: 36680 },
      { country: 'Others', percentage: 18, count: 94320 }
    ]
  },
  subscribers: {
    total: 13800,
    timeline: [
      { period: 'Last 7 days', gained: 245, lost: 12 },
      { period: 'Last 30 days', gained: 1200, lost: 45 },
      { period: 'Last 90 days', gained: 3500, lost: 120 }
    ],
    content_sources: [
      { content: 'React Tutorial Series', subscribers: 2400 },
      { content: 'JavaScript Tips', subscribers: 1800 },
      { content: 'Web Development Guide', subscribers: 1200 },
      { content: 'Performance Optimization', subscribers: 900 },
      { content: 'Other Videos', subscribers: 7500 }
    ],
    demographics: [
      { range: '18-24', percentage: 22, count: 3036 },
      { range: '25-34', percentage: 42, count: 5796 },
      { range: '35-44', percentage: 24, count: 3312 },
      { range: '45-54', percentage: 8, count: 1104 },
      { range: '55+', percentage: 4, count: 552 }
    ]
  },
  watchTime: {
    total: 965000, // minutes
    locations: [
      { country: 'United States', minutes: 386000, percentage: 40 },
      { country: 'United Kingdom', minutes: 144750, percentage: 15 },
      { country: 'Canada', minutes: 115800, percentage: 12 },
      { country: 'Australia', minutes: 77200, percentage: 8 },
      { country: 'Germany', minutes: 67550, percentage: 7 },
      { country: 'Others', minutes: 173700, percentage: 18 }
    ],
    duration_breakdown: [
      { range: '0-2 minutes', percentage: 25, total_minutes: 48250 },
      { range: '2-5 minutes', percentage: 30, total_minutes: 289500 },
      { range: '5-10 minutes', percentage: 28, total_minutes: 542800 },
      { range: '10+ minutes', percentage: 17, total_minutes: 84450 }
    ],
    peak_hours: [
      { hour: '6 AM', minutes: 32000 },
      { hour: '12 PM', minutes: 58000 },
      { hour: '3 PM', minutes: 72000 },
      { hour: '6 PM', minutes: 95000 },
      { hour: '9 PM', minutes: 85000 }
    ]
  },
  revenue: {
    total: 2890,
    sources: [
      { type: 'Ad Revenue', amount: 2312, percentage: 80 },
      { type: 'Channel Memberships', amount: 289, percentage: 10 },
      { type: 'Super Chat/Thanks', amount: 202, percentage: 7 },
      { type: 'YouTube Premium', amount: 87, percentage: 3 }
    ],
    monthly_trend: [
      { month: 'Jan', amount: 2100 },
      { month: 'Feb', amount: 2350 },
      { month: 'Mar', amount: 2890 },
      { month: 'Apr', amount: 2650 },
      { month: 'May', amount: 3100 }
    ],
    top_performing_videos: [
      { title: 'Advanced React Patterns', revenue: 450 },
      { title: 'JavaScript Performance Tips', revenue: 380 },
      { title: 'Web Development Fundamentals', revenue: 320 },
      { title: 'CSS Grid Tutorial', revenue: 290 }
    ]
  }
};

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'subscribers' | 'watchTime' | 'revenue'>('views');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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

  const MetricCard = ({ 
    title, 
    value, 
    icon, 
    isSelected, 
    onClick 
  }: { 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    isSelected: boolean; 
    onClick: () => void; 
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-xl border transition-all ${
        isSelected 
          ? 'bg-sandy-yellow border-sandy-yellow shadow-lg' 
          : 'bg-white border-gray-200 hover:border-sandy-yellow hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${isSelected ? 'bg-ebony-clay text-white' : 'bg-gray-100 text-gray-600'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-ebony-clay">{value}</p>
        </div>
      </div>
    </button>
  );

  const ProgressBar = ({ label, percentage, count }: { label: string; percentage: number; count?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="text-right">
          <span className="text-sm font-semibold text-ebony-clay">{percentage}%</span>
          {count && <span className="text-xs text-gray-500 block">{count.toLocaleString()}</span>}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-sandy-yellow h-2 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => {
    switch (selectedMetric) {
      case 'views':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Traffic Sources</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.views.sources.map((source, index) => (
                  <ProgressBar 
                    key={index} 
                    label={source.name} 
                    percentage={source.value} 
                    count={source.count} 
                  />
                ))}
              </div>
            </div>

            {/* Age Demographics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Age Demographics</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.views.age_groups.map((group, index) => (
                  <ProgressBar 
                    key={index} 
                    label={group.range} 
                    percentage={group.percentage} 
                    count={group.count} 
                  />
                ))}
              </div>
            </div>

            {/* Device Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Device Types</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.views.devices.map((device, index) => (
                  <ProgressBar 
                    key={index} 
                    label={device.type} 
                    percentage={device.percentage} 
                    count={device.count} 
                  />
                ))}
              </div>
            </div>

            {/* Geographic Locations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Top Locations</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.views.locations.map((location, index) => (
                  <ProgressBar 
                    key={index} 
                    label={location.country} 
                    percentage={location.percentage} 
                    count={location.count} 
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'subscribers':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscriber Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Subscriber Growth</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.subscribers.timeline.map((period, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{period.period}</span>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">+{period.gained}</div>
                      <div className="text-red-500 text-sm">-{period.lost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Top Subscriber Sources</h3>
              </div>
              <div className="space-y-3">
                {analyticsData.subscribers.content_sources.map((content, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 flex-1 truncate">{content.content}</span>
                    <span className="font-semibold text-ebony-clay ml-4">{content.subscribers}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriber Demographics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Subscriber Demographics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {analyticsData.subscribers.demographics.map((demo, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-ebony-clay">{demo.percentage}%</div>
                    <div className="text-sm text-gray-600">{demo.range}</div>
                    <div className="text-xs text-gray-500 mt-1">{demo.count.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'watchTime':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Watch Time by Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Watch Time by Location</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.watchTime.locations.map((location, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{location.country}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-ebony-clay">{location.percentage}%</span>
                        <span className="text-xs text-gray-500 block">{(location.minutes / 60).toFixed(0)}h</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-sandy-yellow h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Watch Duration</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.watchTime.duration_breakdown.map((duration, index) => (
                  <ProgressBar 
                    key={index} 
                    label={duration.range} 
                    percentage={duration.percentage} 
                    count={Math.round(duration.total_minutes / 60)} 
                  />
                ))}
              </div>
            </div>

            {/* Peak Viewing Hours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Peak Viewing Hours</h3>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {analyticsData.watchTime.peak_hours.map((hour, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gray-100 rounded-lg p-4 mb-2">
                      <div className="text-lg font-bold text-ebony-clay">{hour.hour}</div>
                      <div className="text-sm text-gray-600">{(hour.minutes / 60).toFixed(0)}h</div>
                    </div>
                    <div 
                      className="bg-sandy-yellow rounded-full mx-auto transition-all duration-500" 
                      style={{ 
                        height: `${(hour.minutes / 95000) * 80}px`,
                        width: '8px',
                        minHeight: '20px'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Revenue Sources</h3>
              </div>
              <div className="space-y-4">
                {analyticsData.revenue.sources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{source.type}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-ebony-clay">{source.percentage}%</span>
                        <span className="text-xs text-gray-500 block">${source.amount}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Monthly Revenue</h3>
              </div>
              <div className="space-y-3">
                {analyticsData.revenue.monthly_trend.map((month, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{month.month}</span>
                    <span className="font-bold text-green-600">${month.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Videos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-sandy-yellow" />
                <h3 className="text-lg font-semibold text-ebony-clay">Top Revenue Generating Videos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData.revenue.top_performing_videos.map((video, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex-1 truncate">{video.title}</span>
                    <span className="font-bold text-green-600 ml-4">${video.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-freight-neo-pro text-3xl font-bold text-ebony-clay">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Detailed breakdown of your channel performance and audience insights
            </p>
          </div>

          {/* Metric Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Views"
              value="524K"
              icon={<Eye className="h-6 w-6" />}
              isSelected={selectedMetric === 'views'}
              onClick={() => setSelectedMetric('views')}
            />
            <MetricCard
              title="Subscribers"
              value="13.8K"
              icon={<Users className="h-6 w-6" />}
              isSelected={selectedMetric === 'subscribers'}
              onClick={() => setSelectedMetric('subscribers')}
            />
            <MetricCard
              title="Watch Time"
              value="965K min"
              icon={<Clock className="h-6 w-6" />}
              isSelected={selectedMetric === 'watchTime'}
              onClick={() => setSelectedMetric('watchTime')}
            />
            <MetricCard
              title="Revenue"
              value="$2,890"
              icon={<DollarSign className="h-6 w-6" />}
              isSelected={selectedMetric === 'revenue'}
              onClick={() => setSelectedMetric('revenue')}
            />
          </div>

          {/* Analytics Content */}
          <div className="min-h-[600px]">
            {renderAnalyticsContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}