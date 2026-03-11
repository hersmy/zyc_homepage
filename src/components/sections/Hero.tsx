import React from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Github, Linkedin, MessageSquare } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl mb-8">
              <AvatarImage src="https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_4b864b27-1352-4e4f-afe9-98f75c21867b.jpg" alt="张亦弛" />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">张</AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">研一在读</Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-blue-500/10 text-blue-500 border-blue-500/20">AI 探索者</Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              我是 <span className="gradient-text">张亦弛</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              一个正在自学 AI 并希望能找到相关实习工作的研一学生。致力于将 AI 技术转化为实用产品，探索技术的边界。
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95">
                <MessageSquare className="w-5 h-5" />
                与我聊天
              </a>
              <div className="flex gap-4 items-center">
                <a href="#" className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-primary">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-primary">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-primary">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
