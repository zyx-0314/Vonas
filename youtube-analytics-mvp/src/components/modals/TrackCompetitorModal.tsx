/**
 * Component: components/modals/TrackCompetitorModal.tsx
 * Purpose: Modal for adding new competitors to track.
 * Props:
 *   - isOpen: boolean (modal visibility state)
 *   - onClose: () => void (callback to close modal)
 *   - onSubmit: (competitor: CompetitorData) => void (callback when form submitted)
 */

'use client';

import React, { useState } from 'react';
import { X, Youtube, Search, Plus, AlertCircle } from 'lucide-react';

interface CompetitorData {
  channelName: string;
  channelUrl: string;
  description?: string;
  tags: string[];
}

interface TrackCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (competitor: CompetitorData) => void;
}

export function TrackCompetitorModal({ isOpen, onClose, onSubmit }: TrackCompetitorModalProps) {
  const [formData, setFormData] = useState<CompetitorData>({
    channelName: '',
    channelUrl: '',
    description: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Don't render if modal is not open
  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.channelName.trim()) {
      newErrors.channelName = 'Channel name is required';
    }

    if (!formData.channelUrl.trim()) {
      newErrors.channelUrl = 'Channel URL is required';
    } else if (!isValidYouTubeUrl(formData.channelUrl)) {
      newErrors.channelUrl = 'Please enter a valid YouTube channel URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubePatterns = [
      /^https?:\/\/(www\.)?youtube\.com\/channel\/[a-zA-Z0-9_-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/c\/[a-zA-Z0-9_-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/@[a-zA-Z0-9_.-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/user\/[a-zA-Z0-9_-]+/
    ];
    
    return youtubePatterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(formData);
      
      // Reset form
      setFormData({
        channelName: '',
        channelUrl: '',
        description: '',
        tags: []
      });
      setNewTag('');
      setErrors({});
      
      onClose();
    } catch (error) {
      console.error('Error tracking competitor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-gray-200 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-sandy-yellow p-2 rounded-lg">
              <Youtube className="w-5 h-5 text-ebony-clay" />
            </div>
            <div>
              <h2 className="font-semibold text-ebony-clay text-xl">Track New Competitor</h2>
              <p className="text-gray-600 text-sm">Add a YouTube channel to monitor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Channel Name */}
          <div>
            <label htmlFor="channelName" className="block mb-2 font-medium text-ebony-clay text-sm">
              Channel Name *
            </label>
            <input
              id="channelName"
              type="text"
              value={formData.channelName}
              onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
              placeholder="e.g., MrBeast, PewDiePie, etc."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sandy-yellow focus:border-sandy-yellow transition-colors ${
                errors.channelName ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.channelName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.channelName}
              </div>
            )}
          </div>

          {/* Channel URL */}
          <div>
            <label htmlFor="channelUrl" className="block mb-2 font-medium text-ebony-clay text-sm">
              Channel URL *
            </label>
            <input
              id="channelUrl"
              type="url"
              value={formData.channelUrl}
              onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
              placeholder="https://youtube.com/@channelname"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sandy-yellow focus:border-sandy-yellow transition-colors ${
                errors.channelUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.channelUrl && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.channelUrl}
              </div>
            )}
            <p className="mt-1 text-gray-500 text-xs">
              Enter the full YouTube channel URL (e.g., youtube.com/@username or youtube.com/channel/ID)
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 font-medium text-ebony-clay text-sm">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why are you tracking this competitor? What do you want to learn?"
              className="px-3 py-2 border border-gray-300 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow w-full transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 font-medium text-ebony-clay text-sm">
              Tags (Optional)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 focus:border-sandy-yellow rounded-lg focus:ring-2 focus:ring-sandy-yellow transition-colors"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim() || isSubmitting}
                  className="bg-sandy-yellow hover:bg-sandy-yellow/90 disabled:opacity-50 px-3 py-2 rounded-lg text-ebony-clay transition-colors disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-gray-700 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-gray-200 p-0.5 rounded-full transition-colors"
                        disabled={isSubmitting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-gray-500 text-xs">
              Tags help categorize competitors (e.g., "gaming", "tech", "similar-size")
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 justify-center items-center gap-2 bg-ebony-clay hover:bg-ebony-clay/90 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Track Competitor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}