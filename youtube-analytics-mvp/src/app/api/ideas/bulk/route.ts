/**
 * Route: /api/ideas/bulk
 * Purpose: Handle bulk operations on ideas (reorder, batch update, batch delete).
 * Methods: PATCH (bulk update), POST (batch operations)
 * Auth: Requires valid JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/jwt';
import { z } from 'zod';

// Validation schemas
const bulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID required'),
  data: z.object({
    tags: z.array(z.string()).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED', 'DELETED']).optional()
  })
});

const bulkReorderSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    position: z.number().int().min(1)
  })).min(1, 'At least one position update required')
});

const batchOperationSchema = z.object({
  operation: z.enum(['delete', 'archive', 'activate', 'complete']),
  ids: z.array(z.string()).min(1, 'At least one ID required')
});

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(request);
    if (!authResult) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const userId = authResult.userId;
    const body = await request.json();

    // Check if this is a reorder operation
    if ('updates' in body) {
      const validation = bulkReorderSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { 
            error: { 
              code: 'VALIDATION_ERROR', 
              message: 'Invalid reorder data',
              details: validation.error.issues 
            } 
          },
          { status: 400 }
        );
      }

      const { updates } = validation.data;

      // Verify all ideas belong to the user
      const ideaIds = updates.map(u => u.id);
      const existingIdeas = await prisma.idea.findMany({
        where: {
          id: { in: ideaIds },
          userId
        },
        select: { id: true }
      });

      if (existingIdeas.length !== ideaIds.length) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Some ideas not found' } },
          { status: 404 }
        );
      }

      // Update positions in a transaction
      await prisma.$transaction(async (tx: any) => {
        for (const update of updates) {
          await tx.idea.update({
            where: { id: update.id },
            data: { position: update.position }
          });
        }
      });

      return NextResponse.json({ message: 'Ideas reordered successfully' });
    }

    // Regular bulk update
    const validation = bulkUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid bulk update data',
            details: validation.error.issues 
          } 
        },
        { status: 400 }
      );
    }

    const { ids, data } = validation.data;

    // Verify all ideas belong to the user
    const existingIdeas = await prisma.idea.findMany({
      where: {
        id: { in: ids },
        userId
      },
      select: { id: true }
    });

    if (existingIdeas.length !== ids.length) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Some ideas not found' } },
        { status: 404 }
      );
    }

    // Update the ideas
    const updatedCount = await prisma.idea.updateMany({
      where: {
        id: { in: ids },
        userId
      },
      data
    });

    return NextResponse.json({ 
      message: `${updatedCount.count} ideas updated successfully`,
      updatedCount: updatedCount.count 
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to perform bulk update' } },
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

    const userId = authResult.userId;
    const body = await request.json();

    // Validate request body
    const validation = batchOperationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid batch operation data',
            details: validation.error.issues 
          } 
        },
        { status: 400 }
      );
    }

    const { operation, ids } = validation.data;

    // Verify all ideas belong to the user
    const existingIdeas = await prisma.idea.findMany({
      where: {
        id: { in: ids },
        userId
      },
      select: { id: true }
    });

    if (existingIdeas.length !== ids.length) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Some ideas not found' } },
        { status: 404 }
      );
    }

    let updateData: any = {};
    let message = '';

    switch (operation) {
      case 'delete':
        updateData = { status: 'DELETED' };
        message = 'Ideas moved to trash';
        break;
      case 'archive':
        updateData = { status: 'ARCHIVED' };
        message = 'Ideas archived';
        break;
      case 'activate':
        updateData = { status: 'ACTIVE' };
        message = 'Ideas activated';
        break;
      case 'complete':
        updateData = { status: 'COMPLETED' };
        message = 'Ideas marked as completed';
        break;
      default:
        return NextResponse.json(
          { error: { code: 'INVALID_OPERATION', message: 'Invalid operation' } },
          { status: 400 }
        );
    }

    // Perform the batch operation
    const updatedCount = await prisma.idea.updateMany({
      where: {
        id: { in: ids },
        userId
      },
      data: updateData
    });

    return NextResponse.json({ 
      message: `${message}: ${updatedCount.count} ideas affected`,
      updatedCount: updatedCount.count 
    });

  } catch (error) {
    console.error('Batch operation error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to perform batch operation' } },
      { status: 500 }
    );
  }
}