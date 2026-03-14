# 张亦弛个人主页 / AI 数字分身

这是一个基于 `Vite + React + TypeScript + Tailwind CSS` 的个人主页项目。

当前版本已经包含两部分核心能力：

1. 个人主页展示
2. 基于阿里千问接口的数字分身聊天

前端页面已经部署到 EdgeOne Pages，聊天接口使用 EdgeOne Functions 转发到千问模型；本地开发时也保留了一套 Node 代理，方便本机调试。

---

## 1. 这个项目现在能做什么

- 展示个人头像、简介、学习内容、兴趣方向、愿景与特点
- 提供 Email / GitHub / WeChat 联系方式
- 在桌面端和移动端展示悬浮式数字分身聊天窗
- 将用户问题发送给大模型，并根据预设提示词回答和“张亦弛本人”相关的问题
- 支持 EdgeOne Pages 部署和自定义域名绑定

---

## 2. 技术栈

- 前端：React 18、TypeScript、Vite
- 样式：Tailwind CSS、Radix UI、Lucide Icons
- 动效：motion
- 路由：react-router-dom
- 部署：EdgeOne Pages
- 大模型：阿里云 DashScope / 千问兼容接口

---

## 3. 本地开发怎么跑

### 3.1 环境要求

建议环境：

- Node.js 20+
- pnpm 10+

### 3.2 安装依赖

```powershell
corepack pnpm install
```

### 3.3 启动前端

```powershell
corepack pnpm dev:web
```

默认访问：

```text
http://127.0.0.1:5173
```

### 3.4 启动本地聊天代理（可选）

如果你要在本地调试数字分身聊天：

```powershell
corepack pnpm dev:api
```

本地代理默认运行在：

```text
http://127.0.0.1:8787
```

### 3.5 本地构建检查

```powershell
corepack pnpm exec vite build
```

注意：

- `package.json` 里的 `dev` 和 `build` 脚本被故意替换成提示语，不能直接用 `pnpm dev` 或 `pnpm build`
- 正确方式是用 `dev:web`、`dev:api`，或直接用 `vite build`

---

## 4. 环境变量说明

### 4.1 本地 Node 代理使用

文件：`.env.server.local`

示例：

```env
QWEN_API_KEY=你的真实千问 API Key
QWEN_MODEL=qwen-plus
CHAT_SERVER_PORT=8787
CHAT_SERVER_HOST=0.0.0.0
```

### 4.2 EdgeOne Pages 使用

在 EdgeOne 项目环境变量里配置：

- `QWEN_API_KEY`
- `QWEN_MODEL`

当前线上建议使用：

```text
QWEN_MODEL=qwen-plus
```

原因：`qwen3.5-plus` 在当前 EdgeOne Functions -> DashScope 这条链路上出现过超时，不适合直接作为线上默认模型。

### 4.3 安全注意事项

不要把以下文件提交到 Git 仓库：

- `.env.server.local`
- 任何包含真实 API Key 的 `.env` 文件

仓库里保留的 `.env.server.example` 只是模板，不应放真实密钥。

---

## 5. 目录与文件作用说明

下面按“根目录 -> 前端源码 -> 后端/部署 -> 静态资源”解释当前项目里主要文件的用途。

### 5.1 根目录文件

- `README.md`
  - 当前项目说明文档。
- `package.json`
  - 项目依赖、脚本、名称、版本等入口配置。
- `pnpm-lock.yaml`
  - pnpm 锁文件，部署平台会依赖它保证安装一致性。
- `pnpm-workspace.yaml`
  - pnpm 工作区配置。
- `index.html`
  - Vite 应用 HTML 入口。
- `vite.config.ts`
  - Vite 配置；包含 `@` 别名和本地 `/api` -> `127.0.0.1:8787` 的代理。
- `vite.config.dev.ts`
  - 额外的开发配置文件，目前不是主入口配置。
- `tailwind.config.js`
  - Tailwind 主题与扫描范围配置。
- `postcss.config.js`
  - PostCSS 配置。
- `tsconfig.json`
  - TypeScript 总配置。
- `tsconfig.app.json`
  - 前端应用 TS 配置。
- `tsconfig.node.json`
  - Node 侧 TS 配置。
- `tsconfig.check.json`
  - 检查 / lint 相关 TS 配置。
- `biome.json`
  - Biome 检查配置。
- `components.json`
  - UI 组件生成/管理配置。
- `.gitignore`
  - Git 忽略规则。
- `.env.server.example`
  - 本地服务端环境变量模板。
- `.env.server.local`
  - 本地服务端真实环境变量文件，仅本机使用，不应提交。
- `.env`
  - 前端环境变量文件；如果写敏感内容，应避免提交。
- `sgconfig.yml`
  - 项目工具相关配置文件，当前主页核心功能不依赖它理解。
- `TODO.md`
  - 项目待办记录。

### 5.2 根目录文件夹

- `.git/`
  - Git 仓库元数据。
- `.rules/`
  - 项目内检查脚本，`lint` 会调用它们。
- `.sync/`
  - 工具生成的同步目录，非主页业务核心。
- `dist/`
  - 构建产物目录，部署时由打包生成。
- `docs/`
  - 文档目录，目前可以用于后续补充说明书、提示词文档等。
- `node_modules/`
  - 本地依赖目录。
- `public/`
  - 静态资源目录。
- `src/`
  - 前端源码目录。
- `server/`
  - 本地 Node 代理目录。
- `edge-functions/`
  - EdgeOne Pages Functions 目录，线上聊天接口在这里。
- `node-functions/`
  - 旧的/未使用函数目录。当前线上不是走这里，后续可清理或保留作历史备份。

---

## 6. src 目录说明

### 6.1 前端入口文件

- `src/main.tsx`
  - React 挂载入口。
- `src/App.tsx`
  - 应用壳层；挂载路由、Toaster、交叉观察器等。
- `src/routes.tsx`
  - 路由表配置。
- `src/index.css`
  - 全局样式与 Tailwind 基础扩展。
- `src/global.d.ts`
  - 全局类型声明。
- `src/svg.d.ts`
  - SVG 导入类型声明。
- `src/vite-env.d.ts`
  - Vite 环境类型声明。

### 6.2 页面文件

- `src/pages/Home.tsx`
  - 主页主入口。
  - 负责拼装 `Hero`、`Profile`、`ChatBot`。
  - 负责控制数字分身在桌面/移动端的展开收起逻辑。
- `src/pages/NotFound.tsx`
  - 兜底 404 页面。

### 6.3 主页核心区块

- `src/components/sections/Hero.tsx`
  - 首页首屏。
  - 包含头像、名字、简介、联系方式、邮箱/微信联系卡弹窗。
- `src/components/sections/Profile.tsx`
  - “探索与成长”及其下面的卡片内容。
  - 主要承载学习内容、兴趣方向、特点与愿景等。
- `src/components/sections/ChatBot.tsx`
  - 数字分身聊天组件。
  - 包含消息列表、输入框、快捷问题、悬浮窗布局与移动端适配。

### 6.4 通用组件

- `src/components/common/PageMeta.tsx`
  - 页面标题、描述等 meta 管理。
- `src/components/common/IntersectObserver.tsx`
  - 交叉观察器封装。
- `src/components/common/RouteGuard.tsx`
  - 路由守卫，目前主页未实际依赖。

### 6.5 UI 组件库

- `src/components/ui/*`
  - 一组通用 UI 原子组件。
  - 例如 `button.tsx`、`card.tsx`、`input.tsx`、`avatar.tsx`、`scroll-area.tsx` 等。
  - 这些文件主要是基础零件，不是当前主页业务逻辑的核心。

### 6.6 其他目录

- `src/contexts/AuthContext.tsx`
  - 认证上下文，目前主页未真正启用。
- `src/hooks/*`
  - 通用 hooks。
- `src/lib/utils.ts`
  - 工具函数。
- `src/services/.keep`
  - 预留服务目录占位文件。
- `src/types/*`
  - 类型定义。

---

## 7. 后端与部署链路说明

### 7.1 本地代理

- `server/app.mjs`
  - 本地开发时的聊天代理服务。
  - 读取 `.env.server.local`。
  - 接收前端请求，再转发给千问兼容接口。

### 7.2 EdgeOne Functions

- `edge-functions/api/chat.js`
  - 线上聊天接口。
  - 接收前端消息，拼接数字分身提示词，请求千问，再把结果返回前端。
- `edge-functions/api/health.js`
  - 健康检查接口。
  - 用于确认 EdgeOne 环境变量和函数部署是否生效。

### 7.3 当前请求链路

本地开发：

```text
浏览器 -> Vite 前端 -> /api/chat -> 本地 server/app.mjs -> 千问接口
```

线上部署：

```text
浏览器 -> EdgeOne Pages -> /api/chat -> edge-functions/api/chat.js -> 千问接口
```

---

## 8. public 目录说明

- `public/touxiang.jpg`
  - 主页头像。
- `public/wechat-qr.png`
  - 微信二维码。
- `public/favicon.png`
  - 网站图标。
- `public/images/...`
  - 模板遗留图标、错误页插图、logo 等静态素材。
  - 当前个人主页核心展示主要用到 `touxiang.jpg` 和 `wechat-qr.png`。

---

## 9. 部署说明

### 9.1 GitHub

仓库托管在 GitHub，EdgeOne Pages 从 Git 仓库拉代码构建。

### 9.2 EdgeOne Pages

当前部署建议：

- 框架：`Vite`
- 安装命令：

```text
corepack pnpm install
```

- 构建命令：

```text
corepack pnpm exec vite build
```

- 输出目录：

```text
dist
```

### 9.3 自定义域名

当前项目已经在尝试绑定自定义域名：

```text
zychomepage.ccwu.cc
```

如果域名在中国大陆线路下使用，需要注意备案与平台限制；如果只是先跑通访问链路，使用全球可用区更稳。

---

## 10. 当前已知注意事项

- `qwen-plus` 当前比 `qwen3.5-plus` 更适合作为线上默认模型
- 手机端已经做过一轮联系方式弹窗和数字分身浮窗适配
- 数字分身的提示词已经收紧，避免编造未提供的事实
- 仓库当前公开了邮箱、GitHub 和微信二维码，这不属于 API 泄露，但属于个人信息公开暴露，需要你自己决定是否继续公开

---

## 11. 这份 README 以后还应该继续维护什么

如果后面你继续做迭代，这份 README 至少还应该持续维护这些内容：

- 项目最新地址 / 域名
- 本地启动命令是否变化
- EdgeOne 部署方式是否变化
- 当前默认模型是什么
- 哪些环境变量是必须的
- 目录结构是否有新增/删除
- 数字分身提示词放在哪个文件
- 哪些目录是历史遗留、哪些目录仍在使用
- 已知问题和限制

如果后面你想把 README 再做得更完整，建议继续补：

- 页面截图
- 发布链接
- 更新日志
- 许可证说明
- 常见问题（FAQ）

---

## 12. 一句话给未来的自己

如果你以后重新接手这个项目，先看这几个文件就够了：

- `src/pages/Home.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/Profile.tsx`
- `src/components/sections/ChatBot.tsx`
- `edge-functions/api/chat.js`
- `server/app.mjs`
- `vite.config.ts`
- `package.json`

这 8 个文件已经覆盖了：页面结构、联系方式、聊天逻辑、本地开发、线上部署和大模型调用链路。