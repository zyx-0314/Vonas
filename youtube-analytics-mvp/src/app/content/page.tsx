/**
 * Page: /content
 * Purpose: Content analysis dashboard comparing user's content performance with competitors.
 * Features:
 *   - Performance comparison metrics
 *   - Grid and list view toggles
 *   - Video performance insights
 *   - Competitor tracking
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { TrendingUp, ArrowUp, ArrowDown, LayoutGrid, List, Search, Filter, Plus } from 'lucide-react';
import { ContentTable } from '@/components/content/ContentTable';
import { VideoGallery } from '@/components/content/VideoGallery';
import { TrackCompetitorModal } from '@/components/modals/TrackCompetitorModal';

interface Video {
  id: string;
  title: string;
  views: number;
  engagement: number;
  publishDate: string;
  duration?: string;
  thumbnail: string;
  isCompetitor?: boolean;
  channel?: string;
  performance: 'overperforming' | 'average' | 'underperforming';
  tags?: string[];
  description?: string;
  insights?: string[];
}

interface CompetitorData {
  channelName: string;
  channelUrl: string;
  description?: string;
  tags: string[];
}

const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Ultimate YouTube Analytics Guide 2024',
    views: 524000,
    engagement: 98,
    publishDate: '2024-03-01',
    duration: '18:24',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    performance: 'overperforming',
    tags: ['Analytics', 'YouTube', 'Tutorial', 'Guide'],
    description: 'Complete guide to YouTube analytics and optimization',
    insights: [
      'High engagement in first 5 minutes',
      'Most replayed section: Key metrics explanation',
      'Strong audience retention throughout'
    ]
  },
  {
    id: '2',
    title: 'Content Creation Tips for 2024',
    views: 412000,
    engagement: 95,
    publishDate: '2024-02-28',
    duration: '15:32',
    thumbnail: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?w=800&q=80',
    performance: 'overperforming',
    tags: ['Content', 'Creator Tips', 'Strategy'],
    description: 'Essential tips for successful content creation',
    insights: [
      'Popular among new creators',
      'High share rate',
      'Frequently bookmarked'
    ]
  },
  {
    id: '3',
    title: 'Competitor Analysis Made Easy',
    views: 198000,
    engagement: 87,
    publishDate: '2024-02-15',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    isCompetitor: true,
    channel: 'Analytics Pro',
    performance: 'average',
    tags: ['Competition', 'Analysis', 'Business'],
    description: 'How to analyze your competitors effectively',
    insights: [
      'Steady engagement throughout',
      'Good for business-focused audience'
    ]
  },
  {
    id: '4',
    title: 'Basic Video Editing Tutorial',
    views: 89000,
    engagement: 72,
    publishDate: '2024-02-10',
    duration: '22:18',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    performance: 'underperforming',
    tags: ['Editing', 'Tutorial', 'Beginner'],
    description: 'Learn basic video editing techniques',
    insights: [
      'Lower retention after 10 minutes',
      'Good for beginner audience',
      'Could benefit from better pacing'
    ]
  }
];

export default function ContentAnalysis() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    performance: 'all',
    source: 'all',
    dateRange: 'all'
  });

  // Modal state
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

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

  // Calculate stats from sample data
  const userVideos = sampleVideos.filter(v => !v.isCompetitor);
  const overperformingCount = userVideos.filter(v => v.performance === 'overperforming').length;
  const underperformingCount = userVideos.filter(v => v.performance === 'underperforming').length;
  const avgEngagement = userVideos.reduce((acc, v) => acc + v.engagement, 0) / userVideos.length;
  const performanceChange = avgEngagement > 85 ? '+24.5%' : avgEngagement > 75 ? '+12.3%' : '-5.2%';

  // Modal handlers
  const handleTrackCompetitor = (competitorData: CompetitorData) => {
    // TODO: Integrate with API to save competitor
    console.log('Tracking new competitor:', competitorData);
    
    // For now, show a success message
    // In production, this would make an API call to save the competitor
    alert(`Successfully started tracking ${competitorData.channelName}!`);
  };

  return (
    <div className="bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
            <div>
              <h1 className="font-freight-neo-pro font-bold text-ebony-clay text-3xl">
                Content Analysis
              </h1>
              <p className="mt-2 text-gray-600">
                Compare your content performance with competitors and industry benchmarks
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white p-1 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-sandy-yellow text-ebony-clay' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-sandy-yellow text-ebony-clay' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => setIsTrackModalOpen(true)}
                className="flex items-center gap-2 bg-ebony-clay hover:bg-ebony-clay/90 px-4 py-2 rounded-lg text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Track Competitor
              </button>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-600 text-sm">Content Performance</p>
                  <p className="mt-1 font-bold text-ebony-clay text-2xl">{performanceChange}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  performanceChange.startsWith('+') ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <TrendingUp className={`h-6 w-6 ${
                    performanceChange.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">Compared to industry average</p>
            </div>

            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-600 text-sm">Outperforming Videos</p>
                  <p className="mt-1 font-bold text-ebony-clay text-2xl">{overperformingCount} videos</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <ArrowUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">Above competitor average</p>
            </div>

            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-600 text-sm">Underperforming Videos</p>
                  <p className="mt-1 font-bold text-ebony-clay text-2xl">{underperformingCount} videos</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <ArrowDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">Below competitor average</p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
            <div className="flex sm:flex-row flex-col gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="py-2 pr-4 pl-10 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow w-full"
                />
              </div>

              {/* Performance Filter */}
              <select
                value={filters.performance}
                onChange={(e) => setFilters({ ...filters, performance: e.target.value })}
                className="px-4 py-2 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Performance</option>
                <option value="overperforming">Overperforming</option>
                <option value="average">Average</option>
                <option value="underperforming">Underperforming</option>
              </select>

              {/* Source Filter */}
              <select
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                className="px-4 py-2 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Sources</option>
                <option value="own">My Content</option>
                <option value="competitors">Competitors</option>
              </select>

              {/* Date Range Filter */}
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="px-4 py-2 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
          </div>

          {/* Content View */}
          {viewMode === 'grid' ? (
            <VideoGallery videos={sampleVideos} filters={filters} />
          ) : (
            <ContentTable videos={sampleVideos} filters={filters} />
          )}
        </div>
      </main>

      <Footer />

      {/* Track Competitor Modal */}
      <TrackCompetitorModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onSubmit={handleTrackCompetitor}
      />
    </div>
  );
}