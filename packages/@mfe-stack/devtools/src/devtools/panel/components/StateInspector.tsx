import React, { useState } from 'react';
import type { BridgeInfo } from '../../../hooks/bridge-connector';

interface StateInspectorProps {
  bridges: BridgeInfo[];
}

interface JsonTreeProps {
  data: unknown;
  depth?: number;
}

function JsonTree({ data, depth = 0 }: JsonTreeProps): React.ReactElement {
  const [expanded, setExpanded] = useState(depth < 2);
  const indent = depth * 16;

  if (data === null) {
    return <span className="json-null">null</span>;
  }

  if (data === undefined) {
    return <span className="json-null">undefined</span>;
  }

  if (typeof data === 'string') {
    return <span className="json-string">"{data}"</span>;
  }

  if (typeof data === 'number') {
    return <span className="json-number">{data}</span>;
  }

  if (typeof data === 'boolean') {
    return <span className="json-boolean">{data ? 'true' : 'false'}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="json-bracket">[]</span>;
    }

    return (
      <span className="json-tree">
        <span
          className="json-expandable"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="json-bracket">{expanded ? '[' : `[...] (${data.length} items)`}</span>
        </span>
        {expanded && (
          <>
            {data.map((item, index) => (
              <div key={index} className="json-line" style={{ paddingLeft: indent + 16 }}>
                <JsonTree data={item} depth={depth + 1} />
                {index < data.length - 1 && ','}
              </div>
            ))}
            <span className="json-bracket" style={{ paddingLeft: indent }}>]</span>
          </>
        )}
      </span>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return <span className="json-bracket">{'{}'}</span>;
    }

    return (
      <span className="json-tree">
        <span
          className="json-expandable"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="json-bracket">{expanded ? '{' : `{...} (${entries.length} keys)`}</span>
        </span>
        {expanded && (
          <>
            {entries.map(([key, value], index) => (
              <div key={key} className="json-line" style={{ paddingLeft: indent + 16 }}>
                <span className="json-key">"{key}"</span>
                <span>: </span>
                <JsonTree data={value} depth={depth + 1} />
                {index < entries.length - 1 && ','}
              </div>
            ))}
            <span className="json-bracket" style={{ paddingLeft: indent }}>{'}'}</span>
          </>
        )}
      </span>
    );
  }

  return <span className="json-null">{String(data)}</span>;
}

export function StateInspector({ bridges }: StateInspectorProps): React.ReactElement {
  const [expandedBridges, setExpandedBridges] = useState<Set<string>>(
    new Set(bridges.map((b) => b.namespace))
  );

  const toggleBridge = (namespace: string) => {
    setExpandedBridges((prev) => {
      const next = new Set(prev);
      if (next.has(namespace)) {
        next.delete(namespace);
      } else {
        next.add(namespace);
      }
      return next;
    });
  };

  if (bridges.length === 0) {
    return (
      <div className="no-hook">
        <div className="no-hook-hint">No bridges detected</div>
      </div>
    );
  }

  return (
    <div className="state-inspector">
      <div className="section-header">
        <span>Bridge States</span>
        <span className="section-count">{bridges.length}</span>
      </div>
      {bridges.map((bridge) => (
        <div key={bridge.namespace} className="bridge-item">
          <div
            className="bridge-header"
            onClick={() => toggleBridge(bridge.namespace)}
          >
            <span className="bridge-toggle">
              {expandedBridges.has(bridge.namespace) ? '▼' : '▶'}
            </span>
            <span className="bridge-name">{bridge.namespace}</span>
          </div>
          {expandedBridges.has(bridge.namespace) && (
            <div className="bridge-state">
              <JsonTree data={bridge.state} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
