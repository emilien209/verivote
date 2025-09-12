'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFaqAnswer } from './actions';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am the VeriVote FAQ assistant. How can I help you today with questions about registration, deadlines, or results?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await getFaqAnswer(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.success ? (result.data || 'I am sorry, I could not find an answer.') : result.error,
      };
      setMessages(prev => [...prev, assistantMessage]);
    });
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg px-4 py-2 sm:max-w-md',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User size={18} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isPending && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8">
                 <AvatarFallback><Bot size={18} /></AvatarFallback>
              </Avatar>
              <div className="bg-muted px-4 py-2 rounded-lg flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
