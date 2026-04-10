export const config = {
  runtime: 'edge',
};

/**
 * Proxies OpenRouter's model catalog so the UI always shows current IDs (no stale hardcoded list).
 * @see https://openrouter.ai/docs/api-reference/list-available-models
 */
export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const headers = { Accept: 'application/json' };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const upstream = await fetch('https://openrouter.ai/api/v1/models', { headers });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: text || upstream.statusText }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json = await upstream.json();
    const rows = Array.isArray(json.data) ? json.data : [];
    const minimal = rows.map(function (m) {
      return {
        id: m.id,
        name: m.name || m.id,
        context_length: m.context_length,
      };
    });

    minimal.sort(function (a, b) {
      return a.id.localeCompare(b.id, undefined, { sensitivity: 'base' });
    });

    return new Response(JSON.stringify({ data: minimal }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Failed to load models' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
