import { useState, useEffect, useCallback } from 'react';

/**
 * Bridge info structure
 */
export interface BridgeInfo {
  namespace: string;
  state: unknown;
  actionCount: number;
}

/**
 * Event log entry
 */
export interface EventLogEntry {
  id: number;
  timestamp: number;
  type: 'state-change' | 'action' | 'event';
  namespace?: string;
  action?: string;
  event?: string;
  payload?: unknown;
  prevState?: unknown;
  newState?: unknown;
}

/**
 * Remote module info
 */
export interface RemoteInfo {
  name: string;
  url: string;
  loaded: boolean;
}

/**
 * Bridge connector state
 */
export interface BridgeConnectorState {
  bridges: BridgeInfo[];
  events: EventLogEntry[];
  remotes: RemoteInfo[];
  isConnected: boolean;
  hasHook: boolean;
}

/**
 * Maximum number of events to keep in the log.
 */
const MAX_EVENTS = 1000;

/**
 * React hook for connecting to MFE Stack bridges via Chrome DevTools messaging.
 */
export function useBridgeConnector(): BridgeConnectorState {
  const [bridges, setBridges] = useState<BridgeInfo[]>([]);
  const [events, setEvents] = useState<EventLogEntry[]>([]);
  const [remotes, setRemotes] = useState<RemoteInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasHook, setHasHook] = useState(false);

  const handleMessage = useCallback((message: {
    type: string;
    bridges?: BridgeInfo[];
    remotes?: RemoteInfo[];
    event?: EventLogEntry;
    tabId?: number;
  }) => {
    switch (message.type) {
      case 'bridge-data':
      case 'bridge-update':
        if (message.bridges) {
          setBridges(message.bridges);
          setHasHook(true);
        }
        if (message.remotes) {
          setRemotes(message.remotes);
        }
        break;
      case 'event-log':
        if (message.event) {
          setEvents((prev) => {
            const next = [message.event!, ...prev];
            if (next.length > MAX_EVENTS) {
              return next.slice(0, MAX_EVENTS);
            }
            return next;
          });
        }
        break;
      case 'no-hook':
        setHasHook(false);
        break;
      case 'content-disconnected':
        setIsConnected(false);
        setHasHook(false);
        setBridges([]);
        setRemotes([]);
        break;
    }
  }, []);

  useEffect(() => {
    // Check if chrome API is available
    if (typeof chrome === 'undefined' || !chrome.runtime?.connect) {
      console.log('[MFE DevTools] Chrome runtime not available');
      return;
    }

    // Connect to background service worker
    const port = chrome.runtime.connect({ name: 'mfe-devtools-panel' });

    // Send init message with tab ID
    const tabId = chrome.devtools?.inspectedWindow?.tabId;
    if (tabId) {
      port.postMessage({ type: 'init', tabId });
      setIsConnected(true);
    }

    // Listen for messages
    port.onMessage.addListener(handleMessage);

    // Handle disconnect
    port.onDisconnect.addListener(() => {
      setIsConnected(false);
      setHasHook(false);
    });

    return () => {
      port.disconnect();
    };
  }, [handleMessage]);

  return {
    bridges,
    events,
    remotes,
    isConnected,
    hasHook,
  };
}
