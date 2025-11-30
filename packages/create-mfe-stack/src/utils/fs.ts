import path from 'node:path';
import fs from 'fs-extra';
import ejs from 'ejs';

export interface TemplateData {
  projectName: string;
  appName: string;
  port: number;
  features: {
    stateManagement: boolean;
    designSystem: boolean;
    githubActions: boolean;
    docker: boolean;
  };
}

export async function copyTemplateDir(
  sourceDir: string,
  targetDir: string,
  data: TemplateData
): Promise<void> {
  await fs.ensureDir(targetDir);

  const items = await fs.readdir(sourceDir);

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const stat = await fs.stat(sourcePath);

    if (stat.isDirectory()) {
      await copyTemplateDir(sourcePath, path.join(targetDir, item), data);
    } else if (item.endsWith('.ejs')) {
      const outputName = item.replace('.ejs', '');
      const template = await fs.readFile(sourcePath, 'utf-8');
      const content = ejs.render(template, data);
      await fs.writeFile(path.join(targetDir, outputName), content);
    } else {
      await fs.copy(sourcePath, path.join(targetDir, item));
    }
  }
}
