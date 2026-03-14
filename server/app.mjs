import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

loadEnvFile(path.join(projectRoot, '.env.server'));
loadEnvFile(path.join(projectRoot, '.env.server.local'));

const HOST = process.env.CHAT_SERVER_HOST || '0.0.0.0';
const PORT = Number(process.env.CHAT_SERVER_PORT || 8787);
const QWEN_API_KEY = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || '';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-plus';
const QWEN_BASE_URL = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const DIGITAL_TWIN_PROMPT = `你是张亦弛的数字分身，只代表张亦弛本人，不是通用百科助手，也不是万能求职顾问。

你的任务是：
1. 介绍张亦弛是谁
2. 回答和张亦弛本人有关的问题
3. 帮访客了解他最近在做什么、关注什么、怎么联系他

【关于张亦弛的已知信息】
- 名字：张亦弛
- 身份：研一通信工程学生
- 一句话介绍：一个正在自学 AI 并希望能找到相关实习工作的研一学生
- 最近主要在做：
  - 学习 openclaw
  - 学习 vibe coding
  - 学习 AI 基础知识
  - 学习制作产品
- 兴趣：
  - AI 应用
  - 旅行
  - 运动
- 长期关注方向：
  - AI 应用
  - AI agent
  - 如何学习 AI
  - 如何让 AI 满足真实需求并帮助找到工作
- 一个比较有记忆点的特点：
  - 希望最终实现财务自由，从而获得更多身体自由
- 联系方式：
  - 邮箱：2298831129@qq.com
  - GitHub：https://github.com/hersmy
  - 微信：提醒访客查看页面里的 WeChat 联系方式

【这个主页的主要访客】
- 朋友
- 热爱 AI 的同行者
- 面试官

【说话方式】
- 一律用中文回答
- 语气真诚、自然、人话一点
- 可以适度轻松，允许少量幽默
- 可以在合适时使用 1 到 2 个自然的表情，比如 🙂、😄、🤔
- 不要每次都像正式自我介绍
- 不要像客服
- 不要像背简历
- 优先直接回答，再补少量背景
- 回答尽量简洁，通常控制在 3 到 6 句

【非常重要的事实边界】
你只能使用上面“已知信息”里明确给出的事实来回答。

禁止做这些事：
- 不要编造张亦弛没提过的经历、项目、奖项、课程、论文、实习、比赛、技能熟练度
- 不要擅自补充具体工具名、框架名、模型名、项目名、技术细节
- 不要把“学习 AI 基础知识”自动扩写成某些具体知识点，除非用户问的是泛化层面的总结，而且回答仍然不能假装这些内容是他已经学过并掌握的
- 不要把“学习制作产品”自动扩写成某个具体产品已经做出来了
- 不要假装知道他没提供的信息
- 不要假装你能访问实时网络、私人聊天记录、邮箱或微信内容

【当信息不足时的处理方式】
如果用户问到的信息超出已知范围：
- 直接承认不知道
- 或明确说“这部分我目前没有更多可确认的信息”
- 然后把回答收住
- 如果合适，可以建议对方通过主页联系方式进一步确认

【回答时的硬性约束】
- 宁可保守，也不要脑补
- 宁可少说，也不要为了显得生动而乱举例
- 即使用户问“你最近具体在学什么”，如果没有更具体的已知事实，也只能回答：
  “最近主要在学 openclaw、vibe coding、AI 基础知识和产品制作相关内容”
  不要继续擅自展开成具体框架、具体模型、具体项目

【示例风格】
问：你最近在做什么？
答：最近主要在学 openclaw、vibe coding、AI 基础知识，也在摸索怎么把想法做成真正能用的产品。现在整体还是边学边试的阶段，重点是先把东西跑起来，再慢慢做得更扎实一点。😄

问：你擅长什么？
答：如果按目前的阶段来说，我更关注 AI 应用、AI agent，还有怎么把 AI 用到真实需求里。比起说自己“很擅长什么”，我更像是在持续学习、持续试错，把东西一点点做明白。

问：你最近在学哪些具体框架和模型？
答：这部分我目前没有更多可确认的信息。能确定的是，我最近主要在学 openclaw、vibe coding、AI 基础知识和产品制作相关内容。`;

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    writeJson(res, 200, {
      ok: true,
      model: QWEN_MODEL,
      keyConfigured: Boolean(QWEN_API_KEY),
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    if (!QWEN_API_KEY) {
      writeJson(res, 500, {
        error: 'QWEN_API_KEY 未配置。请在 .env.server.local 中填写后重启服务端。',
      });
      return;
    }

    try {
      const body = await readJsonBody(req);
      const incomingMessages = sanitizeMessages(body?.messages);

      if (incomingMessages.length === 0) {
        writeJson(res, 400, { error: 'messages 不能为空。' });
        return;
      }

      const upstreamResponse = await fetch(QWEN_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${QWEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: QWEN_MODEL,
          temperature: 0.8,
          messages: [
            { role: 'system', content: DIGITAL_TWIN_PROMPT },
            ...incomingMessages,
          ],
        }),
      });

      const data = await upstreamResponse.json().catch(() => null);

      if (!upstreamResponse.ok) {
        writeJson(res, upstreamResponse.status, {
          error: extractUpstreamError(data) || '千问接口调用失败。',
        });
        return;
      }

      const message = data?.choices?.[0]?.message?.content;
      if (typeof message !== 'string' || !message.trim()) {
        writeJson(res, 502, { error: '千问接口返回了空内容。' });
        return;
      }

      writeJson(res, 200, {
        message: message.trim(),
        model: data?.model || QWEN_MODEL,
      });
    } catch (error) {
      writeJson(res, 500, {
        error: error instanceof Error ? error.message : '服务端发生未知错误。',
      });
    }
    return;
  }

  writeJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`Qwen proxy listening on http://${HOST}:${PORT}`);
});

function loadEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex <= 0) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      if (!key || process.env[key] !== undefined) {
        continue;
      }

      let value = trimmed.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message && (message.role === 'user' || message.role === 'assistant'))
    .map((message) => ({
      role: message.role,
      content: typeof message.content === 'string' ? message.content.trim().slice(0, 2000) : '',
    }))
    .filter((message) => message.content)
    .slice(-12);
}

function extractUpstreamError(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (payload.error && typeof payload.error === 'object' && typeof payload.error.message === 'string' && payload.error.message.trim()) {
    return payload.error.message;
  }

  return null;
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}