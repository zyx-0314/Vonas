/**
 * Component: components/dashboard/MetricCard.tsx
 * Purpose: Display YouTube analytics metrics in card format.
 * Props:
 *   - title: string
 *   - value: string
 *   - change?: string
 *   - positive?: boolean
 *   - icon?: React.ReactNode
 *   - detailsLink?: string
 */

import Link from 'next/link';
import { Card } from '@/components/Card';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  detailsLink?: string;
}

export function MetricCard({
  title,
  value,
  change,
  positive,
  icon,
  detailsLink,
}: MetricCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-orbi font-semibold text-ebony-clay text-lg">
          {title}
        </h3>
        {icon && (
          <div className="text-ebony-clay/60">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="font-orbi font-bold text-ebony-clay text-3xl">
          {value}
        </div>
        
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {positive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-freight-neo-pro">
              {change} from last month
            </span>
          </div>
        )}
        
        {detailsLink && (
          <div className="mt-3 pt-3 border-gray-100 border-t">
            <Link 
              href={detailsLink}
              className="flex items-center gap-1 text-sandy-yellow hover:text-sandy-yellow/80 text-sm transition-colors"
            >
              <span>View Details</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}