/**
 * Page: /comments
 * Purpose: Comments management dashboard for viewing and managing all video comments.
 * Features:
 *   - Display all comments across videos
 *   - Filter by video, sentiment, date range
 *   - Reply to comments
 *   - Moderate comments (approve/hide/delete)
 *   - Export comments data
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { 
  MessageCircle, 
  Reply, 
  Heart, 
  Eye, 
  Filter, 
  Search, 
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Trash2,
  Download,
  PlayCircle,
  Clock,
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Comment {
  id: string;
  videoId: string;
  videoTitle: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'approved' | 'pending' | 'hidden';
  isReply?: boolean;
  parentId?: string;
}

interface VideoComment {
  videoId: string;
  videoTitle: string;
  thumbnail: string;
  totalComments: number;
  recentComments: Comment[];
}

// Sample comments data - in production this would come from YouTube API
const sampleComments: Comment[] = [
  {
    id: '1',
    videoId: 'video-1',
    videoTitle: 'Ultimate YouTube Analytics Guide 2024',
    author: 'John Developer',
    content: 'This is exactly what I needed! The analytics breakdown is super helpful. Thanks for making such detailed content.',
    timestamp: '2024-03-15T10:30:00Z',
    likes: 25,
    replies: 3,
    sentiment: 'positive',
    status: 'approved'
  },
  {
    id: '2',
    videoId: 'video-1',
    videoTitle: 'Ultimate YouTube Analytics Guide 2024',
    author: 'Sarah Analytics',
    content: 'Great tutorial! Could you do a follow-up on advanced analytics features?',
    timestamp: '2024-03-15T11:45:00Z',
    likes: 12,
    replies: 1,
    sentiment: 'positive',
    status: 'approved'
  },
  {
    id: '3',
    videoId: 'video-2',
    videoTitle: 'Content Creation Tips for 2024',
    author: 'Mike Creator',
    content: 'Some good points, but I think you missed talking about SEO optimization for thumbnails.',
    timestamp: '2024-03-14T14:20:00Z',
    likes: 8,
    replies: 0,
    sentiment: 'neutral',
    status: 'approved'
  },
  {
    id: '4',
    videoId: 'video-2',
    videoTitle: 'Content Creation Tips for 2024',
    author: 'TechReviewer99',
    content: 'Not sure about this approach. I\'ve tried similar methods and didn\'t see much improvement.',
    timestamp: '2024-03-14T16:30:00Z',
    likes: 2,
    replies: 5,
    sentiment: 'negative',
    status: 'pending'
  },
  {
    id: '5',
    videoId: 'video-1',
    videoTitle: 'Ultimate YouTube Analytics Guide 2024',
    author: 'Analytics Pro',
    content: 'Fantastic breakdown of the metrics! This helped me understand my channel performance much better.',
    timestamp: '2024-03-13T09:15:00Z',
    likes: 35,
    replies: 2,
    sentiment: 'positive',
    status: 'approved'
  }
];

const videoComments: VideoComment[] = [
  {
    videoId: 'video-1',
    videoTitle: 'Ultimate YouTube Analytics Guide 2024',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    totalComments: 45,
    recentComments: sampleComments.filter(c => c.videoId === 'video-1')
  },
  {
    videoId: 'video-2',
    videoTitle: 'Content Creation Tips for 2024',
    thumbnail: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?w=800&q=80',
    totalComments: 32,
    recentComments: sampleComments.filter(c => c.videoId === 'video-2')
  }
];

export default function CommentsManagement() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [filteredComments, setFilteredComments] = useState<Comment[]>(sampleComments);
  const [viewMode, setViewMode] = useState<'all' | 'by-video'>('all');
  const [filters, setFilters] = useState({
    search: '',
    video: 'all',
    sentiment: 'all',
    status: 'all',
    dateRange: 'all'
  });
  
  // Get video ID from URL params if navigating from video
  const selectedVideoId = searchParams?.get('videoId');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Filter comments based on current filters
  useEffect(() => {
    let filtered = comments;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(comment =>
        comment.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        comment.author.toLowerCase().includes(filters.search.toLowerCase()) ||
        comment.videoTitle.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply video filter
    if (filters.video !== 'all') {
      filtered = filtered.filter(comment => comment.videoId === filters.video);
    }

    // Apply sentiment filter
    if (filters.sentiment !== 'all') {
      filtered = filtered.filter(comment => comment.sentiment === filters.sentiment);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(comment => comment.status === filters.status);
    }

    // Apply date filter (simplified)
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(comment => 
        new Date(comment.timestamp) >= cutoffDate
      );
    }

    setFilteredComments(filtered);
  }, [comments, filters]);

  // Set initial video filter if coming from video page
  useEffect(() => {
    if (selectedVideoId) {
      setFilters(prev => ({ ...prev, video: selectedVideoId }));
      setViewMode('by-video');
    }
  }, [selectedVideoId]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'hidden': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCommentAction = (commentId: string, action: 'approve' | 'hide' | 'delete') => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          switch (action) {
            case 'approve':
              return { ...comment, status: 'approved' as const };
            case 'hide':
              return { ...comment, status: 'hidden' as const };
            case 'delete':
              return null;
            default:
              return comment;
          }
        }
        return comment;
      }).filter(Boolean) as Comment[]
    );
  };

  const CommentCard = ({ comment }: { comment: Comment }) => (
    <div className="bg-white hover:shadow-md p-4 border border-gray-200 rounded-lg transition-shadow">
      {/* Comment Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex justify-center items-center bg-gray-300 rounded-full w-8 h-8">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getSentimentColor(comment.sentiment)}`}>
                {comment.sentiment}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(comment.status)}`}>
                {comment.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock className="w-3 h-3" />
              {formatDate(comment.timestamp)}
            </div>
          </div>
        </div>
        
        {/* Actions Dropdown */}
        <div className="relative">
          <button className="hover:bg-gray-100 p-1 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Video Context */}
      <div className="bg-gray-50 mb-3 p-2 rounded">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700 text-sm truncate">{comment.videoTitle}</span>
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
      </div>

      {/* Comment Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{comment.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Reply className="w-3 h-3" />
            <span>{comment.replies} replies</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {comment.status === 'pending' && (
            <button
              onClick={() => handleCommentAction(comment.id, 'approve')}
              className="hover:bg-green-50 p-1.5 rounded text-green-600"
              title="Approve"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleCommentAction(comment.id, 'hide')}
            className="hover:bg-yellow-50 p-1.5 rounded text-yellow-600"
            title="Hide"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="hover:bg-blue-50 p-1.5 rounded text-blue-600" title="Reply">
            <Reply className="w-4 h-4" />
          </button>
          <button className="hover:bg-red-50 p-1.5 rounded text-red-600" title="Report">
            <Flag className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCommentAction(comment.id, 'delete')}
            className="hover:bg-red-50 p-1.5 rounded text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
            <div>
              <h1 className="font-freight-neo-pro font-bold text-ebony-clay text-3xl">
                Comments Management
              </h1>
              <p className="mt-2 text-gray-600">
                View and manage all comments across your videos
              </p>
            </div>
            
            <div className="flex items-center gap-3">
             
              {/* View Mode Toggle */}
              <div className="flex bg-white p-1 border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    viewMode === 'all' 
                      ? 'bg-sandy-yellow text-ebony-clay' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Comments
                </button>
                <button
                  onClick={() => setViewMode('by-video')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    viewMode === 'by-video' 
                      ? 'bg-sandy-yellow text-ebony-clay' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  By Video
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold text-ebony-clay text-2xl">{comments.length}</div>
                  <div className="text-gray-600 text-sm">Total Comments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-bold text-ebony-clay text-2xl">
                    {comments.filter(c => c.status === 'approved').length}
                  </div>
                  <div className="text-gray-600 text-sm">Approved</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-bold text-ebony-clay text-2xl">
                    {comments.filter(c => c.status === 'pending').length}
                  </div>
                  <div className="text-gray-600 text-sm">Pending</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-bold text-ebony-clay text-2xl">
                    {comments.filter(c => c.sentiment === 'positive').length}
                  </div>
                  <div className="text-gray-600 text-sm">Positive</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="relative">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="Search comments..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="py-2 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow w-full"
                />
              </div>

              {/* Video Filter */}
              <select
                value={filters.video}
                onChange={(e) => setFilters({ ...filters, video: e.target.value })}
                className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Videos</option>
                {videoComments.map(video => (
                  <option key={video.videoId} value={video.videoId}>
                    {video.videoTitle}
                  </option>
                ))}
              </select>

              {/* Sentiment Filter */}
              <select
                value={filters.sentiment}
                onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
                className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>

              {/* Date Range Filter */}
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Comments Display */}
          {viewMode === 'all' ? (
            <div className="space-y-4">
              {filteredComments.length > 0 ? (
                filteredComments.map(comment => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              ) : (
                <div className="py-12 text-center">
                  <MessageCircle className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                  <h3 className="mb-2 font-medium text-gray-900 text-lg">No comments found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {videoComments.map(video => (
                <div key={video.videoId} className="bg-white p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={video.thumbnail} 
                      alt={video.videoTitle}
                      className="rounded w-20 h-12 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-ebony-clay">{video.videoTitle}</h3>
                      <p className="text-gray-600 text-sm">{video.totalComments} comments</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {video.recentComments.map(comment => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}