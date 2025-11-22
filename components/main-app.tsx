'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Header } from '@/components/header';
import { ChatUploadInterface } from '@/components/chat-upload-interface';
import { ChatBotInterface } from '@/components/chatbot-interface';
import type { ChatData } from '@/types/chat';

interface MainAppProps {
  username: string;
  onLogout: () => void;
}

export default function MainApp({ username, onLogout }: MainAppProps) {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [showBot, setShowBot] = useState(false);

  const handleChatAnalyzed = (data: ChatData) => {
    setChatData(data);
    setShowBot(true);
  };

  const handleReset = () => {
    setChatData(null);
    setShowBot(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Header username={username} onLogout={onLogout} />
      
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!showBot ? (
          <ChatUploadInterface onChatAnalyzed={handleChatAnalyzed} />
        ) : (
          <ChatBotInterface 
            chatData={chatData!} 
            onReset={handleReset}
            username={username}
          />
        )}
      </main>
    </div>
  );
}
