/**
 * Component: components/dashboard/EngagementDonut.tsx
 * Purpose: Display engagement metrics in a donut chart format.
 * Props:
 *   - likes: number (total likes)
 *   - comments: number (total comments)
 *   - shares: number (total shares)
 *   - saves: number (total saves)
 */

'use client';

import React from 'react';
import { Heart, MessageCircle, Share, Bookmark } from 'lucide-react';

interface EngagementDonutProps {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export function EngagementDonut({ likes, comments, shares, saves }: EngagementDonutProps) {
  const total = likes + comments + shares + saves;
  
  // Calculate percentages
  const likesPercent = total > 0 ? (likes / total) * 100 : 0;
  const commentsPercent = total > 0 ? (comments / total) * 100 : 0;
  const sharesPercent = total > 0 ? (shares / total) * 100 : 0;
  const savesPercent = total > 0 ? (saves / total) * 100 : 0;

  // Calculate cumulative percentages for stroke positioning
  const likesOffset = 0;
  const commentsOffset = likesPercent;
  const sharesOffset = likesPercent + commentsPercent;
  const savesOffset = likesPercent + commentsPercent + sharesPercent;

  // SVG circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const center = 60;

  // Convert percentages to stroke lengths
  const likesStroke = (likesPercent / 100) * circumference;
  const commentsStroke = (commentsPercent / 100) * circumference;
  const sharesStroke = (sharesPercent / 100) * circumference;
  const savesStroke = (savesPercent / 100) * circumference;

  const engagementData = [
    {
      label: 'Likes',
      value: likes,
      percentage: likesPercent,
      color: '#EF4444', // red-500
      icon: <Heart className="w-4 h-4" />,
      strokeLength: likesStroke,
      strokeOffset: (likesOffset / 100) * circumference
    },
    {
      label: 'Comments',
      value: comments,
      percentage: commentsPercent,
      color: '#3B82F6', // blue-500
      icon: <MessageCircle className="w-4 h-4" />,
      strokeLength: commentsStroke,
      strokeOffset: (commentsOffset / 100) * circumference
    },
    {
      label: 'Shares',
      value: shares,
      percentage: sharesPercent,
      color: '#10B981', // green-500
      icon: <Share className="w-4 h-4" />,
      strokeLength: sharesStroke,
      strokeOffset: (sharesOffset / 100) * circumference
    },
    {
      label: 'Saves',
      value: saves,
      percentage: savesPercent,
      color: '#F59E0B', // yellow-500
      icon: <Bookmark className="w-4 h-4" />,
      strokeLength: savesStroke,
      strokeOffset: (savesOffset / 100) * circumference
    }
  ];

  return (
    <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-sandy-yellow p-2 rounded-lg">
          <Heart className="w-5 h-5 text-ebony-clay" />
        </div>
        <div>
          <h3 className="font-semibold text-ebony-clay text-lg">Engagement Breakdown</h3>
          <p className="text-gray-600 text-sm">Total interactions: {total.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col items-center gap-6">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <svg 
            width="120" 
            height="120" 
            className="-rotate-90 transform"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
          >
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="12"
            />
            
            {/* Engagement segments */}
            {engagementData.map((item, index) => (
              item.strokeLength > 0 && (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${item.strokeLength} ${circumference}`}
                  strokeDashoffset={-item.strokeOffset}
                  className="transition-all duration-500"
                />
              )
            ))}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="text-center">
              <div className="font-bold text-ebony-clay text-xl">
                {((total / 1000) >= 1 ? (total / 1000).toFixed(1) + 'K' : total.toLocaleString())}
              </div>
              <div className="text-gray-500 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 min-w-0">
          {engagementData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="flex-shrink-0 rounded-full w-3 h-3"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <span className="text-gray-600" style={{ color: item.color }}>
                  {item.icon}
                </span>
                <span className="flex-shrink-0 font-medium text-gray-700 text-sm">
                  {item.label}
                </span>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-semibold text-ebony-clay text-sm">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-gray-500 text-xs">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-4 border-gray-100 border-t">
        <div className="gap-4 grid grid-cols-2 text-center">
          <div>
            <div className="font-bold text-ebony-clay text-lg">
              {((likes + saves) / total * 100).toFixed(1)}%
            </div>
            <div className="text-gray-600 text-xs">Positive Engagement</div>
          </div>
          <div>
            <div className="font-bold text-ebony-clay text-lg">
              {(total / 1000 >= 1 ? (total / 100).toFixed(1) : (total / 10).toFixed(1)) + 'x'}
            </div>
            <div className="text-gray-600 text-xs">Engagement Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}