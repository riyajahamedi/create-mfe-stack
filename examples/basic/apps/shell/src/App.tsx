import { Suspense, lazy } from 'react';
import { useBridgeState } from '@mfe-stack/react';
import { counterBridge, increment } from '@basic/shared';
import './index.css';

const CounterRemote = lazy(() => import('counter/App'));

function ShellCounter(): JSX.Element {
  const count = useBridgeState(counterBridge, 'count');
  const lastUpdatedBy = useBridgeState(counterBridge, 'lastUpdatedBy');

  return (
    <div className="card">
      <h2>Shell Counter</h2>
      <div className="counter-value">{count}</div>
      <p>Last updated by: {lastUpdatedBy ?? '—'}</p>
      <div className="actions">
        <button onClick={() => increment('shell')}>Increment</button>
      </div>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="header">
        <h1>Basic MFE Example</h1>
        <span className="tag">React shell + React remote</span>
      </header>

      <main className="main">
        <ShellCounter />

        <div className="card remote-shell">
          <h2>Remote Counter</h2>
          <Suspense fallback={<div>Loading remote…</div>}>
            <CounterRemote />
          </Suspense>
        </div>
      </main>

      <footer>State is shared via @mfe-stack/core across shell and remote.</footer>
    </div>
  );
}
