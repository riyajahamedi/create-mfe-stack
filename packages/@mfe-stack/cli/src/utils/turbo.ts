import { execa } from 'execa';
import type { MfeProject } from '../types.js';
import { getPackageManagerCommand } from './project.js';

/**
 * Run a turbo command
 */
export async function runTurboCommand(
  project: MfeProject,
  command: string,
  options: {
    filter?: string;
    args?: string[];
  } = {}
): Promise<void> {
  const pm = getPackageManagerCommand(project.packageManager);
  const turboArgs = ['turbo', 'run', command];

  if (options.filter) {
    turboArgs.push(`--filter=${options.filter}`);
  }

  if (options.args) {
    turboArgs.push(...options.args);
  }

  await execa(pm, turboArgs, {
    stdio: 'inherit',
    cwd: project.root,
  });
}

/**
 * Run dev servers via turbo
 */
export async function runDevServers(
  project: MfeProject,
  filter?: string
): Promise<void> {
  await runTurboCommand(project, 'dev', { filter });
}

/**
 * Run build via turbo
 */
export async function runBuild(
  project: MfeProject,
  filter?: string
): Promise<void> {
  await runTurboCommand(project, 'build', { filter });
}
