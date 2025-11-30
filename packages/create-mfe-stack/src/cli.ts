import { Command } from 'commander';
import { runPrompts } from './prompts/index.js';
import { generateProject } from './generators/index.js';
import { logger } from './utils/logger.js';
import pc from 'picocolors';

const program = new Command();

program
  .name('create-mfe-stack')
  .description('CLI to scaffold production-ready micro-frontend architectures')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (react, vue)')
  .option('--skip-install', 'Skip package installation')
  .option('--no-git', 'Skip git initialization')
  .action(async (projectName: string | undefined, options) => {
    try {
      console.log();
      console.log(
        pc.cyan(pc.bold('  create-mfe-stack')) +
          pc.gray(' - Scaffold micro-frontend architectures')
      );
      console.log();

      const answers = await runPrompts(projectName);

      if (!answers) {
        logger.info('Setup cancelled');
        process.exit(0);
      }

      await generateProject({
        ...answers,
        skipInstall: options.skipInstall,
        initGit: options.git !== false,
      });

      console.log();
      logger.success('Project created successfully!');
      console.log();
      console.log('  Next steps:');
      console.log();
      console.log(pc.cyan(`    cd ${answers.projectName}`));
      console.log(pc.cyan('    pnpm install'));
      console.log(pc.cyan('    pnpm dev'));
      console.log();
    } catch (error) {
      logger.error('Failed to create project');
      if (error instanceof Error) {
        logger.error(error.message);
      }
      process.exit(1);
    }
  });

export function run(): void {
  program.parse();
}
