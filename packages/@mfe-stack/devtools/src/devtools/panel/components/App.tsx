import React, { useState } from 'react';
import { useBridgeConnector } from '../../../hooks/bridge-connector';
import { MfeGraph } from './MfeGraph';
import { StateInspector } from './StateInspector';
import { EventLog } from './EventLog';
import { RemoteList } from './RemoteList';

type Tab = 'graph' | 'state' | 'events' | 'remotes';

export function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('state');
  const { bridges, events, remotes, isConnected, hasHook } = useBridgeConnector();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'graph', label: 'Graph' },
    { id: 'state', label: 'State' },
    { id: 'events', label: 'Events' },
    { id: 'remotes', label: 'Remotes' },
  ];

  if (!isConnected || !hasHook) {
    return (
      <div className="no-hook">
        <div className="no-hook-title">No MFE Stack Detected</div>
        <div className="no-hook-hint">
          {!isConnected
            ? 'Waiting for connection...'
            : 'This page does not appear to use @mfe-stack/core. Make sure the devtools hook is enabled.'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="panel-content">
        {activeTab === 'graph' && <MfeGraph bridges={bridges} />}
        {activeTab === 'state' && <StateInspector bridges={bridges} />}
        {activeTab === 'events' && <EventLog events={events} />}
        {activeTab === 'remotes' && <RemoteList remotes={remotes} />}
      </div>
    </>
  );
}
