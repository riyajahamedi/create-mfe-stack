/**
 * Content script for MFE Stack DevTools.
 * Injected into pages to detect and monitor MFE bridges.
 */

// Make this file a module
export {};

/**
 * Bridge info structure exposed by @mfe-stack/core
 */
interface BridgeInfo {
  namespace: string;
  state: unknown;
  actionCount: number;
}

/**
 * Event log entry
 */
interface EventLogEntry {
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
 * Remote info
 */
interface RemoteInfo {
  name: string;
  url: string;
  loaded: boolean;
}

/**
 * MFE Stack hook interface
 */
interface MfeStackHook {
  getBridges(): BridgeInfo[];
  subscribe(callback: (bridges: BridgeInfo[]) => void): () => void;
  subscribeEvents(callback: (event: EventLogEntry) => void): () => void;
  getRemotes?(): RemoteInfo[];
}

declare global {
  interface Window {
    __MFE_STACK__?: MfeStackHook;
  }
}

let port: chrome.runtime.Port | null = null;
let bridgeUnsubscribe: (() => void) | null = null;
let eventUnsubscribe: (() => void) | null = null;
let eventIdCounter = 0;

/**
 * Initialize connection to background service worker.
 */
function initConnection(): void {
  port = chrome.runtime.connect({ name: 'mfe-content-script' });
  
  port.onMessage.addListener((message) => {
    if (message.type === 'get-bridges') {
      sendBridgeData();
    }
  });

  port.onDisconnect.addListener(() => {
    port = null;
    cleanup();
  });
}

/**
 * Send current bridge data to devtools panel.
 */
function sendBridgeData(): void {
  if (!port) return;

  const hook = window.__MFE_STACK__;
  if (!hook) {
    port.postMessage({ type: 'no-hook' });
    return;
  }

  const bridges = hook.getBridges();
  const remotes = hook.getRemotes?.() ?? [];

  port.postMessage({
    type: 'bridge-data',
    bridges,
    remotes,
  });
}

/**
 * Subscribe to bridge changes.
 */
function subscribeToBridges(): void {
  const hook = window.__MFE_STACK__;
  if (!hook) return;

  // Subscribe to bridge state changes
  bridgeUnsubscribe = hook.subscribe((bridges) => {
    if (port) {
      port.postMessage({
        type: 'bridge-update',
        bridges,
      });
    }
  });

  // Subscribe to events
  eventUnsubscribe = hook.subscribeEvents((event) => {
    if (port) {
      port.postMessage({
        type: 'event-log',
        event: {
          ...event,
          id: ++eventIdCounter,
        },
      });
    }
  });
}

/**
 * Cleanup subscriptions.
 */
function cleanup(): void {
  if (bridgeUnsubscribe) {
    bridgeUnsubscribe();
    bridgeUnsubscribe = null;
  }
  if (eventUnsubscribe) {
    eventUnsubscribe();
    eventUnsubscribe = null;
  }
}

// Configuration for hook detection polling
const HOOK_DETECTION_MAX_ATTEMPTS = 10;
const HOOK_DETECTION_POLL_INTERVAL_MS = 500;

/**
 * Check for MFE Stack hook and initialize if found.
 */
function checkForHook(): void {
  if (window.__MFE_STACK__) {
    initConnection();
    subscribeToBridges();
    sendBridgeData();
  }
}

// Check immediately
checkForHook();

// Also poll a few times in case the hook is injected after page load
let attempts = 0;
const pollInterval = setInterval(() => {
  attempts++;
  if (window.__MFE_STACK__ || attempts >= HOOK_DETECTION_MAX_ATTEMPTS) {
    clearInterval(pollInterval);
    if (window.__MFE_STACK__ && !port) {
      checkForHook();
    }
  }
}, HOOK_DETECTION_POLL_INTERVAL_MS);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  cleanup();
  if (port) {
    port.disconnect();
    port = null;
  }
});

console.log('[MFE Stack DevTools] Content script loaded');
