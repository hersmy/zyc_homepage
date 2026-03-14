const DEFAULT_MODEL = 'qwen-plus';

export function onRequestGet(context) {
  return new Response(
    JSON.stringify({
      ok: true,
      model: context.env.QWEN_MODEL || DEFAULT_MODEL,
      keyConfigured: Boolean(context.env.QWEN_API_KEY || context.env.DASHSCOPE_API_KEY),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}