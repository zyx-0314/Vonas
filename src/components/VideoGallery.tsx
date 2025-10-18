import React, { useState } from 'react';
import { Play, Clock, Eye, ThumbsUp, Tag, MessageSquare, X } from 'lucide-react';
import { Video } from '../types/video';

interface VideoGalleryProps {
  videos: Video[];
  filters: any;
}

export function VideoGallery({ videos, filters }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPerformance = filters.performance === 'all' || video.performance === filters.performance;
    const matchesSource = filters.source === 'all' || 
      (filters.source === 'own' && !video.isCompetitor) ||
      (filters.source === 'competitor' && video.isCompetitor);
    
    return matchesSearch && matchesPerformance && matchesSource;
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="aspect-video bg-gray-100 relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-12 w-12" />
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-2">{video.title}</h3>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {(video.views / 1000).toFixed(1)}K
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {video.engagement}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Details Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Video Details</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedVideo.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="font-medium text-gray-900">{(selectedVideo.views / 1000).toFixed(1)}K</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="font-medium text-gray-900">{selectedVideo.engagement}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{selectedVideo.duration}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-line">{selectedVideo.description}</p>
                </div>

                {selectedVideo.transcript && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <p className="text-gray-600 whitespace-pre-line">{selectedVideo.transcript}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Performance Insights</h4>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <ul className="space-y-2 text-green-800">
                      {selectedVideo.insights?.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}