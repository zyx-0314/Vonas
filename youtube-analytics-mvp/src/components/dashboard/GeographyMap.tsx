/**
 * Component: components/dashboard/GeographyMap.tsx
 * Purpose: Display geographic distribution of viewers with visual representation.
 * Props:
 *   - data: GeographyData[] (array of country data with views and percentages)
 */

'use client';

import React from 'react';
import { MapPin, Globe, TrendingUp } from 'lucide-react';

interface GeographyData {
  country: string;
  code: string;
  views: number;
  percentage: number;
  growth?: string;
}

interface GeographyMapProps {
  data: GeographyData[];
}

export function GeographyMap({ data }: GeographyMapProps) {
  // Sort data by percentage for better visualization
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  const topCountries = sortedData.slice(0, 5);
  const totalViews = data.reduce((sum, country) => sum + country.views, 0);

  // Get flag emoji for country (simplified mapping)
  const getFlagEmoji = (countryCode: string): string => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'GB': '🇬🇧', 
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'JP': '🇯🇵',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'MX': '🇲🇽',
      'NL': '🇳🇱',
      'SE': '🇸🇪',
      'NO': '🇳🇴'
    };
    return flags[countryCode] || '🌍';
  };

  // Generate color intensity based on percentage
  const getColorIntensity = (percentage: number, maxPercentage: number): string => {
    const intensity = percentage / maxPercentage;
    if (intensity > 0.8) return 'bg-sandy-yellow';
    if (intensity > 0.6) return 'bg-sandy-yellow/80';
    if (intensity > 0.4) return 'bg-sandy-yellow/60';
    if (intensity > 0.2) return 'bg-sandy-yellow/40';
    return 'bg-sandy-yellow/20';
  };

  const maxPercentage = Math.max(...data.map(d => d.percentage));

  return (
    <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-sandy-yellow p-2 rounded-lg">
          <Globe className="w-5 h-5 text-ebony-clay" />
        </div>
        <div>
          <h3 className="font-semibold text-ebony-clay text-lg">Geographic Distribution</h3>
          <p className="text-gray-600 text-sm">Views by location ({totalViews.toLocaleString()} total)</p>
        </div>
      </div>

      {/* World Map Visualization (Simplified) */}
      <div className="bg-gray-50 mb-6 p-4 rounded-lg">
        <div className="flex justify-center items-center mb-4">
          <div className="text-4xl">🗺️</div>
        </div>
        
        {/* Top Countries Grid */}
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {topCountries.map((country, index) => (
            <div 
              key={country.code}
              className={`relative p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                index === 0 ? 'border-sandy-yellow bg-sandy-yellow/10' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getFlagEmoji(country.code)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ebony-clay text-sm truncate">
                    {country.country}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {country.views.toLocaleString()} views
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-ebony-clay text-sm">
                    {country.percentage.toFixed(1)}%
                  </div>
                  {country.growth && (
                    <div className={`text-xs flex items-center gap-1 ${
                      country.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      {country.growth}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Ranking badge for top 3 */}
              {index < 3 && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed List */}
      <div className="space-y-2">
        <h4 className="flex items-center gap-2 mb-3 font-medium text-ebony-clay text-sm">
          <MapPin className="w-4 h-4" />
          All Locations
        </h4>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedData.map((country, index) => (
            <div key={country.code} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="text-lg">{getFlagEmoji(country.code)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700 text-sm truncate">
                    {country.country}
                  </span>
                  <div className="ml-2 text-right">
                    <span className="font-semibold text-ebony-clay text-sm">
                      {country.percentage.toFixed(1)}%
                    </span>
                    <div className="text-gray-500 text-xs">
                      {country.views.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="bg-gray-200 rounded-full w-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${getColorIntensity(country.percentage, maxPercentage)}`}
                    style={{ width: `${(country.percentage / maxPercentage) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-gray-100 border-t">
        <div className="gap-4 grid grid-cols-3 text-center">
          <div>
            <div className="font-bold text-ebony-clay text-lg">
              {data.length}
            </div>
            <div className="text-gray-600 text-xs">Countries</div>
          </div>
          <div>
            <div className="font-bold text-ebony-clay text-lg">
              {topCountries[0]?.country || 'N/A'}
            </div>
            <div className="text-gray-600 text-xs">Top Location</div>
          </div>
          <div>
            <div className="font-bold text-ebony-clay text-lg">
              {(topCountries.slice(0, 3).reduce((sum, country) => sum + country.percentage, 0)).toFixed(1)}%
            </div>
            <div className="text-gray-600 text-xs">Top 3 Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}