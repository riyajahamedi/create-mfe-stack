import { Command } from 'commander';
import pc from 'picocolors';
import { detectProject, getApps } from '../utils/project.js';
import { runDevServers } from '../utils/turbo.js';
import { logger } from '../utils/logger.js';

export const devCommand = new Command('dev')
  .description('Start development servers')
  .option('-f, --filter <app>', 'Filter to specific app')
  .option('-p, --port <port>', 'Override port for shell (not yet implemented)')
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

    logger.title('🚀 Starting MFE Development Servers');

    filteredApps.forEach((app) => {
      const icon = app.type === 'shell' ? '🏠' : '📦';
      console.log(
        pc.gray(`  ${icon} ${app.name}: `) +
          pc.green(`http://localhost:${app.port}`)
      );
    });
    console.log();

    try {
      await runDevServers(project, options.filter);
    } catch (error) {
      // Dev servers were interrupted - this is expected behavior
      if (error instanceof Error && error.message.includes('SIGINT')) {
        console.log();
        logger.info('Development servers stopped');
      } else {
        throw error;
      }
    }
  });
