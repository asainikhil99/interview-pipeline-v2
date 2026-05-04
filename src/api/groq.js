export const GROQ_TOKEN_KEY = 'groq_api_key';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export async function chatWithGroq(token, messages) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.6,
      max_tokens: 1024,
    }),
  });
  if (res.status === 401) {
    throw Object.assign(new Error('Unauthorized'), { code: 'AUTH' });
  }
  if (!res.ok) {
    throw new Error(`Groq API ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function validateGroqKey(token) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 5,
    }),
  });
  if (res.status === 401) {
    throw Object.assign(new Error('Unauthorized'), { code: 'AUTH' });
  }
  if (!res.ok) {
    throw new Error(`Groq API ${res.status}`);
  }
  return true;
}
