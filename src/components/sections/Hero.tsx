import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Github, X, Copy, Check } from 'lucide-react';

const contactInfo = {
  email: '2298831129@qq.com',
  githubUrl: 'https://github.com/hersmy',
  wechatQrImage: '/wechat-qr.png',
};

const iconButtonClass =
  'rounded-full bg-secondary p-3 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-primary';

type ContactModalType = 'email' | 'wechat' | null;

const WeChatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M8.6 4C4.96 4 2 6.53 2 9.64c0 1.8 1 3.4 2.57 4.45L4 16.9l2.82-1.52c.58.1 1.16.16 1.78.16.22 0 .44-.01.65-.03A5.82 5.82 0 0 1 9 13.9c0-3.11 2.96-5.64 6.6-5.64.14 0 .27 0 .4.02C15.42 5.8 12.3 4 8.6 4Zm-2.2 4.4a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76Zm4.4 0a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76Z" />
    <path d="M15.97 9.78c-3.06 0-5.53 2.06-5.53 4.6 0 1.42.8 2.74 2.14 3.6l-.44 2.02 2.2-1.2c.54.1 1.08.16 1.63.16 3.05 0 5.53-2.05 5.53-4.58 0-2.55-2.48-4.6-5.53-4.6Zm-1.83 3.7a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Zm3.66 0a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Z" />
  </svg>
);

const Hero: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ContactModalType>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    if (!activeModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModal(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal]);

  useEffect(() => {
    if (!emailCopied) return;

    const timer = window.setTimeout(() => setEmailCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [emailCopied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setEmailCopied(true);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-4 md:pt-10 md:pb-6">
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/2 rounded-full bg-blue-400/10 blur-2xl" />

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
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 px-3 py-1 text-primary">
              研一在读
            </Badge>
            <Badge variant="secondary" className="border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-500">
              AI 探索者
            </Badge>
          </div>

          <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-[3.25rem]">
            我是 <span className="gradient-text">张亦弛</span>
          </h1>

          <p className="mx-auto mb-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            一个正在学习用 AI agent的学生。
          </p>

          <div className="mx-auto mt-6 w-fit space-y-3 text-left">
            <p className="text-base font-bold tracking-wide text-foreground">联系我：</p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label="打开邮箱联系卡"
                  title={contactInfo.email}
                  className={iconButtonClass}
                  onClick={() => setActiveModal('email')}
                >
                  <Mail className="h-6 w-6" />
                </button>
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">Email</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <a
                  href={contactInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="打开 GitHub"
                  title="github.com/hersmy"
                  className={iconButtonClass}
                >
                  <Github className="h-6 w-6" />
                </a>
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">GitHub</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label="打开微信联系卡"
                  title="打开微信联系卡"
                  className={iconButtonClass}
                  onClick={() => setActiveModal('wechat')}
                >
                  <WeChatIcon className="h-6 w-6" />
                </button>
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">WeChat</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeModal ? (
          <>
            <motion.button
              type="button"
              aria-label="关闭联系卡"
              className="fixed inset-0 z-[70] bg-black/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed inset-x-3 top-1/2 z-[80] mx-auto w-auto max-w-[340px] -translate-y-1/2 md:left-1/2 md:inset-x-auto md:w-[min(92vw,360px)] md:-translate-x-1/2"
            >
              <div className="max-h-[82vh] overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {activeModal === 'email' ? '邮箱联系我' : '微信联系我'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {activeModal === 'email' ? '点击复制邮箱账号' : '扫码添加微信'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="关闭联系卡"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {activeModal === 'email' ? (
                  <div className="space-y-4 p-4 text-center">
                    <div className="rounded-2xl border border-border bg-white px-4 py-5">
                      <p className="mb-2 text-sm text-muted-foreground">邮箱账号</p>
                      <p className="break-all text-base font-medium text-foreground">{contactInfo.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {emailCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {emailCopied ? '已复制' : '复制邮箱'}
                    </button>
                  </div>
                ) : (
                  <div className="max-h-[calc(82vh-68px)] space-y-4 overflow-y-auto p-4 text-center">
                    <img
                      src={contactInfo.wechatQrImage}
                      alt="微信二维码"
                      className="mx-auto h-auto w-full max-w-[190px] rounded-2xl border border-border bg-white sm:max-w-[220px]"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">微信扫码联系我</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

export default Hero;