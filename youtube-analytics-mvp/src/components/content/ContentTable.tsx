/**
 * Component: components/content/ContentTable.tsx
 * Purpose: Display video content in a table format with performance metrics.
 * Props:
 *   - videos: Video[] (array of video objects)
 *   - filters: FilterObject (search and filter criteria)
 */

'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ExternalLink, Eye, TrendingUp, Calendar, Clock } from 'lucide-react';

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

interface ContentTableProps {
  videos: Video[];
  filters: {
    search: string;
    performance: string;
    source: string;
    dateRange: string;
  };
}

export function ContentTable({ videos, filters }: ContentTableProps) {
  const [sortField, setSortField] = useState<keyof Video>('publishDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort videos
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

    // Sort videos
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [videos, filters, sortField, sortDirection]);

  const handleSort = (field: keyof Video) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceBadge = (performance: string) => {
    const badges = {
      overperforming: 'bg-green-100 text-green-800',
      average: 'bg-yellow-100 text-yellow-800',
      underperforming: 'bg-red-100 text-red-800'
    };
    
    return badges[performance as keyof typeof badges] || badges.average;
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-gray-100 border-b">
        <h3 className="font-semibold text-ebony-clay text-lg">Content Performance</h3>
        <p className="mt-1 text-gray-600 text-sm">
          {filteredVideos.length} videos found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 font-medium text-gray-500 hover:text-ebony-clay text-xs uppercase tracking-wider"
                >
                  Video
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('views')}
                  className="flex items-center gap-2 font-medium text-gray-500 hover:text-ebony-clay text-xs uppercase tracking-wider"
                >
                  Views
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('engagement')}
                  className="flex items-center gap-2 font-medium text-gray-500 hover:text-ebony-clay text-xs uppercase tracking-wider"
                >
                  Engagement
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('performance')}
                  className="flex items-center gap-2 font-medium text-gray-500 hover:text-ebony-clay text-xs uppercase tracking-wider"
                >
                  Performance
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('publishDate')}
                  className="flex items-center gap-2 font-medium text-gray-500 hover:text-ebony-clay text-xs uppercase tracking-wider"
                >
                  Published
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVideos.map((video) => (
              <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="rounded-lg w-20 h-12 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ebony-clay text-sm truncate">
                        {video.title}
                      </p>
                      {video.isCompetitor && (
                        <p className="mt-1 text-gray-500 text-xs">
                          by {video.channel}
                        </p>
                      )}
                      {video.duration && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 text-xs">{video.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-ebony-clay text-sm">
                      {video.views.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-ebony-clay text-sm">
                      {video.engagement}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(video.performance)}`}>
                    {video.performance}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 text-sm">
                      {formatDate(video.publishDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="inline-flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg font-medium text-ebony-clay text-xs transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredVideos.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mb-2 text-gray-400">
            <Eye className="mx-auto w-12 h-12" />
          </div>
          <h3 className="mb-1 font-medium text-gray-900 text-sm">No videos found</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}