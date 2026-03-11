import React from 'react';
import Hero from '@/components/sections/Hero';
import Profile from '@/components/sections/Profile';
import ChatBot from '@/components/sections/ChatBot';
import PageMeta from '@/components/common/PageMeta';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PageMeta title="张亦弛的个人主页" description="展示个人 profile 和提供数字分身聊天互动的个人主页" />
      
      <main className="flex-grow">
        <Hero />
        <Profile />
        <div className="container mx-auto px-4 py-12">
          <ChatBot />
        </div>
      </main>

      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2026 张亦弛的个人主页. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
