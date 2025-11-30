import React from 'react';
import type { BridgeInfo } from '../../../hooks/bridge-connector';

interface MfeGraphProps {
  bridges: BridgeInfo[];
}

export function MfeGraph({ bridges }: MfeGraphProps): React.ReactElement {
  if (bridges.length === 0) {
    return (
      <div className="no-hook">
        <div className="no-hook-hint">No bridges detected</div>
      </div>
    );
  }

  return (
    <div className="mfe-graph">
      <div className="section-header">
        <span>MFE Architecture</span>
        <span className="section-count">{bridges.length} bridge(s)</span>
      </div>
      {bridges.map((bridge) => (
        <div key={bridge.namespace} className="mfe-node">
          <div className="mfe-node-header">
            <span className="mfe-node-name">{bridge.namespace}</span>
            <span className="mfe-node-type">Bridge</span>
          </div>
          <div className="mfe-node-connections">
            Actions dispatched: {bridge.actionCount}
          </div>
        </div>
      ))}
    </div>
  );
}
