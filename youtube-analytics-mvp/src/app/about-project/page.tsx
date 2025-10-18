/**
 * Page: /about-project
 * Purpose: About Project page displaying project overview, tech stack, and features.
 * Features:
 *   - Project overview and objectives
 *   - Technology stack showcase
 *   - Architecture details
 *   - Feature highlights
 *   - Development timeline
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { 
  Code2, 
  Database, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Globe, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Github,
  ExternalLink,
  Play,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Target,
  Calendar,
  Monitor,
  Smartphone,
  Brain,
  UserCheck
} from 'lucide-react';

interface TechStackItem {
  category: string;
  tools: string;
  icon: React.ReactNode;
  color: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'planned';
}

const techStack: TechStackItem[] = [
  {
    category: 'Framework',
    tools: 'Next.js 15 (App Router)',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-blue-500'
  },
  {
    category: 'Language',
    tools: 'TypeScript',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-blue-600'
  },
  {
    category: 'UI / Styling',
    tools: 'Tailwind CSS + Radix UI',
    icon: <Monitor className="w-5 h-5" />,
    color: 'bg-purple-500'
  },
  {
    category: 'State Management',
    tools: 'Zustand',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-green-500'
  },
  {
    category: 'Authentication',
    tools: 'JWT + Google OAuth',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-red-500'
  },
  {
    category: 'Database',
    tools: 'PostgreSQL 15 + Prisma ORM',
    icon: <Database className="w-5 h-5" />,
    color: 'bg-indigo-500'
  },
  {
    category: 'Validation',
    tools: 'Zod',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-emerald-500'
  },
  {
    category: 'Containerization',
    tools: 'Docker + Docker Compose',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-cyan-500'
  }
];

const features: Feature[] = [
  {
    title: 'Google OAuth Authentication',
    description: 'Secure user sign-in using official YouTube permissions',
    icon: <Shield className="w-6 h-6" />,
    status: 'completed'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Real-time metrics for views, subscribers, watch time, and revenue',
    icon: <BarChart3 className="w-6 h-6" />,
    status: 'completed'
  },
  {
    title: 'Ideas & Content Management',
    description: 'Plan and track creative ideas with tagging and priority fields',
    icon: <Target className="w-6 h-6" />,
    status: 'completed'
  },
  {
    title: 'Comment Insights',
    description: 'Sentiment analysis and moderation tools for audience feedback',
    icon: <MessageCircle className="w-6 h-6" />,
    status: 'completed'
  },
  {
    title: 'Monetization Tracking',
    description: 'Visualize performance trends and revenue sources',
    icon: <DollarSign className="w-6 h-6" />,
    status: 'completed'
  },
  {
    title: 'Competitor Comparison',
    description: 'Analyze similar channels for growth insights',
    icon: <TrendingUp className="w-6 h-6" />,
    status: 'completed'
  }
];

const timeline = [
  {
    phase: 'MVP Development',
    duration: '4 hours',
    tasks: [
      'YouTube OAuth Setup (1 hr)',
      'Dashboard UI Layout (1 hr)',
      'Analytics Integration (1.5 hrs)',
      'Database & State Management (0.5 hr)'
    ]
  },
  {
    phase: 'Extended Development',
    duration: '≈ 72 hours (2 weeks)',
    tasks: [
      'Enhanced Analytics and Charts',
      'Mobile Optimization and Export Features',
      'AI-Driven Insights and Recommendations',
      'Team Collaboration Features'
    ]
  }
];

export default function AboutProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const StatusBadge = ({ status }: { status: 'completed' | 'in-progress' | 'planned' }) => {
    const config = {
      completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
      'in-progress': { color: 'bg-yellow-100 text-yellow-700', label: 'In Progress' },
      planned: { color: 'bg-gray-100 text-gray-700', label: 'Planned' }
    };

    const { color, label } = config[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="bg-whitesmoke min-h-screen">
      <Header />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 bg-sandy-yellow/10 px-4 py-2 rounded-full">
              <Play className="w-4 h-4 text-sandy-yellow" />
              <span className="font-medium text-ebony-clay text-sm">Sample Demo Project</span>
            </div>
            
            <h1 className="font-freight-neo-pro font-bold text-ebony-clay text-4xl md:text-5xl">
              🎬 YouTube Analytics Dashboard
            </h1>
            
            <p className="mx-auto max-w-3xl text-gray-600 text-xl">
              A full-stack web application prototype designed to demonstrate scalable, modern analytics architecture. 
              Built with <strong>Next.js 15</strong>, <strong>TypeScript</strong>, and <strong>PostgreSQL</strong>.
            </p>

            <div className="flex justify-center items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">Production Ready</span>
              </div>
            </div>
          </div>

          {/* Core Objectives */}
          <div className="bg-white p-8 border border-gray-200 rounded-xl">
            <h2 className="mb-6 font-bold text-ebony-clay text-2xl">Core Objectives</h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Creator-Focused Dashboard</h3>
                  <p className="text-gray-600 text-sm">Deliver a responsive, intuitive dashboard for YouTube creators</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Authentication</h3>
                  <p className="text-gray-600 text-sm">Implement secure Google OAuth 2.0 authentication</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Analytics</h3>
                  <p className="text-gray-600 text-sm">Integrate with YouTube Analytics API for real-time metrics</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Scalable Architecture</h3>
                  <p className="text-gray-600 text-sm">Demonstrate modern web standards and best practices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white p-8 border border-gray-200 rounded-xl">
            <h2 className="mb-6 font-bold text-ebony-clay text-2xl">Technology Stack</h2>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {techStack.map((tech, index) => (
                <div key={index} className="hover:shadow-md p-4 border border-gray-200 rounded-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${tech.color} text-white`}>
                      {tech.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{tech.category}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{tech.tools}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white p-8 border border-gray-200 rounded-xl">
            <h2 className="mb-6 font-bold text-ebony-clay text-2xl">Key Features</h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-sandy-yellow/10 p-2 rounded-lg">
                      <div className="text-sandy-yellow">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <StatusBadge status={feature.status} />
                      </div>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Timeline */}
          <div className="bg-white p-8 border border-gray-200 rounded-xl">
            <h2 className="flex items-center gap-2 mb-6 font-bold text-ebony-clay text-2xl">
              <Calendar className="w-6 h-6" />
              Development Timeline
            </h2>
            <div className="space-y-6">
              {timeline.map((phase, index) => (
                <div key={index} className="pl-6 border-sandy-yellow border-l-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{phase.phase}</h3>
                    <span className="bg-sandy-yellow/10 px-3 py-1 rounded-full font-medium text-sandy-yellow text-sm">
                      {phase.duration}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Future Enhancements */}
          <div className="bg-white p-8 border border-gray-200 rounded-xl">
            <h2 className="mb-6 font-bold text-ebony-clay text-2xl">Future Enhancements</h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="mt-1 w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
                    <p className="text-gray-600 text-sm">Predictive models and enhanced data visualization</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="mt-1 w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI-Assisted Insights</h3>
                    <p className="text-gray-600 text-sm">Trend forecasting and keyword recommendations</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="mt-1 w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Collaboration Tools</h3>
                    <p className="text-gray-600 text-sm">Multi-user workspaces and role-based access</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Globe className="mt-1 w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Integration Ecosystem</h3>
                    <p className="text-gray-600 text-sm">Google Analytics, social media, and CRM sync</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="bg-white p-8 border border-gray-200 rounded-xl">
            <h2 className="flex items-center gap-2 mb-6 font-bold text-ebony-clay text-2xl">
              <Shield className="w-6 h-6" />
              Security & Compliance
            </h2>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[
                'AES-256 encryption at rest',
                'TLS 1.3 in transit',
                'OAuth 2.0 with PKCE',
                'JWT authentication',
                'Role-based authorization',
                'GDPR / CCPA ready',
                'Input validation (Zod)',
                'Rate limiting middleware',
                'Secure headers & CORS'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Credits */}
          <div className="bg-ebony-clay p-8 rounded-xl text-center">
            <h2 className="mb-4 font-bold text-white text-2xl">Project Credits</h2>
            <div className="space-y-2 text-white/90">
              <p><strong>Developer:</strong> Ian Cedric R. Ramirez</p>
              <p><strong>Role:</strong> Full Stack Developer / System Architect</p>
              <p><strong>Duration:</strong> Approx. 2 weeks (from prototype to evaluated build)</p>
              <p><strong>Tools:</strong> VS Code, Docker Desktop, GitHub, Prometheus / Grafana</p>
            </div>
            <div className="mt-6 pt-6 border-white/20 border-t">
              <p className="text-white/80 italic">
                This demo project serves as a proof of capability—showcasing architectural discipline, 
                full-stack integration, and technical breadth suitable for professional portfolio presentation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}