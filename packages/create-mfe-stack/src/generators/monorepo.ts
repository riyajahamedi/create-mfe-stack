import path from 'node:path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'node:url';
import type { GenerateOptions } from './index.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateMonorepo(
  targetDir: string,
  options: GenerateOptions
): Promise<void> {
  logger.info('Generating monorepo structure...');

  // Get templates directory path
  const templatesDir = path.resolve(__dirname, '../../templates/base-monorepo');

  // Ensure target directory exists
  await fs.ensureDir(targetDir);

  // Process each template file
  const files = await fs.readdir(templatesDir);

  for (const file of files) {
    const sourcePath = path.join(templatesDir, file);
    const stat = await fs.stat(sourcePath);

    if (stat.isDirectory()) {
      // Copy directory recursively
      await fs.copy(sourcePath, path.join(targetDir, file));
    } else if (file.endsWith('.ejs')) {
      // Render EJS template
      const outputName = file.replace('.ejs', '');
      const finalName = outputName === 'gitignore' ? '.gitignore' : outputName;
      const template = await fs.readFile(sourcePath, 'utf-8');
      const content = ejs.render(template, {
        projectName: options.projectName,
        packageManager: options.packageManager,
        features: options.features,
      });
      await fs.writeFile(path.join(targetDir, finalName), content);
    } else {
      // Copy file directly (handle special files like gitignore)
      const finalName = file === 'gitignore' ? '.gitignore' : file;
      await fs.copy(sourcePath, path.join(targetDir, finalName));
    }
  }

  // Create apps directory
  await fs.ensureDir(path.join(targetDir, 'apps'));

  // Create packages directory
  await fs.ensureDir(path.join(targetDir, 'packages'));
}
