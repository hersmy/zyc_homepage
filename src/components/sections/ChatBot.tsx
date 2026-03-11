import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是张亦弛的数字分身。你可以问我关于我的学习进度、兴趣方向或职业规划等任何问题。',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const knowledgeBase = [
    {
      keywords: ['你是谁', '谁', '身份', '名字'],
      response: '我是张亦弛的数字分身！张亦弛是一个正在自学 AI 并希望能找到相关实习工作的研一学生。',
    },
    {
      keywords: ['做什么', '学习', '在忙什么', '学习内容', '项目'],
      response: '张亦弛最近在学习 openclaw (一个 AI 爪取技术), vibe coding (创造性编程), AI 基础知识以及如何制作实际的产品。他正努力提升自己以适应 AI 时代的需求。',
    },
    {
      keywords: ['兴趣', '方向', '喜欢', '运动', '旅行'],
      response: '张亦弛对 AI 应用和 AI Agent 非常感兴趣。此外，他也很喜欢旅行和运动，这些能让他在学习之余保持身心愉悦。',
    },
    {
      keywords: ['实习', '工作', '职业', '求职'],
      response: '作为一个研一学生，他目前正积极寻找 AI 相关的实习机会。如果你有相关的机会或建议，非常欢迎通过页面上的联系方式联系他。',
    },
    {
      keywords: ['目标', '愿景', '财务自由', '自由'],
      response: '张亦弛的最终目标是实现财务自由。他相信通过 AI 技术的学习和应用，能够创造价值并最终获得身体和时间的自由。',
    },
    {
      keywords: ['联系', '微信', '电话', '邮箱', '找你'],
      response: '你可以通过页面顶部的图标找到我的社交账号，或者直接发送邮件。当然，在这里和我聊天也是了解我的好方式！',
    },
  ];

  const processMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = '这是一个好问题！不过作为一个数字分身，我的知识库还在不断扩充中。简单来说，张亦弛正专注于 AI 学习，努力通过项目实践来提升自己。如果你想了解更多，可以问问我“最近在学习什么”或“未来的目标”。';
      
      const lowerInput = text.toLowerCase();
      for (const item of knowledgeBase) {
        if (item.keywords.some(k => lowerInput.includes(k))) {
          responseContent = item.response;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    processMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    processMessage(question);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const quickQuestions = [
    "你最近在做什么？",
    "你的兴趣方向是什么？",
    "如何联系你？",
    "你的职业规划是怎样的？"
  ];

  return (
    <div id="contact" className="w-full max-w-4xl mx-auto mt-12 mb-20 scroll-mt-24">
      <Card className="border-none shadow-2xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800">
        <CardHeader className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 rounded-full bg-primary/20">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <CardTitle className="text-xl">张亦弛的数字分身</CardTitle>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs text-muted-foreground">由 AI 预设逻辑驱动</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMessages([messages[0]])} title="重置对话">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea ref={scrollRef} className="h-[450px] md:h-[550px] px-4 py-6">
            <div className="space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 border border-border rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex gap-1.5 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-border rounded-tl-none">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex flex-col p-4 border-t border-border bg-muted/30 gap-4">
          <div className="flex flex-wrap gap-2 w-full">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                className="text-xs bg-white dark:bg-slate-800 hover:bg-primary/10 hover:text-primary border border-border px-3 py-1.5 rounded-full transition-all text-muted-foreground"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题..."
              className="flex-grow rounded-full border-border bg-white dark:bg-slate-800 h-12 px-6"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-full p-0 flex items-center justify-center transition-transform active:scale-90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatBot;
