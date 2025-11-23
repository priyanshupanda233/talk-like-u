'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import type { ChatData, Message } from '@/types/chat';

interface ChatBotInterfaceProps {
  chatData: ChatData;
  onReset: () => void;
  username: string;
}

export function ChatBotInterface({
  chatData,
  onReset,
  username,
}: ChatBotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      speaker: chatData.mainSpeaker,
      message: `TALK LIKE U is now analyzing your chat with ${chatData.mainSpeaker}. Ask anything!`,
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const userLower = userMessage.toLowerCase();
    const chatMessages = chatData.messages;

    const relatedMessages = chatMessages.filter((msg) =>
      msg.message.toLowerCase().includes(userLower.split(' ')[0])
    );

    if (relatedMessages.length > 0) {
      const mainSpeakerMessages = relatedMessages.filter(
        (msg) => msg.speaker === chatData.mainSpeaker
      );
      if (mainSpeakerMessages.length > 0) {
        return mainSpeakerMessages[
          Math.floor(Math.random() * mainSpeakerMessages.length)
        ].message;
      }
    }

    const genericResponses = [
      "That's interesting! Here's what I think...",
      "You know, I really enjoy talking about that.",
      "I feel pretty strongly about that topic.",
      "That's something I've been thinking about too.",
      "Good point! Let me share my view...",
    ];

    return genericResponses[
      Math.floor(Math.random() * genericResponses.length)
    ];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      speaker: username,
      message: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
     const res = await fetch("https://<your-render-backend>.onrender.com/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessage.message,
          chatData,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const data = await res.json();

      const botResponse: Message = {
        speaker: chatData.mainSpeaker,
        message: data?.reply ?? "TALK LIKE U couldn’t generate a reply.",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err: any) {
      const errorMsg: Message = {
        speaker: chatData.mainSpeaker,
        message:
          err?.message ||
          'There was an error contacting TALK LIKE U AI server.',
      };
      setMessages((prev) => [...prev, errorMsg]);
      console.error('chat API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Chat with {chatData.mainSpeaker}
          </h2>
          <p className="text-sm text-muted-foreground">
            TALK LIKE U analyzed {chatData.messageCount} messages
          </p>
        </div>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Upload New Chat
        </Button>
      </div>

      <Card className="h-96 md:h-[500px] flex flex-col bg-card border-border/50">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.speaker === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.speaker === username
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-xs font-semibold mb-1">{msg.speaker}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/30 p-4 bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
              className="bg-card border-border"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
