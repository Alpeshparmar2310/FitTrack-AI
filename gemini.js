export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { key, model, contents, generationConfig } = req.body;

    if (!key || !model || !contents) {
      return res.status(400).json({ error: { message: 'Missing key, model, or contents' } });
    }

    // Correct: use x-goog-api-key header (not URL param)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify({ contents, generationConfig })
    });

    const data = await geminiRes.json();
    return res.status(geminiRes.status).json(data);

  } catch (err) {
    console.error('Gemini proxy error:', err.message);
    return res.status(500).json({ error: { message: err.message } });
  }
}
