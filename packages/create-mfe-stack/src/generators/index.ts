import path from 'node:path';
import { generateMonorepo } from './monorepo.js';
import { generateShell } from './shell.js';
import { generateRemote } from './remote.js';
import { logger } from '../utils/logger.js';
import type { ProjectConfig } from '../prompts/index.js';

export interface GenerateOptions extends ProjectConfig {
  skipInstall?: boolean;
  initGit?: boolean;
}

export async function generateProject(options: GenerateOptions): Promise<void> {
  const targetDir = path.resolve(process.cwd(), options.projectName);

  logger.info(`Creating project in ${targetDir}...`);

  // Generate base monorepo structure
  await generateMonorepo(targetDir, options);

  // Generate apps based on project type
  if (options.projectType === 'complete' || options.projectType === 'shell') {
    await generateShell(targetDir, options);
  }

  if (options.projectType === 'complete' || options.projectType === 'remote') {
    await generateRemote(targetDir, options);
  }

  logger.success('Project structure generated!');
}
