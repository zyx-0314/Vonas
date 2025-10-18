/**
 * Route: /api/auth/logout
 * Purpose: Logout user by clearing authentication token.
 * Method: POST
 * Response:
 *   200 → { success: true, message: "Logged out successfully" }
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response with cleared auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the auth-token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}