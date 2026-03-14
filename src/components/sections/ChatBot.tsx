import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
  variant?: 'inline' | 'floating';
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const initialAssistantMessage: Message = {
  id: '1',
  role: 'assistant',
  content: '你好！我是张亦弛的数字分身。你可以问我关于我的学习进度、兴趣方向、项目尝试或联系方式。',
  timestamp: new Date(),
};

const quickQuestions = [
  '你最近在做什么？',
  '你的兴趣方向是什么？',
  '如何联系你？',
  '你的职业规划是怎样的？',
];

const ChatBot: React.FC<ChatBotProps> = ({
  className = '',
  variant = 'inline',
  defaultOpen = false,
  open,
  onOpenChange,
}) => {
  const [messages, setMessages] = useState<Message[]>([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const processMessage = async (text: string) => {
    if (!text.trim() || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : '数字分身服务暂时不可用，请稍后再试。'
        );
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          typeof data?.message === 'string' && data.message.trim()
            ? data.message.trim()
            : '这次我没拿到有效回复，你可以再问一次。',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error
            ? `抱歉，这次调用大模型失败了：${error.message}`
            : '抱歉，这次调用大模型失败了，请稍后再试。',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    void processMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    void processMessage(question);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const scrollAreaClass =
    variant === 'floating'
      ? 'h-[200px] px-4 py-3 sm:h-[240px] lg:h-[min(56vh,420px)]'
      : 'h-[250px] px-4 py-3 md:h-[280px]';

  const cardClass =
    variant === 'floating'
      ? 'overflow-hidden border border-white/30 bg-white/80 shadow-lg backdrop-blur-xl max-h-[76vh] lg:max-h-none dark:border-slate-800 dark:bg-slate-900/60'
      : 'overflow-hidden border border-white/30 bg-white/75 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60';

  const cardNode = (
    <Card className={cardClass}>
      <CardHeader className="border-b border-border bg-primary/5 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div className="rounded-full bg-primary/20 p-2.5">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-900" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg md:text-xl">张亦弛的数字分身</CardTitle>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs text-muted-foreground">由 AI 大模型驱动</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setMessages([initialAssistantMessage])} title="重置对话">
              <RefreshCw className="h-4 w-4" />
            </Button>
            {variant === 'floating' ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                title="关闭窗口"
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea ref={scrollRef} className={scrollAreaClass}>
          <div className="space-y-5">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[92%] gap-3 sm:max-w-[85%] lg:max-w-[78%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm md:text-base ${
                      msg.role === 'user'
                        ? 'rounded-tr-none bg-primary text-primary-foreground'
                        : 'rounded-tl-none border border-border bg-white dark:bg-slate-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex gap-1.5 rounded-2xl rounded-tl-none border border-border bg-white px-4 py-3 dark:bg-slate-800">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/30" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/30" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/30" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border bg-muted/30 p-3">
        <div className="flex w-full flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q)}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-[11px] text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary sm:text-xs dark:bg-slate-800"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="h-11 flex-grow rounded-full border-border bg-white px-5 dark:bg-slate-800"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-11 w-11 items-center justify-center rounded-full p-0 transition-transform active:scale-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  if (variant === 'inline') {
    return (
      <div id="contact" className={`mx-auto mb-2 mt-2 w-full max-w-4xl scroll-mt-24 ${className}`.trim()}>
        {cardNode}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="关闭数字分身"
              className="fixed inset-0 z-40 bg-black/10 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="contact"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`fixed inset-x-3 bottom-4 z-50 mx-auto w-auto max-w-[360px] lg:inset-x-auto lg:right-6 lg:top-24 lg:bottom-auto lg:w-[400px] ${className}`.trim()}
            >
              {cardNode}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {!isOpen ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={() => setOpen(true)}
          className={`fixed right-4 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-white/90 text-primary shadow-lg backdrop-blur md:h-16 md:w-16 lg:right-6 lg:top-24 lg:bottom-auto ${className}`.trim()}
          aria-label="打开数字分身"
        >
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-primary/8">
            <Bot className="h-7 w-7" />
            <span className="absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full border border-white bg-green-500" />
          </div>
        </motion.button>
      ) : null}
    </>
  );
};

export default ChatBot;
