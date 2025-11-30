import React, { useState } from 'react';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="remote-app">
      <div className="remote-badge">Remote MFE</div>
      <h3>👋 Hello from Remote!</h3>
      <p>This component is loaded from a separate micro-frontend.</p>
      
      <div className="counter">
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>

      <div className="info">
        <p>✨ This remote exposes its App component via Module Federation</p>
      </div>
    </div>
  );
}

export default App;
