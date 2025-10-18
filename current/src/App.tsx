import React, { useState } from 'react';
import { PlaySquare, LayoutDashboard, TrendingUp, MessageSquare, DollarSign, Lightbulb } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { statsData } from './data/statsData';
import { ViewsChart } from './components/ViewsChart';
import { EngagementDonut } from './components/EngagementDonut';
import { GeographyMap } from './components/GeographyMap';
import { ContentAnalysis } from './pages/ContentAnalysis';
import { IdeasTab } from './pages/IdeasTab';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'content' | 'ideas'>('dashboard');

  const pages = {
    dashboard: (
      <div className="max-w-7xl mx-auto">
        {/* Dashboard content remains the same */}
      </div>
    ),
    content: <ContentAnalysis />,
    ideas: <IdeasTab />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <PlaySquare className="h-8 w-8 text-red-600" />
          <h1 className="text-xl font-bold">Studio Analytics</h1>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2
              ${currentPage === 'dashboard' ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('content')}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2
              ${currentPage === 'content' ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}
          >
            <TrendingUp className="h-4 w-4" />
            Content
          </button>
          <button
            onClick={() => setCurrentPage('ideas')}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2
              ${currentPage === 'ideas' ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}
          >
            <Lightbulb className="h-4 w-4" />
            Ideas
          </button>
          {['Comments', 'Monetization'].map((item) => (
            <button key={item} 
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700">
              {item === 'Comments' ? <MessageSquare className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="ml-64 p-8">
        {pages[currentPage]}
      </main>
    </div>
  );
}

export default App;