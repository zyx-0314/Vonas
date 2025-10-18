/**
 * Route: /api/ideas
 * Purpose: Handle CRUD operations for Ideas/Notes.
 * Methods: GET (list), POST (create)
 * Auth: Requires valid JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/jwt';
import { z } from 'zod';

// Validation schemas
const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED', 'DELETED']).default('ACTIVE'),
  position: z.number().int().default(0)
});

const querySchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED', 'DELETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  tags: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'position', 'priority', 'title']).default('position'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validation = querySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
            details: validation.error.issues 
          } 
        },
        { status: 400 }
      );
    }

    const { status, priority, tags, search, sortBy, sortOrder, page, limit } = validation.data;
    const userId = authResult.userId;

    // Build where clause
    const where: any = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(tags && { tags: { hasSome: tags.split(',').map(tag => tag.trim()) } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } }
        ]
      })
    };

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch ideas with pagination
    const [ideas, totalCount] = await Promise.all([
      prisma.idea.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          tags: true,
          priority: true,
          status: true,
          position: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.idea.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      ideas,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Ideas GET error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch ideas' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validation = createIdeaSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid idea data',
            details: validation.error.issues 
          } 
        },
        { status: 400 }
      );
    }

    const { title, content, tags, priority, status, position } = validation.data;
    const userId = authResult.userId;

    // If position is 0, set it to the next available position
    let finalPosition = position;
    if (position === 0) {
      const maxPosition = await prisma.idea.findFirst({
        where: { userId, status: 'ACTIVE' },
        orderBy: { position: 'desc' },
        select: { position: true }
      });
      finalPosition = (maxPosition?.position || 0) + 1;
    }

    // Create the idea
    const idea = await prisma.idea.create({
      data: {
        userId,
        title,
        content,
        tags,
        priority,
        status,
        position: finalPosition
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        priority: true,
        status: true,
        position: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ idea }, { status: 201 });

  } catch (error) {
    console.error('Ideas POST error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create idea' } },
      { status: 500 }
    );
  }
}