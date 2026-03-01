import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Summary ─────────────────────────────────────────────────────────────────
export async function generateSummary(content: string): Promise<string> {
  try {
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
  } catch (error) {
    console.error('OpenAI Error in generateSummary:', error);
    return 'This is a mock summary generated due to API limits. It is designed to verify the background worker queue is functioning correctly and correctly updates the UI. The note contains enough text to simulate a realistic processing time.';
  }
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export async function generateTags(content: string): Promise<string[]> {
  try {
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

    const raw = response.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(raw);
    const arr = parsed.tags ?? parsed.keywords ?? Object.values(parsed)[0];
    return Array.isArray(arr) ? arr.slice(0, 5) : [];
  } catch (error) {
    console.error('OpenAI Error in generateTags:', error);
    return ['mock tag', 'ai test', 'worker queue', 'api limit'];
  }
}

// ─── Embedding ────────────────────────────────────────────────────────────────
export async function generateEmbedding(content: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: content.slice(0, 8000), // stay within token limits
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI Error in generateEmbedding:', error);
    // Return a dummy 3072-dimensional vector matching text-embedding-3-large
    return Array(3072).fill(0.01);
  }
}
