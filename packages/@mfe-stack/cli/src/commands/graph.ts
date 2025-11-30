import { Command } from 'commander';
import pc from 'picocolors';
import { detectProject, getApps, getRemoteConnections } from '../utils/project.js';
import { logger } from '../utils/logger.js';

export const graphCommand = new Command('graph')
  .description('Visualize MFE dependency graph')
  .action(async () => {
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

    const connections = await getRemoteConnections(project);

    logger.title('📊 MFE Dependency Graph');

    // Find shell
    const shell = apps.find((a) => a.type === 'shell');
    const remotes = apps.filter((a) => a.type === 'remote');

    if (!shell) {
      logger.warning('No shell application found');
      console.log();
      console.log('  Available apps:');
      apps.forEach((app) => {
        console.log(pc.gray(`    • ${app.name} (${app.type})`));
      });
      process.exit(0);
    }

    // Calculate box dimensions
    const shellLabel = `${shell.name.toUpperCase()} :${shell.port}`;
    const boxWidth = Math.max(shellLabel.length + 6, 20);

    // Draw shell box
    console.log(`    ┌${'─'.repeat(boxWidth)}┐`);
    console.log(`    │  ${pc.green(pc.bold(shellLabel))}${' '.repeat(boxWidth - shellLabel.length - 2)}│`);
    console.log(`    └${'─'.repeat(Math.floor(boxWidth / 2))}┬${'─'.repeat(Math.ceil(boxWidth / 2) - 1)}┘`);

    if (remotes.length > 0) {
      console.log(`          │`);

      remotes.forEach((remote, i) => {
        const isLast = i === remotes.length - 1;
        const prefix = isLast ? '└' : '├';
        const icon = remote.framework === 'vue' ? '🟢' : '⚛️';

        // Check if this remote is connected to shell
        const connection = connections.find((c) => c.remote === remote.name);
        const status = connection ? pc.green('✓') : pc.yellow('○');

        console.log(`          ${prefix}── ${icon} ${pc.yellow(remote.name)} :${remote.port} ${status}`);
      });
    } else {
      console.log();
      console.log(pc.dim('    No remotes found'));
    }

    console.log();

    // Show legend
    console.log(pc.dim('  Legend:'));
    console.log(pc.dim('    ✓ Connected to shell'));
    console.log(pc.dim('    ○ Not yet connected'));
    console.log(pc.dim('    ⚛️ React  🟢 Vue'));
    console.log();
  });
