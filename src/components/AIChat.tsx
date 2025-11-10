'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input as UiInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User, Send, Zap, Loader2 } from 'lucide-react';
import { getAiResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { SendAction } from '@/lib/types';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
});


interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  action?: SendAction;
}

interface AIChatProps {
  address: string;
}


export default function AIChat({ address }: AIChatProps) {
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
  
  const { chain } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExecuteAction = async (values: z.infer<typeof formSchema>) => {
    try {
      toast({
        title: 'Executing Transaction...',
        description: `Sending ${values.amount} MONAD to ${values.to.substring(0, 6)}...`,
      });

      const txHash = await sendTransactionAsync({
        to: values.to as `0x${string}`,
        value: parseEther(values.amount),
      });

      toast({
        title: '✅ Transaction Successful',
        description: `Transaction hash: ${txHash.substring(0, 10)}...`,
      });
      form.reset();

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: '❌ Transaction Failed',
        description: 'There was an error processing your transaction. Check the console for details.',
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
      if (action?.to) {
        form.setValue('to', action.to);
      }
      if(action?.amount) {
        form.setValue('amount', action.amount);
      }
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                 {message.action?.type === 'SEND' && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleExecuteAction)} className="mt-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="to"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Address</FormLabel>
                              <FormControl>
                                <UiInput placeholder="0x..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount ({chain?.nativeCurrency.symbol})</FormLabel>
                              <FormControl>
                                <UiInput placeholder="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
                            disabled={form.formState.isSubmitting}
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? 'Sending...' : `Execute: Send ${form.getValues('amount') || '...'} ${chain?.nativeCurrency.symbol || ''}`}
                        </Button>
                      </form>
                    </Form>
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
