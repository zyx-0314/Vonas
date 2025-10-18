/**
 * Component: components/content/VideoGallery.tsx
 * Purpose: Display video content in a grid gallery format with thumbnails.
 * Props:
 *   - videos: Video[] (array of video objects)
 *   - filters: FilterObject (search and filter criteria)
 */

'use client';

import React, { useMemo } from 'react';
import { Eye, TrendingUp, Calendar, Clock, ExternalLink, Play } from 'lucide-react';

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

interface VideoGalleryProps {
  videos: Video[];
  filters: {
    search: string;
    performance: string;
    source: string;
    dateRange: string;
  };
}

export function VideoGallery({ videos, filters }: VideoGalleryProps) {
  // Filter videos based on current filters
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Apply performance filter
    if (filters.performance !== 'all') {
      filtered = filtered.filter(video => video.performance === filters.performance);
    }

    // Apply source filter
    if (filters.source !== 'all') {
      if (filters.source === 'own') {
        filtered = filtered.filter(video => !video.isCompetitor);
      } else if (filters.source === 'competitors') {
        filtered = filtered.filter(video => video.isCompetitor);
      }
    }

    // Apply date filter (simplified)
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(video => 
        new Date(video.publishDate) >= cutoffDate
      );
    }

    return filtered;
  }, [videos, filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceBadge = (performance: string) => {
    const badges = {
      overperforming: 'bg-green-100 text-green-800 border-green-200',
      average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      underperforming: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return badges[performance as keyof typeof badges] || badges.average;
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'overperforming':
        return <TrendingUp className="w-3 h-3" />;
      case 'underperforming':
        return <TrendingUp className="w-3 h-3 rotate-180" />;
      default:
        return <TrendingUp className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          Showing {filteredVideos.length} of {videos.length} videos
        </p>
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl overflow-hidden transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative bg-gray-100 aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex justify-center items-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 p-3 rounded-full">
                    <Play className="ml-1 w-6 h-6 text-ebony-clay" />
                  </div>
                </div>

                {/* Duration badge */}
                {video.duration && (
                  <div className="right-2 bottom-2 absolute bg-black/80 px-2 py-1 rounded font-medium text-white text-xs">
                    {video.duration}
                  </div>
                )}

                {/* Competitor badge */}
                {video.isCompetitor && (
                  <div className="top-2 left-2 absolute bg-blue-100 px-2 py-1 border border-blue-200 rounded-full font-medium text-blue-800 text-xs">
                    Competitor
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="mb-2 font-medium text-ebony-clay group-hover:text-sandy-yellow text-sm line-clamp-2 transition-colors">
                  {video.title}
                </h3>

                {/* Channel (for competitors) */}
                {video.isCompetitor && video.channel && (
                  <p className="mb-2 text-gray-500 text-xs">by {video.channel}</p>
                )}

                {/* Metrics */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{video.engagement}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(video.publishDate)}</span>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPerformanceBadge(video.performance)}`}>
                    {getPerformanceIcon(video.performance)}
                    {video.performance}
                  </span>
                </div>

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 px-2 py-1 rounded-full text-gray-600 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-gray-600 text-xs">
                        +{video.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Insights Preview */}
                {video.insights && video.insights.length > 0 && (
                  <div className="mb-3">
                    <p className="text-gray-600 text-xs line-clamp-2">
                      💡 {video.insights[0]}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button className="flex justify-center items-center gap-2 bg-gray-50 hover:bg-sandy-yellow px-3 py-2 rounded-lg w-full font-medium text-ebony-clay hover:text-ebony-clay text-xs transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  View Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <Play className="mx-auto w-16 h-16" />
          </div>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">No videos found</h3>
          <p className="mb-6 text-gray-500">
            Try adjusting your search or filter criteria to see more results.
          </p>
          <button className="inline-flex items-center gap-2 bg-ebony-clay hover:bg-ebony-clay/90 px-4 py-2 rounded-lg text-white transition-colors">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}