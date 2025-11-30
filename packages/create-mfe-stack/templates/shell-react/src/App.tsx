import React, { Suspense, lazy } from 'react';
import './index.css';

// Lazy load the remote component
const RemoteApp = lazy(() => import('remote1/App'));

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🏠 Shell Application</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <main className="main">
        <section className="local-content">
          <h2>Local Shell Content</h2>
          <p>This content is rendered by the shell application.</p>
        </section>

        <section className="remote-content">
          <h2>Remote Micro-Frontend</h2>
          <Suspense fallback={<div className="loading">Loading remote...</div>}>
            <RemoteApp />
          </Suspense>
        </section>
      </main>

      <footer className="footer">
        <p>Built with create-mfe-stack</p>
      </footer>
    </div>
  );
}

export default App;
