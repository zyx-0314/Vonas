import { Eye, Clock, Users, DollarSign } from 'lucide-react';

export const statsData = [
  {
    title: 'Views',
    value: '2.4M',
    change: '+12.5%',
    icon: Eye,
    positive: true,
    details: [
      { label: 'Average View Duration', value: '4:32 minutes' },
      { label: 'Unique Viewers', value: '1.8M' },
      { label: 'Peak Viewing Time', value: '2PM - 6PM EST' },
      { label: 'Mobile Views', value: '65%' },
      { label: 'Desktop Views', value: '35%' }
    ]
  },
  {
    title: 'Watch Time',
    value: '142.5K',
    change: '+8.2%',
    icon: Clock,
    positive: true,
    details: [
      { label: 'Total Hours Watched', value: '142,500 hours' },
      { label: 'Average Session Duration', value: '12.3 minutes' },
      { label: 'Retention Rate', value: '48%' },
      { label: 'Peak Watch Hours', value: 'Weekends' },
      { label: 'Most Watched Category', value: 'Tutorials' }
    ]
  },
  {
    title: 'Subscribers',
    value: '45.2K',
    change: '-2.4%',
    icon: Users,
    positive: false,
    details: [
      { label: 'New Subscribers', value: '2.8K' },
      { label: 'Unsubscribed', value: '3.9K' },
      { label: 'Subscriber Watch Time', value: '85.5K hours' },
      { label: 'Top Subscriber Location', value: 'United States (42%)' },
      { label: 'Subscriber Engagement Rate', value: '18%' }
    ]
  },
  {
    title: 'Revenue',
    value: '$12.4K',
    change: '+15.7%',
    icon: DollarSign,
    positive: true,
    details: [
      { label: 'Ad Revenue', value: '$8.2K' },
      { label: 'Channel Memberships', value: '$2.1K' },
      { label: 'Super Chat', value: '$1.5K' },
      { label: 'Merchandise', value: '$600' },
      { label: 'RPM (Revenue per Mille)', value: '$4.82' }
    ]
  }
];