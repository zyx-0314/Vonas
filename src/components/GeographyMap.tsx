import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { country: 'United States', viewers: 450000 },
  { country: 'India', viewers: 320000 },
  { country: 'United Kingdom', viewers: 180000 },
  { country: 'Canada', viewers: 150000 },
  { country: 'Australia', viewers: 120000 },
].sort((a, b) => b.viewers - a.viewers);

export function GeographyMap() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} 
            tickFormatter={(value) => `${value / 1000}K`} />
          <YAxis dataKey="country" type="category" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value) => [`${(value as number).toLocaleString()} viewers`, 'Viewers']}
          />
          <Bar dataKey="viewers" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}