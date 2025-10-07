'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User, Send, Zap, Loader2 } from 'lucide-react';
import { getAiResponse } from '@/app/actions';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { SendAction } from '@/lib/types';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  action?: SendAction;
}

export default function AIChat() {
  const { address, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hello! I'm your Portfolio Copilot. How can I help you analyze your wallet today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExecuteAction = async (action: SendAction) => {
    toast({
      title: 'Executing Transaction...',
      description: `Sending ${action.amount} ${action.currency} to ${action.to.substring(0,6)}...`,
    });
    const success = await sendTransaction(action.to, parseFloat(action.amount));
    if (success) {
      toast({
        title: '✅ Transaction Successful',
        description: 'Your gasless transaction was completed via your Smart Account.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: '❌ Transaction Failed',
        description: 'There was an error processing your transaction.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !address) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { content, action } = await getAiResponse(input, address);
      const assistantMessage: Message = { id: Date.now() + 1, role: 'assistant', content, action };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[60vh] flex flex-col glassmorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot />
          AI Portfolio Analyst
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{message.content}</p>
                 {message.action?.type === 'SEND' && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-2 w-full bg-accent hover:bg-accent/80 text-accent-foreground"
                        onClick={() => handleExecuteAction(message.action as SendAction)}
                    >
                        <Zap className="mr-2 h-4 w-4" />
                        Execute: Send {message.action.amount} {message.action.currency}
                    </Button>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-3 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            </div>
           )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your portfolio..."
            className="flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
