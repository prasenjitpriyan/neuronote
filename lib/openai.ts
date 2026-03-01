import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Summary ─────────────────────────────────────────────────────────────────
export async function generateSummary(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a concise note summarizer. Respond with exactly 3 sentences.',
      },
      {
        role: 'user',
        content: `Summarize this note in 3 concise sentences:\n\n${content}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.3,
  });

  return response.choices[0].message.content?.trim() ?? '';
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export async function generateTags(content: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a tagging assistant. Respond ONLY with a valid JSON array of strings. No explanation.',
      },
      {
        role: 'user',
        content: `Extract up to 5 relevant tags from this note as a JSON array:\n\n${content}`,
      },
    ],
    max_tokens: 100,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  try {
    const raw = response.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(raw);
    // Accept { tags: [...] } or top-level arrays
    const arr = parsed.tags ?? parsed.keywords ?? Object.values(parsed)[0];
    return Array.isArray(arr) ? arr.slice(0, 5) : [];
  } catch {
    return [];
  }
}

// ─── Embedding ────────────────────────────────────────────────────────────────
export async function generateEmbedding(content: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: content.slice(0, 8000), // stay within token limits
  });

  return response.data[0].embedding;
}
