/**
 * Module: store/useAppStore.ts
 * Purpose: Zustand store for managing application state.
 * State:
 *   - User authentication state
 *   - YouTube metrics data
 *   - Loading and error states
 */

import { create } from 'zustand';
import { PrismaClient } from '@prisma/client';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface Metrics {
  views: number;
  subscribers: number;
  watchTime: number;
  revenue: number;
  date: Date;
  changes?: {
    views: string;
    subscribers: string;
    watchTime: string;
    revenue: string;
  };
}

interface AppState {
  user: User | null;
  metrics: Metrics | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setMetrics: (metrics: Metrics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMetrics: (userId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  metrics: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setMetrics: (metrics) => set({ metrics }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchMetrics: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real application, this would call an API
      // For now, we'll use the seeded data
      const response = await fetch(`/api/metrics/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      
      const data = await response.json();
      set({ metrics: data.metrics, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
        isLoading: false 
      });
    }
  },
}));