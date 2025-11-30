import { Command } from 'commander';
import pc from 'picocolors';
import { detectProject, getApps } from '../utils/project.js';
import { runBuild } from '../utils/turbo.js';
import { logger } from '../utils/logger.js';

export const buildCommand = new Command('build')
  .description('Build applications for production')
  .option('-f, --filter <app>', 'Filter to specific app')
  .option('--analyze', 'Include bundle analysis (not yet implemented)')
  .action(async (options) => {
    const project = await detectProject();

    if (!project) {
      logger.error('Not in a create-mfe-stack project');
      logger.dim('  Make sure you are in a directory with turbo.json and an apps/ folder');
      process.exit(1);
    }

    const apps = await getApps(project);

    if (apps.length === 0) {
      logger.warning('No apps found in the project');
      process.exit(1);
    }

    // Filter apps if specified
    const filteredApps = options.filter
      ? apps.filter((a) => a.name === options.filter)
      : apps;

    if (options.filter && filteredApps.length === 0) {
      logger.error(`App "${options.filter}" not found`);
      logger.dim('  Available apps: ' + apps.map((a) => a.name).join(', '));
      process.exit(1);
    }

    logger.title('🏗️ Building MFE Applications');

    filteredApps.forEach((app) => {
      const icon = app.type === 'shell' ? '🏠' : '📦';
      console.log(pc.gray(`  ${icon} ${app.name}`));
    });
    console.log();

    if (options.analyze) {
      logger.warning('Bundle analysis is not yet implemented');
    }

    try {
      await runBuild(project, options.filter);
      console.log();
      logger.success('Build completed successfully!');
    } catch (error) {
      console.log();
      logger.error('Build failed');
      process.exit(1);
    }
  });
