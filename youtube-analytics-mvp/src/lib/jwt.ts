/**
 * Module: lib/jwt.ts
 * Purpose: JWT token utilities for authentication.
 * Functions:
 *   - signToken: Create JWT token
 *   - verifyToken: Verify JWT token
 *   - getTokenFromRequest: Extract token from request headers
 */

import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

/**
 * Sign a JWT token with user payload
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract JWT token from request headers or cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookies
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

/**
 * Verify request authentication and return user payload
 */
export function authenticateRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}