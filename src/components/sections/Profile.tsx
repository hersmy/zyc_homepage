import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Compass, Target } from 'lucide-react';

const Profile: React.FC = () => {
  const profileData = [
    {
      title: '当前学习内容',
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      items: [
        '学习 openclaw，探索开源代码抓取和 AI 代理相关能力',
        '学习 vibe coding，提升把想法快速做成产品的能力',
        '学习 AI 基础知识，包括模型原理、应用方式和落地方法',
        '学习产品制作，让技术真正变成可用的工具',
      ],
      bg: 'bg-primary/5',
    },
    {
      title: '兴趣方向',
      icon: <Compass className="w-6 h-6 text-blue-500" />,
      items: [
        'AI 应用：关注如何用 AI 解决实际问题',
        '旅行：喜欢接触不同环境和新的体验',
        '运动：通过锻炼保持稳定的精力和状态',
      ],
      bg: 'bg-blue-500/5',
    },
    {
      title: '特点与愿景',
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      content:
        '作为一名正在成长中的学生，我对 AI 有持续的热情，也希望通过不断学习与实践，把技术做成真正有价值的产品。',
      bg: 'bg-indigo-500/5',
    },
  ];

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">探索 & 成长</h2>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-primary" />
        </motion.div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="mb-4 w-fit rounded-2xl bg-white p-3 shadow-md dark:bg-slate-800">
                    {section.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {section.items ? (
                    <ul className="space-y-4">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span className="leading-relaxed text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="border-l-4 border-primary/30 py-2 pl-4 italic leading-relaxed text-muted-foreground">
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
