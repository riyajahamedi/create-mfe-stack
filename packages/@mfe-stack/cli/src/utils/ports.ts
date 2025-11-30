import { execa } from 'execa';

/**
 * Check if a port is available
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  try {
    await execa('lsof', ['-i', `:${port}`]);
    return false; // Port is in use
  } catch {
    return true; // Port is available
  }
}

/**
 * Find the next available port starting from a base port
 */
export async function findAvailablePort(basePort: number): Promise<number> {
  let port = basePort;
  const maxPort = basePort + 100;

  while (port < maxPort) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }

  throw new Error(`No available port found between ${basePort} and ${maxPort}`);
}

/**
 * Get suggested port for a new remote based on existing apps
 */
export function getNextAvailablePort(existingPorts: number[]): number {
  if (existingPorts.length === 0) {
    return 3001;
  }

  const maxPort = Math.max(...existingPorts);
  return maxPort + 1;
}
