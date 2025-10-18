/**
 * Component: components/LoginButton.tsx
 * Purpose: Login button for authentication.
 * Props: None
 */

'use client';

import { Button } from './Button';

export function LoginButton() {
  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login clicked');
  };

  return (
    <Button variant="primary" onClick={handleLogin}>
      Login
    </Button>
  );
}