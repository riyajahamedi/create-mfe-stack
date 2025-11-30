import React from 'react';
import type { EventLogEntry } from '../../../hooks/bridge-connector';

interface EventLogProps {
  events: EventLogEntry[];
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + '.' + date.getMilliseconds().toString().padStart(3, '0');
}

function truncatePayload(payload: unknown): string {
  if (payload === undefined) return '';
  try {
    const str = JSON.stringify(payload);
    if (str.length > 50) {
      return str.substring(0, 47) + '...';
    }
    return str;
  } catch {
    return '[Object]';
  }
}

export function EventLog({ events }: EventLogProps): React.ReactElement {
  if (events.length === 0) {
    return (
      <div className="event-log">
        <div className="section-header">
          <span>Event Log</span>
          <span className="section-count">0</span>
        </div>
        <div className="event-log-empty">No events recorded yet</div>
      </div>
    );
  }

  return (
    <div className="event-log">
      <div className="section-header">
        <span>Event Log</span>
        <span className="section-count">{events.length}</span>
      </div>
      {events.map((event) => (
        <div key={event.id} className="event-item">
          <span className="event-timestamp">{formatTimestamp(event.timestamp)}</span>
          <span className={`event-type ${event.type}`}>{event.type.replace('-', ' ')}</span>
          {event.namespace && <span className="event-namespace">{event.namespace}</span>}
          {event.action && <span className="event-name">{event.action}</span>}
          {event.event && <span className="event-name">{event.event}</span>}
          <span className="event-payload">{truncatePayload(event.payload)}</span>
        </div>
      ))}
    </div>
  );
}
