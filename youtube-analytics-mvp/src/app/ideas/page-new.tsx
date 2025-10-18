/**
 * Page: /ideas
 * Purpose: Ideas and suggestions management page with notepad capabilities and database integration.
 * Features:
 *   - Split layout: 2/3 notepad, 1/3 ideas list
 *   - Markdown support for both notes and ideas
 *   - Priority management, tags, filtering, sorting, searching
 *   - Database persistence via API
 *   - Real-time CRUD operations
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { useIdeas, type Idea, type CreateIdeaData, type IdeaFilters } from '@/lib/hooks/useIdeas';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Tag, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown,
  Save,
  FileText,
  Lightbulb,
  SortAsc,
  SortDesc,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';

const PRIORITY_CONFIG = {
  LOW: { color: 'bg-gray-500', label: 'Low', textColor: 'text-gray-700' },
  MEDIUM: { color: 'bg-blue-500', label: 'Medium', textColor: 'text-blue-700' },
  HIGH: { color: 'bg-orange-500', label: 'High', textColor: 'text-orange-700' },
  URGENT: { color: 'bg-red-500', label: 'Urgent', textColor: 'text-red-700' }
};

const STATUS_CONFIG = {
  ACTIVE: { color: 'bg-green-500', label: 'Active', icon: CheckCircle, textColor: 'text-green-700' },
  COMPLETED: { color: 'bg-blue-500', label: 'Completed', icon: CheckCircle, textColor: 'text-blue-700' },
  ARCHIVED: { color: 'bg-gray-500', label: 'Archived', icon: Archive, textColor: 'text-gray-700' },
  DELETED: { color: 'bg-red-500', label: 'Deleted', icon: Trash2, textColor: 'text-red-700' }
};

interface NewIdeaForm {
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  tags: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';
}

export default function IdeasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Notepad state (separate from ideas)
  const [notepadContent, setNotepadContent] = useState('# My Notes\\n\\nStart writing your ideas here...');
  
  // Ideas API integration
  const {
    ideas,
    pagination,
    loading: ideasLoading,
    error: ideasError,
    filters,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    batchOperation,
    setFilters,
    clearError
  } = useIdeas({
    status: 'ACTIVE',
    sortBy: 'position',
    sortOrder: 'asc',
    limit: 50
  });

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'position' | 'priority' | 'title'>('position');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>([]);
  
  // New idea form
  const [newIdea, setNewIdea] = useState<NewIdeaForm>({
    title: '',
    content: '',
    priority: 'MEDIUM',
    tags: [],
    status: 'ACTIVE'
  });

  // Load notepad from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotepad = localStorage.getItem('youtube-analytics-notepad');
      if (savedNotepad) {
        setNotepadContent(savedNotepad);
      }
    }
  }, []);

  // Save notepad to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtube-analytics-notepad', notepadContent);
    }
  }, [notepadContent]);

  // Update filters when local state changes
  useEffect(() => {
    const newFilters: IdeaFilters = {
      ...(selectedStatus && { status: selectedStatus as any }),
      ...(selectedPriority && { priority: selectedPriority as any }),
      ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
      ...(searchQuery && { search: searchQuery }),
      sortBy,
      sortOrder,
      page: 1
    };
    
    setFilters(newFilters);
  }, [searchQuery, selectedPriority, selectedStatus, selectedTags, sortBy, sortOrder, setFilters]);

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

  // Helper functions
  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    ideas.forEach(idea => idea.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [ideas]);

  const handleCreateIdea = async () => {
    if (!newIdea.title.trim() || !newIdea.content.trim()) {
      return;
    }

    const ideaData: CreateIdeaData = {
      title: newIdea.title.trim(),
      content: newIdea.content.trim(),
      priority: newIdea.priority,
      status: newIdea.status,
      tags: newIdea.tags
    };

    const created = await createIdea(ideaData);
    if (created) {
      setNewIdea({
        title: '',
        content: '',
        priority: 'MEDIUM',
        tags: [],
        status: 'ACTIVE'
      });
      setShowNewIdeaForm(false);
    }
  };

  const handleUpdateIdea = async (idea: Idea) => {
    if (!editingIdea) return;

    const updated = await updateIdea(idea.id, {
      title: editingIdea.title,
      content: editingIdea.content,
      priority: editingIdea.priority,
      status: editingIdea.status,
      tags: editingIdea.tags
    });

    if (updated) {
      setEditingIdea(null);
    }
  };

  const handleDeleteIdea = async (id: string, hardDelete: boolean = false) => {
    if (window.confirm(hardDelete ? 'Permanently delete this idea?' : 'Move this idea to trash?')) {
      await deleteIdea(id, hardDelete);
    }
  };

  const handleBatchOperation = async (operation: 'delete' | 'archive' | 'activate' | 'complete') => {
    if (selectedIdeas.length === 0) return;
    
    const operationName = {
      delete: 'move to trash',
      archive: 'archive',
      activate: 'activate',
      complete: 'mark as completed'
    }[operation];

    if (window.confirm(`${operationName} ${selectedIdeas.length} selected ideas?`)) {
      const success = await batchOperation(operation, selectedIdeas);
      if (success) {
        setSelectedIdeas([]);
      }
    }
  };

  const addTagToNewIdea = (tag: string) => {
    if (!newIdea.tags.includes(tag)) {
      setNewIdea(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTagFromNewIdea = (tag: string) => {
    setNewIdea(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const PriorityBadge = ({ priority }: { priority: keyof typeof PRIORITY_CONFIG }) => {
    const config = PRIORITY_CONFIG[priority];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} text-white`}>
        {config.label}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: keyof typeof STATUS_CONFIG }) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.textColor} bg-opacity-10 ${config.color.replace('bg-', 'bg-')}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const IdeaCard = ({ idea }: { idea: Idea }) => (
    <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
      selectedIdeas.includes(idea.id) ? 'ring-2 ring-sandy-yellow' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={selectedIdeas.includes(idea.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIdeas(prev => [...prev, idea.id]);
                } else {
                  setSelectedIdeas(prev => prev.filter(id => id !== idea.id));
                }
              }}
              className="rounded"
            />
            <h3 className="font-medium text-ebony-clay text-sm">{idea.title}</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <PriorityBadge priority={idea.priority} />
            <StatusBadge status={idea.status} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditingIdea(idea)}
            className="p-1 text-gray-400 hover:text-sandy-yellow transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteIdea(idea.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="mb-3 text-gray-600 text-sm line-clamp-3">
        {idea.content.length > 100 ? `${idea.content.substring(0, 100)}...` : idea.content}
      </p>
      
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {idea.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-gray-700 text-xs"
            >
              <Tag className="mr-1 w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-gray-500 text-xs">
        Created: {new Date(idea.createdAt).toLocaleDateString()}
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
                Ideas & Notes
              </h1>
              <p className="mt-2 text-gray-600">
                Capture your creative ideas and organize your thoughts
              </p>
            </div>
            
            <button
              onClick={() => setShowNewIdeaForm(true)}
              className="flex items-center gap-2 bg-sandy-yellow hover:bg-sandy-yellow/90 px-4 py-2 rounded-lg font-medium text-ebony-clay transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Idea
            </button>
          </div>

          {/* Error Display */}
          {ideasError && (
            <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error: {ideasError}</span>
                <button
                  onClick={clearError}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Main Content - Split Layout */}
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            {/* Notepad Section - Takes 2/3 of the space */}
            <div className="lg:col-span-2 bg-white p-6 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sandy-yellow" />
                  <h2 className="font-semibold text-ebony-clay text-lg">Notepad</h2>
                </div>
                <div className="text-gray-500 text-sm">
                  Auto-saved locally
                </div>
              </div>
              
              <textarea
                value={notepadContent}
                onChange={(e) => setNotepadContent(e.target.value)}
                className="p-4 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full h-[500px] resize-none"
                placeholder="Start writing your notes here... Supports Markdown!"
              />
              
              <div className="mt-4 text-gray-500 text-sm">
                <strong>Tip:</strong> This notepad supports Markdown syntax. Use # for headers, **bold**, *italic*, etc.
              </div>
            </div>

            {/* Ideas Section - Takes 1/3 of the space */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-sandy-yellow" />
                  <h2 className="font-semibold text-ebony-clay text-lg">Ideas</h2>
                </div>
                {pagination && (
                  <div className="text-gray-500 text-sm">
                    {pagination.totalCount} total
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-2 pr-4 pl-10 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 text-sm"
                  >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 text-sm"
                  >
                    <option value="position">Position</option>
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="hover:bg-gray-50 p-2 border border-gray-200 rounded-lg transition-colors"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Batch Actions */}
              {selectedIdeas.length > 0 && (
                <div className="bg-sandy-yellow/10 mb-4 p-3 rounded-lg">
                  <div className="mb-2 font-medium text-ebony-clay text-sm">
                    {selectedIdeas.length} selected
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBatchOperation('complete')}
                      className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white text-xs transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleBatchOperation('archive')}
                      className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded text-white text-xs transition-colors"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => handleBatchOperation('delete')}
                      className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Ideas List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {ideasLoading ? (
                  <div className="py-8 text-gray-500 text-center">Loading ideas...</div>
                ) : ideas.length > 0 ? (
                  ideas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))
                ) : (
                  <div className="py-8 text-gray-500 text-center">
                    No ideas found. Create your first idea!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Idea Modal */}
      {showNewIdeaForm && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-ebony-clay text-lg">Create New Idea</h3>
                <button
                  onClick={() => setShowNewIdeaForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    placeholder="Enter idea title..."
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Content
                  </label>
                  <textarea
                    value={newIdea.content}
                    onChange={(e) => setNewIdea(prev => ({ ...prev, content: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    rows={6}
                    placeholder="Describe your idea..."
                  />
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Priority
                    </label>
                    <select
                      value={newIdea.priority}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Status
                    </label>
                    <select
                      value={newIdea.status}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, status: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newIdea.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-sandy-yellow px-2 py-1 rounded-full text-ebony-clay text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => removeTagFromNewIdea(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const tag = e.currentTarget.value.trim();
                        if (tag) {
                          addTagToNewIdea(tag);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewIdeaForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateIdea}
                  disabled={!newIdea.title.trim() || !newIdea.content.trim()}
                  className="bg-sandy-yellow hover:bg-sandy-yellow/90 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-ebony-clay transition-colors"
                >
                  Create Idea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Idea Modal */}
      {editingIdea && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-ebony-clay text-lg">Edit Idea</h3>
                <button
                  onClick={() => setEditingIdea(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingIdea.title}
                    onChange={(e) => setEditingIdea(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Content
                  </label>
                  <textarea
                    value={editingIdea.content}
                    onChange={(e) => setEditingIdea(prev => prev ? { ...prev, content: e.target.value } : null)}
                    className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    rows={6}
                  />
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Priority
                    </label>
                    <select
                      value={editingIdea.priority}
                      onChange={(e) => setEditingIdea(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                      className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Status
                    </label>
                    <select
                      value={editingIdea.status}
                      onChange={(e) => setEditingIdea(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                      className="px-3 py-2 border border-gray-200 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow/20 w-full"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingIdea(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateIdea(editingIdea)}
                  className="bg-sandy-yellow hover:bg-sandy-yellow/90 px-4 py-2 rounded-lg font-medium text-ebony-clay transition-colors"
                >
                  Update Idea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}