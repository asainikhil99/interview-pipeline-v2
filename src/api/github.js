export const TOKEN_KEY = 'github_pat';

export async function getCurrentUser(token) {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${token}` },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

export async function validateToken(token) {
  try {
    const user = await getCurrentUser(token);
    return { valid: true, user };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

export async function getPipelineFile(token, owner, repo, path) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `token ${token}` } }
  );
  if (res.status === 404) throw new Error('pipeline.json not found in the repo.');
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  // GitHub base64-encodes content with embedded newlines — strip before decoding
  const decoded = atob(data.content.replace(/\n/g, ''));
  let parsed;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new Error('pipeline.json contains invalid JSON.');
  }
  return { content: parsed, sha: data.sha };
}
