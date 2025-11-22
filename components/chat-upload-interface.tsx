'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, Copy } from 'lucide-react';
import type { ChatData } from '@/types/chat';

interface ChatUploadInterfaceProps {
  onChatAnalyzed: (data: ChatData) => void;
}

export function ChatUploadInterface({ onChatAnalyzed }: ChatUploadInterfaceProps) {
  const [chatText, setChatText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const parseChat = (text: string): ChatData => {
    const lines = text.trim().split('\n');
    const messages = lines
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        // Try to parse common chat formats
        const match = line.match(/^(.+?):\s*(.+)$/);
        if (match) {
          return { speaker: match[1], message: match[2] };
        }
        return { speaker: 'Unknown', message: line };
      });

    if (messages.length === 0) {
      throw new Error('No messages found in the chat');
    }

    // Get the most frequent speaker as the main person
    const speakerCount = messages.reduce(
      (acc, msg) => {
        acc[msg.speaker] = (acc[msg.speaker] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mainSpeaker = Object.entries(speakerCount).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    return {
      messages,
      mainSpeaker,
      messageCount: messages.length,
      uploadedAt: new Date().toISOString(),
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsAnalyzing(true);

    try {
      const text = await file.text();
      setChatText(text);
      setUploadedFileName(file.name);
    } catch (err) {
      setError('Failed to read file. Please try a text-based file format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (!chatText.trim()) {
      setError('Please paste chat text or upload a file');
      return;
    }

    try {
      const chatData = parseChat(chatText);
      onChatAnalyzed(chatData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to analyze chat'
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chatText);
    } catch (err) {
      setError('Failed to copy text');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Analyze Your Chat
        </h2>
        <p className="text-muted-foreground">
          Paste chat text or upload a file to create a bot that responds like
          the main speaker
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Text Input */}
        <Card className="p-6 flex flex-col bg-card border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Chat Text</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Paste your chat conversation here
          </p>
          <textarea
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            placeholder={`Example format:\nAlice: Hey, how are you?\nBob: I'm doing great!\nAlice: That's awesome!`}
            className="flex-1 p-4 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="gap-2"
              disabled={!chatText}
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button
              onClick={() => setChatText('')}
              variant="ghost"
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </Card>

        {/* Right: File Upload */}
        <Card className="p-6 flex flex-col bg-card border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Upload File
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a chat file (TXT, PDF, or ZIP)
          </p>

          <label className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.pdf,.zip"
              className="hidden"
              disabled={isAnalyzing}
            />
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                TXT, PDF, or ZIP
              </p>
            </div>
          </label>

          {uploadedFileName && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-semibold">File:</span> {uploadedFileName}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Analyze Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={!chatText.trim() || isAnalyzing}
          className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Chat'}
        </Button>
      </div>
    </div>
  );
}
