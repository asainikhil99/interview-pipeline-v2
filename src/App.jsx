import { useState } from 'react';
import { TOKEN_KEY } from './api/github';
import TokenGate from './components/TokenGate';
import PipelineView from './components/PipelineView';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  if (!token) return <TokenGate onTokenSaved={setToken} />;

  return (
    <div>
      <header className="app-header">
        <h1 className="app-header__title">Interview Pipeline</h1>
        <button
          className="app-header__signout"
          onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(null); }}
        >
          Sign out
        </button>
      </header>
      <PipelineView token={token} />
    </div>
  );
}

export default App;
