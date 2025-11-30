import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GeneratorConfig } from '../types.js';
import { logger } from '../utils/logger.js';
import { copyTemplateDir } from '../utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get templates directory - when bundled, __dirname is the dist folder
// Templates are at the same level as dist (../templates from dist)
function getTemplatesDir(templateName: string): string {
  return path.resolve(__dirname, '../templates', templateName);
}

export async function generateRemote(
  targetDir: string,
  options: GeneratorConfig
): Promise<void> {
  logger.info('Generating remote application...');

  const templatesDir = getTemplatesDir(`remote-${options.framework}`);
  const remoteDir = path.join(targetDir, 'apps', 'remote1');

  await copyTemplateDir(templatesDir, remoteDir, {
    projectName: options.projectName,
    appName: 'remote1',
    port: 3001,
    features: options.features,
  });
}
