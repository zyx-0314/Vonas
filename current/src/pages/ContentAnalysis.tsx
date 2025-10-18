import React, { useState } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, LayoutGrid, List } from 'lucide-react';
import { ContentTable } from '../components/ContentTable';
import { VideoGallery } from '../components/VideoGallery';
import { videos } from '../data/videosData';

export function ContentAnalysis() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    performance: 'all',
    source: 'all',
    dateRange: 'all'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Analysis</h2>
          <p className="text-gray-600">Compare your content performance with competitors</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Track New Competitor
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Performance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">+24.5%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Compared to industry average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outperforming Videos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8 videos</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Above competitor average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Underperforming Videos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3 videos</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Below competitor average</p>
        </div>
      </div>

      {/* Content View */}
      {viewMode === 'grid' ? (
        <VideoGallery videos={videos} filters={filters} />
      ) : (
        <ContentTable />
      )}
    </div>
  );
}