/**
 * Route: /api/metrics/[userId]
 * Purpose: Get YouTube metrics for a specific user.
 * Method: GET
 * Auth: Requires JWT token
 * Response:
 *   200 → { success: true, metrics: object }
 *   401 → { success: false, error: "Unauthorized" }
 *   404 → { success: false, error: "User not found" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateRequest } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params in Next.js 15
    const { userId } = await params;
    
    // Authenticate request
    const userPayload = authenticateRequest(request);
    
    if (!userPayload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the authenticated user is requesting their own data or is admin
    if (userPayload.userId !== userId && !userPayload.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get the latest metrics for the user
    const latestMetrics = await prisma.channelMetrics.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (!latestMetrics) {
      return NextResponse.json(
        { success: false, error: 'No metrics found for user' },
        { status: 404 }
      );
    }

    // Get previous month's metrics for comparison
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const previousMetrics = await prisma.channelMetrics.findFirst({
      where: { 
        userId,
        date: {
          lte: previousMonth
        }
      },
      orderBy: { date: 'desc' },
    });

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number | null): string => {
      if (!previous || previous === 0) return '+0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const metrics = {
      views: latestMetrics.views,
      subscribers: latestMetrics.subscribers,
      watchTime: latestMetrics.watchTime,
      revenue: latestMetrics.revenue || 0,
      date: latestMetrics.date,
      changes: {
        views: calculateChange(latestMetrics.views, previousMetrics?.views || null),
        subscribers: calculateChange(latestMetrics.subscribers, previousMetrics?.subscribers || null),
        watchTime: calculateChange(latestMetrics.watchTime, previousMetrics?.watchTime || null),
        revenue: calculateChange(latestMetrics.revenue || 0, previousMetrics?.revenue || null),
      }
    };

    return NextResponse.json({
      success: true,
      metrics
    });

  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}