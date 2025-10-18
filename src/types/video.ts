export interface Video {
  id: string;
  title: string;
  views: number;
  engagement: number;
  publishDate: string;
  duration?: string;
  thumbnail: string;
  isCompetitor?: boolean;
  channel?: string;
  performance: 'overperforming' | 'average' | 'underperforming';
  tags?: string[];
  description?: string;
  transcript?: string;
  insights?: string[];
}