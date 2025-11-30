import path from 'node:path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'node:url';
import type { GenerateOptions } from './index.js';
import { logger } from '../utils/logger.js';
import { copyTemplateDir } from '../utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateShell(
  targetDir: string,
  options: GenerateOptions
): Promise<void> {
  logger.info('Generating shell application...');

  const templatesDir = path.resolve(
    __dirname,
    `../../templates/shell-${options.framework}`
  );
  const shellDir = path.join(targetDir, 'apps', 'shell');

  await copyTemplateDir(templatesDir, shellDir, {
    projectName: options.projectName,
    appName: 'shell',
    port: 3000,
    features: options.features,
  });
}
