import { execSync } from 'node:child_process';

export type PackageManager = 'pnpm' | 'npm' | 'yarn';

export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith('pnpm')) return 'pnpm';
    if (userAgent.startsWith('yarn')) return 'yarn';
  }

  return 'npm';
}

export function getInstallCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm install';
    case 'yarn':
      return 'yarn';
    case 'npm':
    default:
      return 'npm install';
  }
}

export function getRunCommand(
  packageManager: PackageManager,
  script: string
): string {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    case 'npm':
    default:
      return `npm run ${script}`;
  }
}

export function installDependencies(
  packageManager: PackageManager,
  cwd: string
): void {
  const command = getInstallCommand(packageManager);
  execSync(command, { cwd, stdio: 'inherit' });
}
