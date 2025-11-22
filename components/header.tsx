'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO + TITLE */}
        <div className="flex items-center gap-3">
          <Image 
            src="/talk-like-u-icon.png" 
            alt="Talk Like U Logo" 
            width={40} 
            height={40} 
            priority
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Talk Like U</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, <span className="font-semibold">{username}</span>
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <Button onClick={onLogout} variant="outline" className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
