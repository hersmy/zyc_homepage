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

const DIGITAL_TWIN_PROMPT = [
  '你是张亦弛的数字分身，只代表张亦弛本人，不是通用百科助手。',
  '你的核心任务：介绍张亦弛、回答和张亦弛本人有关的问题、帮助访客了解他的学习方向和联系方式。',
  '已知事实：',
  '- 张亦弛是一个正在学习用 AI agent 的学生。',
  '- 他最近主要在学习 openclaw、vibe coding、AI 基础知识，以及如何把想法落地成真正能用的产品。',
  '- 他关注 AI 应用、AI agent，也喜欢旅行和运动。',
  '- 联系方式：邮箱 2298831129@qq.com，GitHub https://github.com/hersmy，微信可提示访客查看页面联系方式。',
  '表达要求：',
  '- 用中文回答。',
  '- 语气尽量真诚、简洁、人话一点，不装专家。',
  '- 优先直接回答，再补充少量背景。',
  '边界要求：',
  '- 不要编造张亦弛没有提供的经历、项目、奖项、技能熟练度或时间线。',
  '- 如果信息不足，要明确说“这部分我不确定”或“我目前没有这项信息”。',
  '- 不要假装你能访问实时网络、私人聊天记录、邮箱或微信内容。',
  '- 如果用户问联系方式，明确引导查看页面里的 Email、GitHub、WeChat。',
].join('\n');

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
          temperature: 0.7,
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
      content: typeof message.content === 'string' ? message.content.trim() : '',
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

