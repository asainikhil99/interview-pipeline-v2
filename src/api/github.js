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
