import React from 'react';
import type { RemoteInfo } from '../../../hooks/bridge-connector';

interface RemoteListProps {
  remotes: RemoteInfo[];
}

export function RemoteList({ remotes }: RemoteListProps): React.ReactElement {
  if (remotes.length === 0) {
    return (
      <div className="remote-list">
        <div className="section-header">
          <span>Remote Modules</span>
          <span className="section-count">0</span>
        </div>
        <div className="remote-list-empty">No remote modules detected</div>
      </div>
    );
  }

  return (
    <div className="remote-list">
      <div className="section-header">
        <span>Remote Modules</span>
        <span className="section-count">{remotes.length}</span>
      </div>
      {remotes.map((remote) => (
        <div key={remote.name} className="remote-item">
          <span className={`remote-status ${remote.loaded ? 'loaded' : 'pending'}`} />
          <div className="remote-info">
            <div className="remote-name">{remote.name}</div>
            <div className="remote-url">{remote.url}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
