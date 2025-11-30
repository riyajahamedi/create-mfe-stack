import { findUp } from 'find-up';
import fs from 'fs-extra';
import path from 'path';
import type { MfeProject, MfeApp, RemoteConnection } from '../types.js';

/**
 * Detect if we're in a create-mfe-stack project
 */
export async function detectProject(): Promise<MfeProject | null> {
  // Look for turbo.json or mfe.config.js
  const turboPath = await findUp('turbo.json');

  if (!turboPath) {
    return null;
  }

  const root = path.dirname(turboPath);

  // Verify this is a valid MFE project by checking for apps directory
  const appsDir = path.join(root, 'apps');
  if (!(await fs.pathExists(appsDir))) {
    return null;
  }

  // Detect package manager
  const pnpmLock = await fs.pathExists(path.join(root, 'pnpm-lock.yaml'));
  const yarnLock = await fs.pathExists(path.join(root, 'yarn.lock'));

  return {
    root,
    type: 'monorepo',
    packageManager: pnpmLock ? 'pnpm' : yarnLock ? 'yarn' : 'npm',
  };
}

/**
 * Get all apps in the project
 */
export async function getApps(project: MfeProject): Promise<MfeApp[]> {
  const appsDir = path.join(project.root, 'apps');

  if (!(await fs.pathExists(appsDir))) {
    return [];
  }

  const entries = await fs.readdir(appsDir, { withFileTypes: true });
  const apps: MfeApp[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const appPath = path.join(appsDir, entry.name);
    const pkgPath = path.join(appPath, 'package.json');
    const vitePath = path.join(appPath, 'vite.config.ts');

    if (!(await fs.pathExists(pkgPath))) continue;

    const pkg = await fs.readJson(pkgPath);
    const viteConfig = (await fs.pathExists(vitePath))
      ? await fs.readFile(vitePath, 'utf-8')
      : '';

    // Detect type by checking for remotes config
    const isShell = viteConfig.includes('remotes:') || entry.name === 'shell';

    // Detect framework
    const isVue =
      pkg.dependencies?.vue || viteConfig.includes('@vitejs/plugin-vue');

    // Extract port from vite config or package.json scripts
    const portMatch =
      viteConfig.match(/port:\s*(\d+)/) ||
      pkg.scripts?.dev?.match(/--port[=\s]+(\d+)/);
    const port = portMatch ? parseInt(portMatch[1]) : isShell ? 3000 : 3001;

    apps.push({
      name: entry.name,
      type: isShell ? 'shell' : 'remote',
      port,
      path: appPath,
      framework: isVue ? 'vue' : 'react',
    });
  }

  return apps.sort((a, b) => a.port - b.port);
}

/**
 * Get remote connections from shell config
 */
export async function getRemoteConnections(
  project: MfeProject
): Promise<RemoteConnection[]> {
  const apps = await getApps(project);
  const shell = apps.find((a) => a.type === 'shell');

  if (!shell) {
    return [];
  }

  const vitePath = path.join(shell.path, 'vite.config.ts');
  if (!(await fs.pathExists(vitePath))) {
    return [];
  }

  const viteConfig = await fs.readFile(vitePath, 'utf-8');
  const connections: RemoteConnection[] = [];

  // Parse remotes from vite config
  const remotesMatch = viteConfig.match(/remotes:\s*{([^}]+)}/);
  if (remotesMatch) {
    const remotesContent = remotesMatch[1];
    const remoteMatches = remotesContent.matchAll(
      /(\w+):\s*['"]([^'"]+)['"]/g
    );

    for (const match of remoteMatches) {
      connections.push({
        shell: shell.name,
        remote: match[1],
        url: match[2],
      });
    }
  }

  return connections;
}

/**
 * Get the package manager command
 */
export function getPackageManagerCommand(
  packageManager: 'pnpm' | 'npm' | 'yarn'
): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm';
    case 'yarn':
      return 'yarn';
    default:
      return 'npm';
  }
}

/**
 * Get the run command for a specific script
 */
export function getRunCommand(
  packageManager: 'pnpm' | 'npm' | 'yarn',
  script: string
): string {
  if (packageManager === 'npm') {
    return `npm run ${script}`;
  }
  return `${packageManager} ${script}`;
}
