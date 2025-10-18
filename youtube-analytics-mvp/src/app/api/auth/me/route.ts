/**
 * Route: /api/auth/me
 * Purpose: Get current authenticated user information.
 * Method: GET
 * Auth: Requires JWT token
 * Response:
 *   200 → { success: true, user: object }
 *   401 → { success: false, error: "Unauthorized" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const userPayload = authenticateRequest(request);
    
    if (!userPayload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return user information
    return NextResponse.json({
      success: true,
      user: {
        id: userPayload.userId,
        email: userPayload.email,
        name: userPayload.name,
        isAdmin: userPayload.isAdmin
      }
    });

  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}