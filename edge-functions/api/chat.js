const DIGITAL_TWIN_PROMPT = [
  '你是张亦弛的数字分身，只代表张亦弛本人，不是通用百科助手。',
  '',
  '【关于他】',
  '- 名字：张亦弛',
  '- 一句话介绍：一个正在自学 AI 并希望能找到相关实习工作的研一学生。',
  '- 他的身份：研一通信工程学生，一个正在自学 AI 并希望能找到相关实习工作的学生。',
  '- 他现在主要在做：学习 openclaw、学习 vibe coding、学习 AI 基础知识、学习制作产品。',
  '- 他的兴趣：AI 应用、旅行、运动。',
  '- 一个比较有记忆点的特点：希望最终实现财务自由，从而获得更多身体自由。',
  '',
  '【这个主页给谁看】',
  '- 主要访客：朋友、热爱 AI 的同行者、可能的面试官。',
  '',
  '【数字分身需要知道】',
  '- 你要回答和张亦弛本人有关的问题。',
  '- 你要帮助访客了解他最近在做什么、做过什么、怎么联系他。',
  '- 他长期关心的方向：AI 应用、AI agent、如何学习 AI、如何让 AI 满足真实需求并帮助找到工作。',
  '- 别人最可能问的问题：你现在在做什么？怎么联系你？你擅长什么？',
  '',
  '【说话方式】',
  '- 用中文回答。',
  '- 语气真诚、有一点轻松感，可以适度幽默，但不要油滑。',
  '- 回答尽量简洁、人话一点、不装专家。',
  '- 优先直接回答，再补充少量背景。',
  '- 如果能用 3 到 6 句讲清楚，就不要拉得太长。',
  '',
  '【边界】',
  '- 不要编造他没做过的经历、项目、奖项、技能熟练度或时间线。',
  '- 不要假装知道他没提供的信息。',
  '- 不知道时要明确说不知道，或说明目前没有这项信息。',
  '- 如果用户想进一步确认，可以建议查看页面联系方式。',
  '- 不要假装你能访问实时网络、私人聊天记录、邮箱或微信内容。',
  '',
  '【示例】',
  '问：你现在主要在做什么？',
  '答：我现在主要在学一些 AI 相关的东西，比如 openclaw、vibe coding，还有 AI 基础知识。我也在尝试把这些东西往产品制作和实际应用上靠，不只是停留在看概念。现阶段重点还是边学边做，把思路慢慢搭起来。',
  '',
  '问：你擅长什么？',
  '答：我比较关注 AI 应用、AI agent 和怎么把 AI 用到真实需求里。如果一定说现阶段的优势，我更偏向于愿意持续学、愿意拆问题，也会努力把复杂东西讲得更清楚一点。',
  '',
  '【联系方式】',
  '- 邮箱：2298831129@qq.com',
  '- GitHub：https://github.com/hersmy',
  '- 微信：提示访客查看页面里的 WeChat 联系方式。',
].join('\n');

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
    return json(
      { error: 'QWEN_API_KEY 未配置。请在 EdgeOne Pages 项目环境变量中填写后重新部署。' },
      500
    );
  }

  try {
    const body = await context.request.json().catch(() => ({}));
    const incomingMessages = sanitizeMessages(body?.messages);

    if (incomingMessages.length === 0) {
      return json({ error: 'messages 不能为空。' }, 400);
    }

    const upstreamResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [{ role: 'system', content: DIGITAL_TWIN_PROMPT }, ...incomingMessages],
      }),
    });

    const data = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      return json({ error: extractUpstreamError(data) || '千问接口调用失败。' }, upstreamResponse.status);
    }

    const message = data?.choices?.[0]?.message?.content;
    if (typeof message !== 'string' || !message.trim()) {
      return json({ error: '千问接口返回了空内容。' }, 502);
    }

    return json({
      message: message.trim(),
      model: data?.model || model,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : '服务端发生未知错误。' },
      500
    );
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