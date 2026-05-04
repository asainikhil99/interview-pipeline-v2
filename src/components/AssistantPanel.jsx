import { useState, useEffect, useRef } from 'react';
import { GROQ_TOKEN_KEY, chatWithGroq } from '../api/groq';
import { PROFILE } from '../config/profile';
import { buildSystemPrompt } from '../utils/systemPrompt';
import GroqGate from './GroqGate';
import './AssistantPanel.css';

const SYSTEM_MESSAGE = { role: 'system', content: buildSystemPrompt(PROFILE) };

export default function AssistantPanel({ isOpen, onClose, pipelineData }) {
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem(GROQ_TOKEN_KEY));
  const [messages, setMessages] = useState([SYSTEM_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const reply = await chatWithGroq(groqKey, nextMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      if (err.code === 'AUTH') {
        localStorage.removeItem(GROQ_TOKEN_KEY);
        setGroqKey(null);
      } else {
        setError(err.message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleGroqKeySaved(key) {
    setGroqKey(key);
    setMessages([SYSTEM_MESSAGE]);
  }

  const visibleMessages = messages.filter(m => m.role !== 'system');

  return (
    <>
      {isOpen && (
        <div className="assistant-backdrop" onClick={onClose} aria-hidden="true" />
      )}
      <div className={`assistant-panel${isOpen ? ' assistant-panel--open' : ''}`} role="dialog" aria-label="Assistant">
        <div className="assistant-panel__header">
          <span className="assistant-panel__title">Assistant</span>
          <button className="assistant-panel__close" onClick={onClose} aria-label="Close assistant">×</button>
        </div>

        {!groqKey ? (
          <GroqGate onSaved={handleGroqKeySaved} />
        ) : (
          <div className="assistant-chat">
            <div className="assistant-chat__messages">
              {visibleMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`assistant-message assistant-message--${msg.role}`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="assistant-message assistant-message--assistant assistant-message--thinking">
                  Thinking…
                </div>
              )}
              {error && (
                <p className="assistant-chat__error" aria-live="polite">{error}</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="assistant-chat__input-area">
              <textarea
                ref={textareaRef}
                className="assistant-chat__textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                disabled={loading}
                rows={2}
                aria-label="Message"
              />
              <button
                className="assistant-chat__send"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
