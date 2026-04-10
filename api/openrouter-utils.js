/**
 * OpenRouter chat body: primary `model` plus `models` fallbacks when a slug has no live endpoints.
 * @see https://openrouter.ai/docs/guides/routing/model-fallbacks
 */
export function resolvePrimaryModel(modelFromClient) {
  const fromClient = modelFromClient && String(modelFromClient).trim();
  if (fromClient) return fromClient;
  const fromEnv = process.env.OPENROUTER_MODEL && String(process.env.OPENROUTER_MODEL).trim();
  if (fromEnv) return fromEnv;
  return 'openai/gpt-4o-mini';
}

const FALLBACK_MODELS = [
  'openai/gpt-4o-mini',
  'meta-llama/llama-3.3-70b-instruct',
  'google/gemini-2.0-flash-001',
  'anthropic/claude-3.5-sonnet',
];

export function buildOpenRouterChatBody(prompt, modelFromClient, stream) {
  const primary = resolvePrimaryModel(modelFromClient);
  const fallbacks = FALLBACK_MODELS.filter((m) => m !== primary);

  const body = {
    model: primary,
    models: fallbacks,
    messages: [{ role: 'user', content: prompt }],
  };
  if (stream) body.stream = true;
  return body;
}

/** Parse OpenRouter / OpenAI-style error JSON into a short message */
export function parseOpenRouterErrorBody(text) {
  if (!text || typeof text !== 'string') return 'Request failed';
  try {
    const j = JSON.parse(text);
    if (j.error) {
      if (typeof j.error === 'string') return j.error;
      if (typeof j.error.message === 'string') return j.error.message;
    }
    if (typeof j.message === 'string') return j.message;
  } catch (_) {
    /* raw text */
  }
  const trimmed = text.trim();
  return trimmed.length > 500 ? trimmed.slice(0, 500) + '…' : trimmed;
}
