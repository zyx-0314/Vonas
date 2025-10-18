import { Video } from '../types/video';

export const videos: Video[] = [
  {
    id: '1',
    title: 'Advanced React Patterns 2024',
    views: 524000,
    engagement: 98,
    publishDate: '2024-03-01',
    duration: '18:24',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    performance: 'overperforming',
    tags: ['React', 'JavaScript', 'Web Development', 'Advanced', 'Patterns'],
    description: 'Learn advanced React patterns that will help you build better, more maintainable applications. We cover compound components, render props, hooks patterns, and more.',
    transcript: `00:00 - Introduction
02:15 - Compound Components Pattern
05:30 - Render Props Pattern
08:45 - Custom Hooks Pattern
12:30 - State Reducer Pattern
15:45 - Conclusion`,
    insights: [
      'High engagement in first 5 minutes',
      'Most replayed section: Custom Hooks Pattern',
      'Strong audience retention throughout',
      'High share rate among senior developers'
    ]
  },
  {
    id: '2',
    title: 'React Performance Tips',
    views: 412000,
    engagement: 95,
    publishDate: '2024-02-28',
    duration: '15:32',
    thumbnail: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?w=800&q=80',
    isCompetitor: true,
    channel: 'ReactMaster',
    performance: 'overperforming',
    tags: ['React', 'Performance', 'Optimization', 'Web Development'],
    description: 'Essential performance optimization techniques for React applications.',
    insights: [
      'Popular among intermediate developers',
      'High watch time',
      'Frequently shared in development teams'
    ]
  },
  // Add more video data...
];