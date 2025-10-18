/**
 * Route: /api/ideas/[id]
 * Purpose: Handle individual idea operations (GET, PUT, PATCH, DELETE).
 * Methods: GET (single), PUT (update), PATCH (partial update), DELETE (remove)
 * Auth: Requires valid JWT token and idea ownership
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/jwt';
import { z } from 'zod';

// Validation schemas
const updateIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED', 'DELETED']).optional(),
  position: z.number().int().optional()
});

const reorderSchema = z.object({
  newPosition: z.number().int().min(1)
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = authResult.userId;

    // Find the idea
    const idea = await prisma.idea.findFirst({
      where: {
        id,
        userId // Ensure user can only access their own ideas
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

    if (!idea) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Idea not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ idea });

  } catch (error) {
    console.error('Idea GET error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch idea' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = authResult.userId;
    const body = await request.json();

    // Validate request body
    const validation = updateIdeaSchema.safeParse(body);
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

    // Check if idea exists and belongs to user
    const existingIdea = await prisma.idea.findFirst({
      where: { id, userId }
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Idea not found' } },
        { status: 404 }
      );
    }

    // Update the idea
    const idea = await prisma.idea.update({
      where: { id },
      data: validation.data,
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

    return NextResponse.json({ idea });

  } catch (error) {
    console.error('Idea PUT error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update idea' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = authResult.userId;
    const body = await request.json();

    // Check for reorder operation
    if ('newPosition' in body) {
      const reorderValidation = reorderSchema.safeParse(body);
      if (!reorderValidation.success) {
        return NextResponse.json(
          { 
            error: { 
              code: 'VALIDATION_ERROR', 
              message: 'Invalid reorder data',
              details: reorderValidation.error.issues 
            } 
          },
          { status: 400 }
        );
      }

      const { newPosition } = reorderValidation.data;

      // Get current idea
      const currentIdea = await prisma.idea.findFirst({
        where: { id, userId }
      });

      if (!currentIdea) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Idea not found' } },
          { status: 404 }
        );
      }

      // Update positions in a transaction
      await prisma.$transaction(async (tx: any) => {
        const oldPosition = currentIdea.position;
        
        if (newPosition > oldPosition) {
          // Moving down: shift ideas up
          await tx.idea.updateMany({
            where: {
              userId,
              position: {
                gt: oldPosition,
                lte: newPosition
              }
            },
            data: {
              position: {
                decrement: 1
              }
            }
          });
        } else if (newPosition < oldPosition) {
          // Moving up: shift ideas down
          await tx.idea.updateMany({
            where: {
              userId,
              position: {
                gte: newPosition,
                lt: oldPosition
              }
            },
            data: {
              position: {
                increment: 1
              }
            }
          });
        }

        // Update the current idea's position
        await tx.idea.update({
          where: { id },
          data: { position: newPosition }
        });
      });

      const updatedIdea = await prisma.idea.findUnique({
        where: { id },
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

      return NextResponse.json({ idea: updatedIdea });
    }

    // Regular partial update
    const validation = updateIdeaSchema.safeParse(body);
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

    // Check if idea exists and belongs to user
    const existingIdea = await prisma.idea.findFirst({
      where: { id, userId }
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Idea not found' } },
        { status: 404 }
      );
    }

    // Update the idea
    const idea = await prisma.idea.update({
      where: { id },
      data: validation.data,
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

    return NextResponse.json({ idea });

  } catch (error) {
    console.error('Idea PATCH error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update idea' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = authResult.userId;

    // Check if idea exists and belongs to user
    const existingIdea = await prisma.idea.findFirst({
      where: { id, userId }
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Idea not found' } },
        { status: 404 }
      );
    }

    // Soft delete by updating status
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      // Hard delete - completely remove from database
      await prisma.idea.delete({
        where: { id }
      });

      // Adjust positions of remaining ideas
      await prisma.idea.updateMany({
        where: {
          userId,
          position: {
            gt: existingIdea.position
          }
        },
        data: {
          position: {
            decrement: 1
          }
        }
      });

      return NextResponse.json({ message: 'Idea permanently deleted' });
    } else {
      // Soft delete - mark as deleted
      const idea = await prisma.idea.update({
        where: { id },
        data: { status: 'DELETED' },
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

      return NextResponse.json({ idea, message: 'Idea moved to trash' });
    }

  } catch (error) {
    console.error('Idea DELETE error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete idea' } },
      { status: 500 }
    );
  }
}