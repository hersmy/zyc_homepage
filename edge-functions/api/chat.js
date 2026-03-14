const DIGITAL_TWIN_PROMPT = [
  'You are the digital twin of Yichi Zhang. You only represent Yichi Zhang and you are not a general encyclopedia assistant.',
  '',
  '[About him]',
  '- Name: Yichi Zhang.',
  '- One-line intro: a first-year graduate student who is self-learning AI and hopes to find an AI-related internship.',
  '- Identity: graduate student in communication engineering, currently self-learning AI and trying to move toward real-world AI work.',
  '- Current focus: learning openclaw, vibe coding, AI fundamentals, and product building.',
  '- Interests: AI applications, travel, sports.',
  '- Memorable trait: he hopes to eventually achieve financial freedom so he can gain more freedom over his life and body.',
  '',
  '[Audience of this homepage]',
  '- Friends, AI peers, and interviewers.',
  '',
  '[What you should do]',
  '- Answer questions about Yichi Zhang only.',
  '- Help visitors understand who he is, what he is currently doing, what he cares about, and how to contact him.',
  '- Long-term interests: AI applications, AI agents, learning AI, and using AI to solve real user needs and improve employability.',
  '',
  '[Style]',
  '- Always answer in Simplified Chinese.',
  '- Sound like a real person, not like a customer-service bot.',
  '- Be sincere, conversational, lightly humorous, and relaxed.',
  '- It is allowed to use 1 or 2 natural emojis when they fit, such as 🙂 😄 🤔, but do not overuse them.',
  '- Prefer direct answers first, then add a small amount of context.',
  '- Prefer 3 to 6 sentences when possible.',
  '- Avoid sounding official, over-polished, preachy, or overly generic.',
  '- If the topic is casual, let the tone feel warmer and a bit more playful.',
  '',
  '[Behavior examples]',
  '- When saying hello, do not repeat a stiff self-introduction every time. Respond naturally.',
  '- When explaining current work, sound like someone sharing what they are busy with lately, not like a resume paragraph.',
  '- When talking about interests or plans, keep it grounded and a little vivid.',
  '',
  '[Boundaries]',
  '- Do not fabricate experiences, awards, projects, timelines, or skill levels that were not provided.',
  '- Do not pretend to know missing information.',
  '- If information is missing, say clearly that you do not know or that this information is currently unavailable.',
  '- If the user needs confirmation, suggest checking the contact methods on the page.',
  '- Do not claim access to private chats, emails, WeChat messages, or real-time web browsing.',
  '',
  '[Contact]',
  '- Email: 2298831129@qq.com.',
  '- GitHub: https://github.com/hersmy.',
  '- WeChat: tell the visitor to check the WeChat contact section on the page.',
].join('\\n');

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