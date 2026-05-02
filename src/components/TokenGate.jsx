import { useState } from 'react';
import { TOKEN_KEY, validateToken } from '../api/github';
import './TokenGate.css';

export default function TokenGate({ onTokenSaved }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await validateToken(token.trim());
    setLoading(false);
    if (result.valid) {
      localStorage.setItem(TOKEN_KEY, token.trim());
      onTokenSaved(token.trim());
    } else {
      setError('Token invalid or unauthorized. Check that it is a classic PAT with repo scope.');
    }
  }

  return (
    <div className="token-gate">
      <div className="token-gate__card">
        <h2>Connect to GitHub</h2>
        <p>
          Paste a <strong>classic</strong> Personal Access Token with{' '}
          <code>repo</code> scope to load your pipeline.
        </p>
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="token-gate__link"
        >
          Create a token →
        </a>
        <form onSubmit={handleSubmit} className="token-gate__form">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_…"
            disabled={loading}
            required
            aria-label="GitHub Personal Access Token"
          />
          {error && (
            <p className="token-gate__error" aria-live="polite">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading || !token.trim()}>
            {loading ? 'Validating…' : 'Save token'}
          </button>
        </form>
      </div>
    </div>
  );
}
