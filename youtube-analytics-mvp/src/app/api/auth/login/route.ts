/**
 * Route: /api/auth/login
 * Purpose: Authenticate user with email and password, return JWT token.
 * Method: POST
 * Body: { email: string, password: string }
 * Response:
 *   200 → { success: true, token: string, user: object }
 *   401 → { success: false, error: "Invalid credentials" }
 *   400 → { success: false, error: "Missing email or password" }
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name || '',
      isAdmin: user.isAdmin
    });

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}