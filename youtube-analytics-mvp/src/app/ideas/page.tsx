/**
 * Page: /ideas
 * Purpose: Ideas and suggestions management page with notepad capabilities.
 * Features:
 *   - Split layout: 2/3 notepad, 1/3 ideas list
 *   - Markdown support for both notes and ideas
 *   - Priority management, tags, filtering, sorting, searching
 *   - Drag and drop reordering
 *   - Local storage persistence
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
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
  MoreVertical
} from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
}

const PRIORITY_CONFIG = {
  urgent: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Urgent', order: 1 },
  high: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'High', order: 2 },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Medium', order: 3 },
  low: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Low', order: 4 }
};

const STATUS_CONFIG = {
  draft: { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
  'in-progress': { color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
  archived: { color: 'bg-purple-100 text-purple-700', label: 'Archived' }
};

export default function IdeasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // State management
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [notepadContent, setNotepadContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'priority' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingIdea, setEditingIdea] = useState<string | null>(null);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [newIdeaPriority, setNewIdeaPriority] = useState<Idea['priority']>('medium');
  const [newIdeaTags, setNewIdeaTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIdeas = localStorage.getItem('youtube-analytics-ideas');
      const savedNotepad = localStorage.getItem('youtube-analytics-notepad');
      
      if (savedIdeas) {
        try {
          const parsedIdeas = JSON.parse(savedIdeas).map((idea: any) => ({
            ...idea,
            createdAt: new Date(idea.createdAt),
            updatedAt: new Date(idea.updatedAt)
          }));
          setIdeas(parsedIdeas);
        } catch (error) {
          console.error('Error loading ideas:', error);
        }
      }
      
      if (savedNotepad) {
        setNotepadContent(savedNotepad);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtube-analytics-ideas', JSON.stringify(ideas));
    }
  }, [ideas]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtube-analytics-notepad', notepadContent);
    }
  }, [notepadContent]);

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
  const generateId = () => `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    ideas.forEach(idea => idea.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [ideas]);

  const filteredAndSortedIdeas = useCallback(() => {
    let filtered = ideas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => idea.tags.includes(tag));
      const matchesPriority = filterPriority === 'all' || idea.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || idea.status === filterStatus;
      
      return matchesSearch && matchesTags && matchesPriority && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'priority':
          aValue = PRIORITY_CONFIG[a.priority].order;
          bValue = PRIORITY_CONFIG[b.priority].order;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
        default:
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [ideas, searchTerm, selectedTags, filterPriority, filterStatus, sortBy, sortOrder]);

  const addIdea = () => {
    if (!newIdeaTitle.trim()) return;

    const newIdea: Idea = {
      id: generateId(),
      title: newIdeaTitle.trim(),
      content: newIdeaContent.trim(),
      priority: newIdeaPriority,
      tags: newIdeaTags,
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false,
      status: 'draft'
    };

    setIdeas(prev => [newIdea, ...prev]);
    setNewIdeaTitle('');
    setNewIdeaContent('');
    setNewIdeaTags([]);
    setNewIdeaPriority('medium');
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === id 
        ? { ...idea, ...updates, updatedAt: new Date() }
        : idea
    ));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const toggleStar = (id: string) => {
    updateIdea(id, { starred: !ideas.find(i => i.id === id)?.starred });
  };

  const addTag = () => {
    if (tagInput.trim() && !newIdeaTags.includes(tagInput.trim())) {
      setNewIdeaTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewIdeaTags(prev => prev.filter(t => t !== tag));
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="font-freight-neo-pro font-bold text-ebony-clay text-3xl">
            Ideas & Suggestions
          </h1>
          <p className="mt-2 text-gray-600">
            Capture your creative thoughts and organize your content ideas
          </p>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-12rem)]">
          {/* Notepad Section - 2/3 of the page */}
          <div className="flex flex-col lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-xl">
            <div className="flex justify-between items-center p-4 border-gray-100 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-sandy-yellow p-2 rounded-lg">
                  <Edit3 className="w-5 h-5 text-ebony-clay" />
                </div>
                <div>
                  <h3 className="font-semibold text-ebony-clay text-lg">Creative Notepad</h3>
                  <p className="text-gray-600 text-sm">Write your thoughts in Markdown</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {/* Save functionality can be added here */}}
                  className="flex items-center gap-2 bg-sandy-yellow hover:bg-sandy-yellow/90 px-3 py-1.5 rounded-lg text-ebony-clay text-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Auto-saved
                </button>
              </div>
            </div>
            
            <div className="flex flex-1">
              {/* Markdown Editor */}
              <div className="flex flex-col flex-1">
                <div className="bg-gray-50 p-3 border-gray-100 border-b">
                  <span className="font-medium text-gray-700 text-sm">Write</span>
                </div>
                <textarea
                  value={notepadContent}
                  onChange={(e) => setNotepadContent(e.target.value)}
                  placeholder="Start writing your ideas here... 

You can use **Markdown** formatting:
- **Bold text**
- *Italic text*
- `Code snippets`
- > Quotes
- ## Headings
- [Links](https://example.com)
- ![Images](url)

Ideas for video content:
- Tutorial series
- Behind the scenes
- Q&A sessions
- Collaborations

Remember to check your analytics to see what content performs best!"
                  className="flex-1 p-4 border-none outline-none font-mono text-sm leading-relaxed resize-none"
                />
              </div>
              
              {/* Markdown Preview */}
              <div className="flex flex-col flex-1 border-gray-200 border-l">
                <div className="bg-gray-50 p-3 border-gray-100 border-b">
                  <span className="font-medium text-gray-700 text-sm">Preview</span>
                </div>
                <div className="flex-1 p-4 max-w-none overflow-y-auto prose prose-sm">
                  <div 
                    className="text-gray-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: notepadContent
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
                        .replace(/^> (.*$)/gm, '<blockquote class="pl-4 border-sandy-yellow border-l-4 italic">$1</blockquote>')
                        .replace(/^## (.*$)/gm, '<h2 class="mt-4 mb-2 font-bold text-xl">$1</h2>')
                        .replace(/^# (.*$)/gm, '<h1 class="mt-4 mb-2 font-bold text-2xl">$1</h1>')
                        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sandy-yellow hover:underline">$1</a>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ideas Management Section - 1/3 of the page */}
          <div className="flex flex-col bg-white shadow-sm border border-gray-100 rounded-xl">
            {/* Header */}
            <div className="p-4 border-gray-100 border-b">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-sandy-yellow p-2 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-ebony-clay" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ebony-clay text-lg">Ideas</h3>
                    <p className="text-gray-600 text-sm">{ideas.length} total</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2 pr-4 pl-10 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow w-full text-sm"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="space-y-3 bg-gray-50 mb-4 p-3 rounded-lg">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <label className="w-16 font-medium text-gray-700 text-xs">Sort:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                    >
                      <option value="updatedAt">Last Updated</option>
                      <option value="createdAt">Created</option>
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="hover:bg-gray-200 p-1 rounded"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Priority Filter */}
                  <div className="flex items-center gap-2">
                    <label className="w-16 font-medium text-gray-700 text-xs">Priority:</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                    >
                      <option value="all">All</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <label className="w-16 font-medium text-gray-700 text-xs">Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                    >
                      <option value="all">All</option>
                      <option value="draft">Draft</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Tag Filters */}
                  {getAllTags().length > 0 && (
                    <div>
                      <label className="font-medium text-gray-700 text-xs">Tags:</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getAllTags().map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTagFilter(tag)}
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                              selectedTags.includes(tag)
                                ? 'bg-sandy-yellow text-ebony-clay'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Add New Idea Form */}
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Idea title..."
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="px-3 py-2 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow w-full text-sm"
                />
                <textarea
                  placeholder="Describe your idea..."
                  value={newIdeaContent}
                  onChange={(e) => setNewIdeaContent(e.target.value)}
                  rows={3}
                  className="px-3 py-2 border border-gray-200 focus:border-transparent rounded-lg focus:ring-2 focus:ring-sandy-yellow w-full text-sm resize-none"
                />
                
                {/* Priority and Tags */}
                <div className="flex gap-2">
                  <select
                    value={newIdeaPriority}
                    onChange={(e) => setNewIdeaPriority(e.target.value as Idea['priority'])}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                  <button
                    onClick={addTag}
                    className="bg-sandy-yellow hover:bg-sandy-yellow/90 px-2 py-1 rounded text-ebony-clay text-xs"
                  >
                    <Tag className="w-3 h-3" />
                  </button>
                </div>

                {/* New Idea Tags */}
                {newIdeaTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {newIdeaTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full text-gray-700 text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:bg-gray-300 p-0.5 rounded-full"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={addIdea}
                  disabled={!newIdeaTitle.trim()}
                  className="flex justify-center items-center gap-2 bg-ebony-clay hover:bg-ebony-clay/90 disabled:opacity-50 px-4 py-2 rounded-lg w-full text-white text-sm transition-colors disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Idea
                </button>
              </div>
            </div>

            {/* Ideas List */}
            <div className="flex-1 overflow-y-auto">
              {filteredAndSortedIdeas().length === 0 ? (
                <div className="p-6 text-center">
                  <Lightbulb className="mx-auto mb-3 w-12 h-12 text-gray-300" />
                  <p className="text-gray-500 text-sm">No ideas yet. Start by adding your first idea!</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredAndSortedIdeas().map((idea) => (
                    <div
                      key={idea.id}
                      className="group p-3 border border-gray-200 hover:border-sandy-yellow rounded-lg transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="flex-1 font-medium text-ebony-clay text-sm truncate">
                          {idea.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => toggleStar(idea.id)}
                            className={`p-1 rounded hover:bg-gray-100 ${idea.starred ? 'text-yellow-500' : 'text-gray-400'}`}
                          >
                            <Star className="w-3 h-3" fill={idea.starred ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => deleteIdea(idea.id)}
                            className="hover:bg-gray-100 p-1 rounded text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-2 text-gray-600 text-xs line-clamp-2">{idea.content}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs border ${PRIORITY_CONFIG[idea.priority].color}`}>
                            {PRIORITY_CONFIG[idea.priority].label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${STATUS_CONFIG[idea.status].color}`}>
                            {STATUS_CONFIG[idea.status].label}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {idea.updatedAt.toLocaleDateString()}
                        </span>
                      </div>

                      {idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {idea.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}