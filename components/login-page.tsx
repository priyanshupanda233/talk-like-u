'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { loginWithGoogle } from "@/lib/firebase";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    onLogin(username);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      onLogin(user.displayName || user.email || "User");
    } catch (err) {
      setError("Google login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border border-border/50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">
            TALK LIKE U
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            Sign in to start chatting like anyone you upload
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Sign In
          </Button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-border/40"></div>
          <span className="mx-3 text-muted-foreground text-sm">OR</span>
          <div className="flex-grow border-t border-border/40"></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 
              bg-red-500 hover:bg-red-600 text-white font-medium py-3 
              transform transition-all duration-200 hover:scale-[1.02]
              shadow-md hover:shadow-red-400/30 animate-slide-up"
        >
          {/* Google Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .1 8.2 2.5l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7L12 19c2.1-4.9 6.8-8 12-8 3.1 0 6 .1 8.2 2.5l5.7-5.7C34.3 6.1 29.4 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.6l-6.4-5.2c-2.1 1.7-4.9 2.8-7.6 2.8-5.3 0-9.8-3.4-11.3-8H4.1v8C7.7 39.8 15.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.8-3.7 5.2l6.4 5.2C40.1 34.5 44 29.1 44 24c0-1.3-.1-2.3-.4-3.5z"/>
          </svg>

          Continue with Google
        </Button>

        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Demo credentials: Any username and password (min 6 chars)
          </p>
        </div>
      </Card>
    </div>
  );
}
