import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Compass, Heart, Rocket, Target, Globe } from 'lucide-react';

const Profile: React.FC = () => {
  const profileData = [
    {
      title: "当前学习内容",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      items: [
        "学习 openclaw，探索开放源代码的爪取和 AI 代理技术",
        "学习 vibe coding，追求灵感驱动的编程和创造",
        "学习 AI 基础知识，包括深度学习和大型语言模型原理",
        "学习制作产品，将 AI 想法落地为可交互的工具"
      ],
      bg: "bg-primary/5"
    },
    {
      title: "兴趣方向",
      icon: <Compass className="w-6 h-6 text-blue-500" />,
      items: [
        "AI 应用：关注如何用 AI 解决日常生活和工作中的实际问题",
        "旅行：喜欢探索世界，感受不同文化和自然风光",
        "运动：通过锻炼保持充沛的精力去应对挑战"
      ],
      bg: "bg-blue-500/5"
    },
    {
      title: "特色与愿景",
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      content: "作为一个研一学生，我怀揣着对 AI 的极高热情。我的最终目标是希望能实现财务自由，从而获得身体和思想的绝对自由，去探索更广阔的世界。",
      bg: "bg-indigo-500/5"
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">探索 & 成长</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {profileData.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className={`h-full border-none shadow-xl ${section.bg} backdrop-blur-sm`}>
                <CardHeader className="pb-4">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 w-fit shadow-md mb-4">
                    {section.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {section.items ? (
                    <ul className="space-y-4">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-4 py-2">
                      {section.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;
