import { useState } from 'react';
import { TOKEN_KEY } from './api/github';
import TokenGate from './components/TokenGate';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  if (!token) {
    return <TokenGate onTokenSaved={setToken} />;
  }

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
        <h1 style={{ margin: 0, flex: 1 }}>Pipeline loaded</h1>
        <button
          onClick={() => {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
          }}
          style={{ minHeight: '44px', padding: '0 1rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </header>
    </div>
  );
}

export default App;
