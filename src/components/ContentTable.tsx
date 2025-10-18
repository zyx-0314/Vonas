import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ExternalLink } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  views: number;
  engagement: number;
  publishDate: string;
  isCompetitor?: boolean;
  channel?: string;
  performance: 'overperforming' | 'average' | 'underperforming';
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Advanced React Patterns 2024',
    views: 524000,
    engagement: 98,
    publishDate: '2024-03-01',
    performance: 'overperforming'
  },
  {
    id: '2',
    title: 'React Performance Tips',
    views: 412000,
    engagement: 95,
    publishDate: '2024-02-28',
    isCompetitor: true,
    channel: 'ReactMaster',
    performance: 'overperforming'
  },
  {
    id: '3',
    title: 'Web Development Roadmap',
    views: 380000,
    engagement: 92,
    publishDate: '2024-02-25',
    performance: 'average'
  },
  {
    id: '4',
    title: 'React vs Vue 2024',
    views: 350000,
    engagement: 88,
    publishDate: '2024-02-20',
    isCompetitor: true,
    channel: 'WebDevPro',
    performance: 'average'
  }
];

export function ContentTable() {
  const [filters, setFilters] = useState({
    search: '',
    performance: 'all',
    source: 'all',
    dateRange: 'all'
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'views',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPerformance = filters.performance === 'all' || video.performance === filters.performance;
    const matchesSource = filters.source === 'all' || 
      (filters.source === 'own' && !video.isCompetitor) ||
      (filters.source === 'competitor' && video.isCompetitor);
    
    return matchesSearch && matchesPerformance && matchesSource;
  }).sort((a, b) => {
    const multiplier = sortConfig.direction === 'desc' ? -1 : 1;
    return multiplier * ((a as any)[sortConfig.key] - (b as any)[sortConfig.key]);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Filters */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={filters.performance}
            onChange={(e) => setFilters({ ...filters, performance: e.target.value })}
          >
            <option value="all">All Performance</option>
            <option value="overperforming">Overperforming</option>
            <option value="average">Average</option>
            <option value="underperforming">Underperforming</option>
          </select>

          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          >
            <option value="all">All Sources</option>
            <option value="own">Your Content</option>
            <option value="competitor">Competitor Content</option>
          </select>

          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left p-4 font-medium text-gray-600">Title</th>
              <th className="p-4 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort('views')}>
                <div className="flex items-center justify-end gap-2">
                  Views
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="p-4 font-medium text-gray-600 cursor-pointer" onClick={() => handleSort('engagement')}>
                <div className="flex items-center justify-end gap-2">
                  Engagement
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="p-4 font-medium text-gray-600">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVideos.map((video) => (
              <tr key={video.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {video.title}
                      {video.isCompetitor && (
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    {video.isCompetitor && (
                      <div className="text-sm text-gray-500">{video.channel}</div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">{(video.views / 1000).toFixed(1)}K</td>
                <td className="p-4 text-right">{video.engagement}%</td>
                <td className="p-4">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${video.performance === 'overperforming' ? 'bg-green-100 text-green-800' :
                      video.performance === 'average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {video.performance}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}