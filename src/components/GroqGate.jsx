import { useState } from 'react';
import { GROQ_TOKEN_KEY, validateGroqKey } from '../api/groq';
import './GroqGate.css';

export default function GroqGate({ onSaved }) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await validateGroqKey(key.trim());
      localStorage.setItem(GROQ_TOKEN_KEY, key.trim());
      onSaved(key.trim());
    } catch {
      setError('Key invalid or unauthorized. Check that it is a valid Groq API key.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="groq-gate">
      <h3 className="groq-gate__title">Connect to Groq</h3>
      <p className="groq-gate__desc">
        Paste your Groq API key to enable the assistant.
      </p>
      <a
        href="https://console.groq.com/keys"
        target="_blank"
        rel="noopener noreferrer"
        className="groq-gate__link"
      >
        Get a Groq API key →
      </a>
      <form onSubmit={handleSubmit} className="groq-gate__form">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="gsk_…"
          disabled={loading}
          required
          aria-label="Groq API key"
        />
        {error && (
          <p className="groq-gate__error" aria-live="polite">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading || !key.trim()}>
          {loading ? 'Validating…' : 'Save key'}
        </button>
      </form>
    </div>
  );
}
