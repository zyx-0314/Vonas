/**
 * Page: /monetization
 * Purpose: Monetization dashboard showing revenue streams, opportunities, and financial analytics.
 * Features:
 *   - Revenue breakdown by source
 *   - Monthly/yearly trends
 *   - Monetization opportunities
 *   - Payment settings
 *   - Tax information
 *   - Revenue optimization suggestions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  Users, 
  Play,
  Eye,
  Settings,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Wallet,
  Gift,
  Crown,
  Zap,
  Star,
  Download
} from 'lucide-react';

interface RevenueData {
  source: string;
  amount: number;
  percentage: number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface MonthlyData {
  month: string;
  total: number;
  adRevenue: number;
  memberships: number;
  superChat: number;
  premium: number;
}

// Sample monetization data - in production this would come from YouTube API
const revenueStreams: RevenueData[] = [
  {
    source: 'Ad Revenue',
    amount: 2312,
    percentage: 80,
    change: '+12.5%',
    trend: 'up',
    icon: <Play className="w-5 h-5" />,
    color: 'bg-blue-500'
  },
  {
    source: 'Channel Memberships',
    amount: 289,
    percentage: 10,
    change: '+25.3%',
    trend: 'up',
    icon: <Crown className="w-5 h-5" />,
    color: 'bg-purple-500'
  },
  {
    source: 'Super Chat & Thanks',
    amount: 202,
    percentage: 7,
    change: '+8.7%',
    trend: 'up',
    icon: <Gift className="w-5 h-5" />,
    color: 'bg-green-500'
  },
  {
    source: 'YouTube Premium',
    amount: 87,
    percentage: 3,
    change: '-2.1%',
    trend: 'down',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-yellow-500'
  }
];

const monthlyRevenue: MonthlyData[] = [
  { month: 'Jan', total: 2100, adRevenue: 1680, memberships: 210, superChat: 147, premium: 63 },
  { month: 'Feb', total: 2350, adRevenue: 1880, memberships: 235, superChat: 164, premium: 71 },
  { month: 'Mar', total: 2890, adRevenue: 2312, memberships: 289, superChat: 202, premium: 87 },
  { month: 'Apr', total: 2650, adRevenue: 2120, memberships: 265, superChat: 185, premium: 80 },
  { month: 'May', total: 3100, adRevenue: 2480, memberships: 310, superChat: 217, premium: 93 }
];

const monetizationOpportunities = [
  {
    title: 'Enable Channel Memberships',
    description: 'Offer exclusive perks to subscribers for recurring revenue',
    potential: '+$400/month',
    status: 'available',
    requirements: '1,000+ subscribers',
    priority: 'high'
  },
  {
    title: 'Create Merchandise Shelf',
    description: 'Sell branded merchandise directly on your channel',
    potential: '+$200/month',
    status: 'available',
    requirements: '10,000+ subscribers',
    priority: 'medium'
  },
  {
    title: 'Live Streaming for Super Chat',
    description: 'Go live to receive Super Chat donations',
    potential: '+$150/month',
    status: 'available',
    requirements: 'No chat restrictions',
    priority: 'high'
  },
  {
    title: 'YouTube Shorts Fund',
    description: 'Create engaging Shorts content for bonus payments',
    potential: '+$100/month',
    status: 'pending',
    requirements: 'Shorts with 100K+ views',
    priority: 'medium'
  }
];

export default function MonetizationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'streams' | 'opportunities' | 'settings'>('overview');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center bg-whitesmoke min-h-screen">
        <div className="font-freight-neo-pro text-ebony-clay">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated (prevent flash)
  if (!user) {
    return null;
  }

  const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.amount, 0);
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const monthlyGrowth = ((currentMonth.total - previousMonth.total) / previousMonth.total * 100).toFixed(1);

  const RevenueCard = ({ stream }: { stream: RevenueData }) => (
    <div className="bg-white hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-lg ${stream.color.replace('bg-', 'bg-')} bg-opacity-10`}>
          <div className={`${stream.color.replace('bg-', 'text-')}`}>
            {stream.icon}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          stream.trend === 'up' ? 'text-green-600' : stream.trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {stream.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : 
           stream.trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> : null}
          {stream.change}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-gray-700 text-sm">{stream.source}</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-ebony-clay text-2xl">${stream.amount}</span>
          <span className="text-gray-500 text-sm">({stream.percentage}%)</span>
        </div>
        
        {/* Progress bar */}
        <div className="bg-gray-200 mt-3 rounded-full w-full h-2">
          <div 
            className={`h-2 rounded-full ${stream.color} transition-all duration-500`}
            style={{ width: `${stream.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const OpportunityCard = ({ opportunity }: { opportunity: typeof monetizationOpportunities[0] }) => (
    <div className="bg-white p-6 border border-gray-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-ebony-clay">{opportunity.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              opportunity.priority === 'high' ? 'bg-red-100 text-red-700' :
              opportunity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {opportunity.priority} priority
            </span>
          </div>
          <p className="mb-3 text-gray-600 text-sm">{opportunity.description}</p>
          <div className="mb-2 text-gray-500 text-xs">
            <strong>Requirements:</strong> {opportunity.requirements}
          </div>
        </div>
        
        <div className="text-right">
          <div className="mb-1 font-bold text-green-600 text-lg">{opportunity.potential}</div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            opportunity.status === 'available' ? 'bg-green-100 text-green-700' :
            opportunity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {opportunity.status}
          </div>
        </div>
      </div>
      
      <button className="bg-sandy-yellow hover:bg-sandy-yellow/90 px-4 py-2 rounded-lg w-full font-medium text-ebony-clay transition-colors">
        {opportunity.status === 'available' ? 'Set Up Now' : 'Learn More'}
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-600 text-sm">Total Revenue</span>
                </div>
                <div className="font-bold text-ebony-clay text-3xl">${totalRevenue}</div>
                <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  +{monthlyGrowth}% this month
                </div>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-600 text-sm">This Month</span>
                </div>
                <div className="font-bold text-ebony-clay text-3xl">${currentMonth.total}</div>
                <div className="mt-1 text-gray-500 text-sm">vs ${previousMonth.total} last month</div>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-600 text-sm">RPM</span>
                </div>
                <div className="font-bold text-ebony-clay text-3xl">$4.41</div>
                <div className="mt-1 text-gray-500 text-sm">Revenue per mille</div>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-600 text-sm">Potential</span>
                </div>
                <div className="font-bold text-ebony-clay text-3xl">+$850</div>
                <div className="mt-1 text-gray-500 text-sm">Monthly opportunity</div>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-ebony-clay text-lg">Revenue Trend</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedPeriod('month')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      selectedPeriod === 'month' ? 'bg-white text-ebony-clay shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('year')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      selectedPeriod === 'year' ? 'bg-white text-ebony-clay shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              
              <div className="gap-4 grid grid-cols-5">
                {monthlyRevenue.map((month, index) => (
                  <div key={month.month} className="text-center">
                    <div className="mb-2">
                      <div 
                        className="bg-sandy-yellow mx-auto rounded-t-lg transition-all duration-500"
                        style={{ 
                          height: `${(month.total / Math.max(...monthlyRevenue.map(m => m.total))) * 120}px`,
                          width: '40px'
                        }}
                      ></div>
                    </div>
                    <div className="font-medium text-gray-700 text-xs">{month.month}</div>
                    <div className="text-gray-500 text-xs">${month.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'streams':
        return (
          <div className="space-y-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              {revenueStreams.map((stream, index) => (
                <RevenueCard key={index} stream={stream} />
              ))}
            </div>
            
            {/* Detailed Breakdown */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl">
              <h3 className="mb-4 font-semibold text-ebony-clay text-lg">Revenue Breakdown by Month</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-gray-200 border-b">
                      <th className="px-4 py-3 font-medium text-gray-600 text-left">Month</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-left">Total</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-left">Ad Revenue</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-left">Memberships</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-left">Super Chat</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-left">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRevenue.map((month, index) => (
                      <tr key={index} className="hover:bg-gray-50 border-gray-100 border-b">
                        <td className="px-4 py-3 font-medium">{month.month}</td>
                        <td className="px-4 py-3">${month.total}</td>
                        <td className="px-4 py-3">${month.adRevenue}</td>
                        <td className="px-4 py-3">${month.memberships}</td>
                        <td className="px-4 py-3">${month.superChat}</td>
                        <td className="px-4 py-3">${month.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'opportunities':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Monetization Opportunities</span>
              </div>
              <p className="text-blue-700 text-sm">
                Explore new ways to increase your revenue. Each opportunity shows potential monthly earnings.
              </p>
            </div>
            
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              {monetizationOpportunities.map((opportunity, index) => (
                <OpportunityCard key={index} opportunity={opportunity} />
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-xl">
              <h3 className="mb-4 font-semibold text-ebony-clay text-lg">Payment Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Payment Method</div>
                      <div className="text-gray-600 text-sm">Bank transfer to ****-1234</div>
                    </div>
                  </div>
                  <button className="font-medium text-sandy-yellow hover:text-sandy-yellow/80">
                    Edit
                  </button>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Payment Threshold</div>
                      <div className="text-gray-600 text-sm">$100 minimum payout</div>
                    </div>
                  </div>
                  <button className="font-medium text-sandy-yellow hover:text-sandy-yellow/80">
                    Change
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-xl">
              <h3 className="mb-4 font-semibold text-ebony-clay text-lg">Tax Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Tax Documents</div>
                      <div className="text-gray-600 text-sm">All required forms submitted</div>
                    </div>
                  </div>
                  <button className="font-medium text-sandy-yellow hover:text-sandy-yellow/80">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
            <div>
              <h1 className="font-freight-neo-pro font-bold text-ebony-clay text-3xl">
                Monetization
              </h1>
              <p className="mt-2 text-gray-600">
                Track your revenue streams and discover new monetization opportunities
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white p-1 border border-gray-200 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'streams', label: 'Revenue Streams', icon: <PieChart className="w-4 h-4" /> },
              { id: 'opportunities', label: 'Opportunities', icon: <Target className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sandy-yellow text-ebony-clay'
                    : 'text-gray-600 hover:text-ebony-clay hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}