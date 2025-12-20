import { useBridgeState } from '@mfe-stack/react';
import { counterBridge, decrement } from '@basic/shared';
import './index.css';

export default function CounterRemote(): JSX.Element {
  const count = useBridgeState(counterBridge, 'count');
  const lastUpdatedBy = useBridgeState(counterBridge, 'lastUpdatedBy');

  return (
    <div className="remote-app">
      <h2>Counter Remote</h2>
      <p>This runs in its own Vite app (port 3001).</p>
      <div className="counter-value">{count}</div>
      <p>Last updated by: {lastUpdatedBy ?? '—'}</p>
      <div className="actions">
        <button onClick={() => decrement('counter')}>Decrement</button>
      </div>
    </div>
  );
}
