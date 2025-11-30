import { Command } from 'commander';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { detectProject, getApps } from '../utils/project.js';
import { logger } from '../utils/logger.js';
import type { DependencyVersion, DependencyConflict } from '../types.js';

// Dependencies that should be aligned across MFEs
const SHARED_DEPENDENCIES = [
  'react',
  'react-dom',
  'vue',
  'typescript',
  'vite',
  '@vitejs/plugin-react',
  '@vitejs/plugin-vue',
  '@originjs/vite-plugin-federation',
];

export const depsCommand = new Command('deps')
  .description('Manage shared dependencies')
  .option('-c, --check', 'Check for version conflicts')
  .option('-s, --sync', 'Sync dependency versions (not yet implemented)')
  .action(async (options) => {
    const project = await detectProject();

    if (!project) {
      logger.error('Not in a create-mfe-stack project');
      logger.dim('  Make sure you are in a directory with turbo.json and an apps/ folder');
      process.exit(1);
    }

    if (!options.check && !options.sync) {
      logger.info('Specify --check to check for conflicts or --sync to align versions');
      process.exit(0);
    }

    const apps = await getApps(project);

    if (apps.length === 0) {
      logger.warning('No apps found in the project');
      process.exit(1);
    }

    logger.title('📦 Dependency Analysis');

    // Collect all dependency versions
    const allDependencies: Map<string, DependencyVersion[]> = new Map();

    for (const app of apps) {
      const pkgPath = path.join(app.path, 'package.json');
      if (!(await fs.pathExists(pkgPath))) continue;

      const pkg = await fs.readJson(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      for (const [name, version] of Object.entries(deps)) {
        if (!SHARED_DEPENDENCIES.includes(name)) continue;

        if (!allDependencies.has(name)) {
          allDependencies.set(name, []);
        }

        allDependencies.get(name)!.push({
          name,
          version: version as string,
          app: app.name,
        });
      }
    }

    // Find conflicts
    const conflicts: DependencyConflict[] = [];

    for (const [name, versions] of allDependencies) {
      const uniqueVersions = new Set(versions.map((v) => v.version));
      if (uniqueVersions.size > 1) {
        conflicts.push({ name, versions });
      }
    }

    if (options.check) {
      if (conflicts.length === 0) {
        logger.success('No version conflicts found!');
        console.log();

        // Show aligned dependencies
        console.log(pc.dim('  Shared dependencies:'));
        for (const [name, versions] of allDependencies) {
          const version = versions[0]?.version || 'N/A';
          const appCount = versions.length;
          console.log(pc.dim(`    • ${name}@${version} (${appCount} apps)`));
        }
        console.log();
      } else {
        logger.warning(`Found ${conflicts.length} version conflict(s):`);
        console.log();

        for (const conflict of conflicts) {
          console.log(pc.yellow(`  ⚠ ${conflict.name}`));
          for (const version of conflict.versions) {
            console.log(pc.gray(`      ${version.app}: ${version.version}`));
          }
          console.log();
        }

        logger.dim('  Run "mfe deps --sync" to align versions');
        console.log();
        process.exit(1);
      }
    }

    if (options.sync) {
      logger.warning('Dependency sync is not yet implemented');
      logger.dim('  For now, manually update package.json files to align versions');
      console.log();

      if (conflicts.length > 0) {
        console.log('  Suggested versions (latest from each conflict):');
        for (const conflict of conflicts) {
          // Sort versions and suggest the highest one
          const sortedVersions = conflict.versions
            .map((v) => v.version)
            .sort()
            .reverse();
          console.log(pc.cyan(`    ${conflict.name}: ${sortedVersions[0]}`));
        }
        console.log();
      }
    }
  });
