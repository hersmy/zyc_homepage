import React from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Github, Linkedin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-4 md:pt-10 md:pb-6">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />

      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl md:h-28 md:w-28">
              <AvatarImage src="/touxiang.jpg" alt="头像" />
              <AvatarFallback className="bg-primary text-3xl text-primary-foreground">张</AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="mb-3 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 px-3 py-1 text-primary">研一在读</Badge>
            <Badge variant="secondary" className="border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-500">AI 探索者</Badge>
          </div>

          <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-[3.25rem]">
            我是 <span className="gradient-text">张亦弛</span>
          </h1>

          <p className="mx-auto mb-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            一个正在学习用 AI agent的学生。
          </p>

          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              <a href="#" className="rounded-full bg-secondary p-3 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-primary">
                <Mail className="h-6 w-6" />
              </a>
              <a href="#" className="rounded-full bg-secondary p-3 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-primary">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="rounded-full bg-secondary p-3 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
