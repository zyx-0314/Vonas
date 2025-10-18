import React, { useState } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  positive: boolean;
  details: {
    label: string;
    value: string;
  }[];
}

export function StatCard({ title, value, change, icon: Icon, positive, details }: StatCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors text-left"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
          <span className={`flex items-center text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {change}
          </span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </button>

      {isExpanded && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsExpanded(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-xl shadow-lg z-50 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{title} Details</h3>
                <p className="text-sm text-gray-600 mt-1">Last 28 days metrics</p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Change</p>
                  <p className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
                    {change} from last period
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {details.map((detail, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-sm text-gray-600 mb-1">{detail.label}</p>
                    <p className="font-medium text-gray-900">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}