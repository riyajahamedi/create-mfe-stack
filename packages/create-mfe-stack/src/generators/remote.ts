import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GenerateOptions } from './index.js';
import { logger } from '../utils/logger.js';
import { copyTemplateDir } from '../utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateRemote(
  targetDir: string,
  options: GenerateOptions
): Promise<void> {
  logger.info('Generating remote application...');

  const templatesDir = path.resolve(
    __dirname,
    `../../templates/remote-${options.framework}`
  );
  const remoteDir = path.join(targetDir, 'apps', 'remote1');

  await copyTemplateDir(templatesDir, remoteDir, {
    projectName: options.projectName,
    appName: 'remote1',
    port: 3001,
    features: options.features,
  });
}
