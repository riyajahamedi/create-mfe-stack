/**
 * Background service worker for MFE Stack DevTools.
 * Handles communication between content scripts and devtools panel.
 */

interface ConnectionInfo {
  tabId: number;
  devtoolsPort: chrome.runtime.Port | null;
  contentPort: chrome.runtime.Port | null;
}

const connections = new Map<number, ConnectionInfo>();

/**
 * Handle incoming connections from devtools panel or content scripts.
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'mfe-devtools-panel') {
    handleDevtoolsConnection(port);
  } else if (port.name === 'mfe-content-script') {
    handleContentConnection(port);
  }
});

/**
 * Handle connection from devtools panel.
 */
function handleDevtoolsConnection(port: chrome.runtime.Port): void {
  port.onMessage.addListener((message) => {
    if (message.type === 'init' && message.tabId) {
      const connectionTabId = message.tabId as number;
      
      // Get or create connection info
      let connection = connections.get(connectionTabId);
      if (!connection) {
        connection = { tabId: connectionTabId, devtoolsPort: null, contentPort: null };
        connections.set(connectionTabId, connection);
      }
      connection.devtoolsPort = port;
      
      // If content script is already connected, forward bridge data
      if (connection.contentPort) {
        connection.contentPort.postMessage({ type: 'get-bridges' });
      }
    } else if (message.tabId && message.type) {
      // Forward messages to content script
      const connection = connections.get(message.tabId);
      if (connection?.contentPort) {
        connection.contentPort.postMessage(message);
      }
    }
  });

  port.onDisconnect.addListener(() => {
    // Clean up connection
    for (const [id, connection] of connections) {
      if (connection.devtoolsPort === port) {
        connection.devtoolsPort = null;
        if (!connection.contentPort) {
          connections.delete(id);
        }
        break;
      }
    }
  });
}

/**
 * Handle connection from content script.
 */
function handleContentConnection(port: chrome.runtime.Port): void {
  const tabId = port.sender?.tab?.id;
  if (!tabId) return;

  // Get or create connection info
  let connection = connections.get(tabId);
  if (!connection) {
    connection = { tabId, devtoolsPort: null, contentPort: null };
    connections.set(tabId, connection);
  }
  connection.contentPort = port;

  port.onMessage.addListener((message) => {
    // Forward messages to devtools panel
    if (connection?.devtoolsPort) {
      connection.devtoolsPort.postMessage({ ...message, tabId });
    }
  });

  port.onDisconnect.addListener(() => {
    // Clean up connection
    if (connection) {
      connection.contentPort = null;
      if (!connection.devtoolsPort) {
        connections.delete(tabId);
      } else {
        // Notify devtools that content script disconnected
        connection.devtoolsPort.postMessage({ type: 'content-disconnected', tabId });
      }
    }
  });
}

// Log extension startup
console.log('[MFE Stack DevTools] Service worker started');
