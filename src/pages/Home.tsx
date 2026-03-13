import React, { useEffect, useRef, useState } from 'react';
import Hero from '@/components/sections/Hero';
import Profile from '@/components/sections/Profile';
import ChatBot from '@/components/sections/ChatBot';
import PageMeta from '@/components/common/PageMeta';

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHeroPassed, setIsHeroPassed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const updateViewportState = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (heroRef.current) {
        const passed = heroRef.current.getBoundingClientRect().bottom <= 120;
        setIsHeroPassed(passed);
      }
    };

    updateViewportState();
    window.addEventListener('resize', updateViewportState);
    window.addEventListener('scroll', updateViewportState, { passive: true });

    return () => {
      window.removeEventListener('resize', updateViewportState);
      window.removeEventListener('scroll', updateViewportState);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsChatOpen(false);
      return;
    }

    if (!isHeroPassed) {
      setIsChatOpen(false);
    }
  }, [isMobile, isHeroPassed]);

  const effectiveChatOpen = isMobile ? isChatOpen : !isHeroPassed || isChatOpen;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PageMeta title="张亦弛的个人主页" description="一个展示个人 profile 和提供数字分身聊天互动的个人主页" />

      <main className="flex-grow">
        <div ref={heroRef}>
          <Hero />
        </div>
        <Profile />
        <ChatBot
          variant="floating"
          open={effectiveChatOpen}
          onOpenChange={setIsChatOpen}
          className="z-40"
        />
      </main>

      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2026 张亦弛的个人主页. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

