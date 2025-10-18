import React from 'react';
import { Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';

const trendingTopics = [
  {
    topic: "AI Development Tools",
    growth: "+156%",
    description: "Growing interest in AI development tools and frameworks",
    suggestedTitles: [
      "Top 10 AI Development Tools for 2024",
      "Building Your First AI Application: Step by Step Guide",
      "AI Tools Comparison: TensorFlow vs PyTorch vs JAX"
    ]
  },
  {
    topic: "Web Performance",
    growth: "+82%",
    description: "Rising focus on web performance optimization",
    suggestedTitles: [
      "Core Web Vitals: Complete Optimization Guide",
      "Speed Up Your Website: Advanced Techniques",
      "Performance Monitoring Tools Compared"
    ]
  },
  {
    topic: "Cross-Platform Development",
    growth: "+64%",
    description: "Increased demand for cross-platform solutions",
    suggestedTitles: [
      "React Native vs Flutter: 2024 Comparison",
      "Building Cross-Platform Apps: Best Practices",
      "Native vs Cross-Platform: Making the Right Choice"
    ]
  }
];

export function IdeasTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Ideas</h2>
          <p className="text-gray-600">AI-powered recommendations based on trending topics</p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg">
            <Lightbulb className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Strategy Insights</h3>
            <p className="mt-2 text-gray-600">
              Based on your channel's performance and current market trends, we recommend focusing on
              technical tutorials and in-depth guides. Your audience shows high engagement with content
              longer than 15 minutes that includes practical demonstrations.
            </p>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-green-600 text-sm font-medium">{topic.growth}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{topic.topic}</h3>
            <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
            
            <div className="mt-4 space-y-3">
              {topic.suggestedTitles.map((title, titleIndex) => (
                <div key={titleIndex} className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Content Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recommended Content Calendar</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[
              {
                week: "Week 1",
                focus: "Technical Tutorials",
                topics: ["React Performance Optimization", "Advanced TypeScript Patterns"]
              },
              {
                week: "Week 2",
                focus: "Industry Insights",
                topics: ["2024 Web Development Trends", "Future of Frontend Development"]
              },
              {
                week: "Week 3",
                focus: "Practical Guides",
                topics: ["Building Scalable Applications", "DevOps Best Practices"]
              }
            ].map((period, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-24 flex-shrink-0">
                  <p className="font-medium text-gray-900">{period.week}</p>
                  <p className="text-sm text-gray-600">{period.focus}</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {period.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}