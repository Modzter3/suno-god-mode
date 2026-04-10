import { buildOpenRouterChatBody, parseOpenRouterErrorBody } from './openrouter-utils.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: OPENROUTER_API_KEY is not set in Vercel project settings.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { prompt, model } = await req.json();

    const siteUrl =
      process.env.OPENROUTER_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://localhost');

    const body = buildOpenRouterChatBody(prompt, model, false);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl,
        'X-Title': 'Suno God Mode',
      },
      body: JSON.stringify(body),
    });

    const rawErr = await response.text();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: parseOpenRouterErrorBody(rawErr) }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(rawErr);
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (content == null || content === '') {
      return new Response(
        JSON.stringify({ error: 'Empty response from model. Try another model in the dropdown.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
