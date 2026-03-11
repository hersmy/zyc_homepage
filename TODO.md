# Task: 创建张亦弛的个人主页

## Plan
- [x] 基础配置与样式设定
  - [x] 更新 `src/index.css` 定义深蓝色科技感主题色
  - [x] 更新 `tailwind.config.js` 扩展颜色系统
- [x] 页面基础架构
  - [x] 创建 `src/components/layout/Layout.tsx` 布局组件
  - [x] 更新 `src/routes.tsx` 配置主页路由
- [x] 核心内容组件实现
  - [x] 实现 `src/components/sections/Hero.tsx` (个人头像与简介)
  - [x] 实现 `src/components/sections/Profile.tsx` (学习、兴趣、愿景展示)
  - [x] 实现 `src/components/sections/ChatBot.tsx` (数字分身聊天机器人)
- [x] 页面整合与优化
  - [x] 在 `src/pages/Home.tsx` 中整合所有 Section
  - [x] 图片资源搜索与替换 (头像、背景等)
  - [x] 响应式适配与动效添加 (Framer Motion)
- [x] 最终检查
  - [x] 运行 lint 修复问题
  - [x] 确保手机端显示正常

## Notes
- 风格：简约、清爽、科技感。
- 色调：深蓝 (#1e3a8a) & 白色。
- 聊天机器人：本地逻辑实现，支持预设问答。
