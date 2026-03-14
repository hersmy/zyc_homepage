const DIGITAL_TWIN_PROMPT = `你是张亦弛的数字分身，你只代表张亦弛本人，不是通用百科助手。

【关于他】
- 名字：张亦弛
- 一句话介绍：一个正在自学 AI 并希望能找到相关实习工作的研一学生。
- 身份：通信工程专业研一学生，目前正在自学 AI，并尝试走向更真实的 AI 工作方向。
- 当前主要在做：学习 openclaw、学习 vibe coding、学习 AI 基础知识、学习制作产品。
- 兴趣：AI 应用、旅行、运动。
- 一个比较有记忆点的特点：希望最终实现财务自由，从而获得更多身体自由。

【这个主页给谁看】
- 朋友、AI 同行者、面试官。

【你应该做什么】
- 只回答和张亦弛本人有关的问题。
- 帮助访客了解他是谁、最近在做什么、关心什么，以及如何联系他。
- 他长期关注的方向包括：AI 应用、AI agent、学习 AI，以及用 AI 解决真实用户需求、提升就业竞争力。

【风格】
- 始终用简体中文回答。
- 要像真实的人，不要像客服机器人。
- 真诚、口语化、带一点轻微幽默、整体放松。
- 在合适的时候可以使用 1 到 2 个自然的表情，比如 🙂 😄 🤔，但不要用太多。
- 先直接回答，再补少量背景。
- 尽量控制在 3 到 6 句。
- 不要显得太官方、太过润色、太说教、或者太泛泛而谈。
- 如果话题本身比较轻松，可以让语气更温暖一点、稍微更活一点。

【行为示例】
- 打招呼时，不要每次都重复生硬的自我介绍，要自然一点。
- 讲最近在做什么时，要像一个人在分享自己最近忙什么，而不是像在背简历。
- 讲兴趣或计划时，要接地气一点，也可以稍微生动一点。

【边界】
- 不要编造没有提供过的经历、奖项、项目、时间线、技能水平。
- 不要假装知道缺失的信息。
- 如果信息不足，就明确说不知道，或者说这部分目前没有可确认的信息。
- 如果用户需要进一步确认，可以建议查看页面里的联系方式。
- 不要假装你能访问私人聊天记录、邮箱、微信内容或实时网络。

【联系方式】
- 邮箱：2298831129@qq.com
- GitHub：https://github.com/hersmy
- 微信：提示访客查看页面里的 WeChat 联系方式。
`;

const DEFAULT_MODEL = 'qwen-plus';
const DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function onRequestPost(context) {
  const apiKey = context.env.QWEN_API_KEY || context.env.DASHSCOPE_API_KEY || '';
  const model = context.env.QWEN_MODEL || DEFAULT_MODEL;
  const baseUrl = context.env.QWEN_BASE_URL || DEFAULT_BASE_URL;

  if (!apiKey) {
    return json({ error: 'QWEN_API_KEY is not configured in EdgeOne Pages.' }, 500);
  }

  try {
    const body = await context.request.json().catch(() => ({}));
    const incomingMessages = sanitizeMessages(body?.messages);

    if (incomingMessages.length === 0) {
      return json({ error: 'messages cannot be empty.' }, 400);
    }

    const upstreamResponse = await fetch(baseUrl, {
      eo: {
        timeoutSetting: {
          connectTimeout: 60000,
          readTimeout: 60000,
          writeTimeout: 60000,
        },
      },
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        messages: [{ role: 'system', content: DIGITAL_TWIN_PROMPT }, ...incomingMessages],
      }),
    });

    const data = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      return json({ error: extractUpstreamError(data) || 'Upstream Qwen request failed.' }, upstreamResponse.status);
    }

    const message = data?.choices?.[0]?.message?.content;
    if (typeof message !== 'string' || !message.trim()) {
      return json({ error: 'Upstream Qwen returned empty content.' }, 502);
    }

    return json({
      message: message.trim(),
      model: data?.model || model,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unknown server error.' }, 500);
  }
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

  if (
    payload.error &&
    typeof payload.error === 'object' &&
    typeof payload.error.message === 'string' &&
    payload.error.message.trim()
  ) {
    return payload.error.message;
  }

  return null;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(),
  });
}