/**
 * Hook: lib/hooks/useIdeas.ts
 * Purpose: React hook for Ideas CRUD operations with client-side state management.
 * Features:
 *   - Fetch ideas with filtering, sorting, pagination
 *   - Create, update, delete ideas
 *   - Bulk operations (reorder, batch update)
 *   - Optimistic updates
 *   - Error handling
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaFilters {
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  tags?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'position' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateIdeaData {
  title: string;
  content: string;
  tags?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';
  position?: number;
}

export interface UpdateIdeaData {
  title?: string;
  content?: string;
  tags?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';
  position?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface IdeasResponse {
  ideas: Idea[];
  pagination: PaginationInfo;
}

interface ApiError {
  code: string;
  message: string;
  details?: any[];
}

export function useIdeas(initialFilters: IdeaFilters = {}) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IdeaFilters>(initialFilters);

  // Get auth token from localStorage or cookies
  const getAuthToken = useCallback(() => {
    // Try localStorage first (for development)
    const token = localStorage.getItem('auth-token');
    if (token) return token;
    
    // Fallback to cookie parsing
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    return authCookie ? authCookie.split('=')[1] : null;
  }, []);

  const apiRequest = useCallback(async (config: any) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    return axios({
      ...config,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...config.headers
      }
    });
  }, [getAuthToken]);

  // Fetch ideas with current filters
  const fetchIdeas = useCallback(async (newFilters?: IdeaFilters) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      const activeFilters = { ...filters, ...newFilters };

      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await apiRequest({
        method: 'GET',
        url: `/api/ideas?${searchParams.toString()}`
      });

      const data: IdeasResponse = response.data;
      setIdeas(data.ideas);
      setPagination(data.pagination);

      if (newFilters) {
        setFilters(activeFilters);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch ideas';
      setError(errorMessage);
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, apiRequest]);

  // Create a new idea
  const createIdea = useCallback(async (data: CreateIdeaData): Promise<Idea | null> => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/api/ideas',
        data
      });

      const newIdea: Idea = response.data.idea;
      
      // Optimistic update
      setIdeas(prev => [newIdea, ...prev]);
      
      return newIdea;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to create idea';
      setError(errorMessage);
      console.error('Error creating idea:', err);
      return null;
    }
  }, [apiRequest]);

  // Update an existing idea
  const updateIdea = useCallback(async (id: string, data: UpdateIdeaData): Promise<Idea | null> => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/api/ideas/${id}`,
        data
      });

      const updatedIdea: Idea = response.data.idea;
      
      // Optimistic update
      setIdeas(prev => prev.map(idea => 
        idea.id === id ? updatedIdea : idea
      ));
      
      return updatedIdea;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to update idea';
      setError(errorMessage);
      console.error('Error updating idea:', err);
      return null;
    }
  }, [apiRequest]);

  // Patch an idea (partial update)
  const patchIdea = useCallback(async (id: string, data: Partial<UpdateIdeaData>): Promise<Idea | null> => {
    try {
      const response = await apiRequest({
        method: 'PATCH',
        url: `/api/ideas/${id}`,
        data
      });

      const updatedIdea: Idea = response.data.idea;
      
      // Optimistic update
      setIdeas(prev => prev.map(idea => 
        idea.id === id ? updatedIdea : idea
      ));
      
      return updatedIdea;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to patch idea';
      setError(errorMessage);
      console.error('Error patching idea:', err);
      return null;
    }
  }, [apiRequest]);

  // Delete an idea
  const deleteIdea = useCallback(async (id: string, hardDelete: boolean = false): Promise<boolean> => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/api/ideas/${id}${hardDelete ? '?hard=true' : ''}`
      });

      if (hardDelete) {
        // Remove from local state
        setIdeas(prev => prev.filter(idea => idea.id !== id));
      } else {
        // Update status to DELETED
        setIdeas(prev => prev.map(idea => 
          idea.id === id ? { ...idea, status: 'DELETED' as const } : idea
        ));
      }
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to delete idea';
      setError(errorMessage);
      console.error('Error deleting idea:', err);
      return false;
    }
  }, [apiRequest]);

  // Reorder ideas
  const reorderIdeas = useCallback(async (updates: { id: string; position: number }[]): Promise<boolean> => {
    try {
      await apiRequest({
        method: 'PATCH',
        url: '/api/ideas/bulk',
        data: { updates }
      });

      // Optimistic update - sort by new positions
      setIdeas(prev => {
        const updatedIdeas = [...prev];
        updates.forEach(update => {
          const ideaIndex = updatedIdeas.findIndex(idea => idea.id === update.id);
          if (ideaIndex !== -1) {
            updatedIdeas[ideaIndex] = { ...updatedIdeas[ideaIndex], position: update.position };
          }
        });
        return updatedIdeas.sort((a, b) => a.position - b.position);
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to reorder ideas';
      setError(errorMessage);
      console.error('Error reordering ideas:', err);
      return false;
    }
  }, [apiRequest]);

  // Bulk update ideas
  const bulkUpdateIdeas = useCallback(async (
    ids: string[], 
    data: { tags?: string[]; priority?: string; status?: string }
  ): Promise<boolean> => {
    try {
      await apiRequest({
        method: 'PATCH',
        url: '/api/ideas/bulk',
        data: { ids, data }
      });

      // Optimistic update
      setIdeas(prev => prev.map(idea => 
        ids.includes(idea.id) ? { ...idea, ...data } as Idea : idea
      ));

      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to bulk update ideas';
      setError(errorMessage);
      console.error('Error bulk updating ideas:', err);
      return false;
    }
  }, [apiRequest]);

  // Batch operations (delete, archive, etc.)
  const batchOperation = useCallback(async (
    operation: 'delete' | 'archive' | 'activate' | 'complete',
    ids: string[]
  ): Promise<boolean> => {
    try {
      await apiRequest({
        method: 'POST',
        url: '/api/ideas/bulk',
        data: { operation, ids }
      });

      let statusUpdate: 'DELETED' | 'ARCHIVED' | 'ACTIVE' | 'COMPLETED';
      switch (operation) {
        case 'delete':
          statusUpdate = 'DELETED';
          break;
        case 'archive':
          statusUpdate = 'ARCHIVED';
          break;
        case 'activate':
          statusUpdate = 'ACTIVE';
          break;
        case 'complete':
          statusUpdate = 'COMPLETED';
          break;
      }

      // Optimistic update
      setIdeas(prev => prev.map(idea => 
        ids.includes(idea.id) ? { ...idea, status: statusUpdate } : idea
      ));

      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to perform batch operation';
      setError(errorMessage);
      console.error('Error performing batch operation:', err);
      return false;
    }
  }, [apiRequest]);

  // Load initial data
  useEffect(() => {
    fetchIdeas();
  }, []); // Only run once on mount

  return {
    // State
    ideas,
    pagination,
    loading,
    error,
    filters,

    // Actions
    fetchIdeas,
    createIdea,
    updateIdea,
    patchIdea,
    deleteIdea,
    reorderIdeas,
    bulkUpdateIdeas,
    batchOperation,
    setFilters,
    
    // Utils
    clearError: () => setError(null)
  };
}