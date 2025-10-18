import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Mar 1', views: 15000 },
  { date: 'Mar 5', views: 25000 },
  { date: 'Mar 10', views: 18000 },
  { date: 'Mar 15', views: 32000 },
  { date: 'Mar 20', views: 28000 },
  { date: 'Mar 25', views: 45000 },
  { date: 'Mar 30', views: 52000 },
];

export function ViewsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} 
            tickFormatter={(value) => `${value / 1000}K`} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#ef4444" 
            strokeWidth={2}
            fill="url(#colorViews)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}