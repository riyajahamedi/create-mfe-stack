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

export async function generateShell(
  targetDir: string,
  options: GeneratorConfig
): Promise<void> {
  logger.info('Generating shell application...');

  const templatesDir = getTemplatesDir(`shell-${options.framework}`);
  const shellDir = path.join(targetDir, 'apps', 'shell');

  await copyTemplateDir(templatesDir, shellDir, {
    projectName: options.projectName,
    appName: 'shell',
    port: 3000,
    features: options.features,
  });
}
