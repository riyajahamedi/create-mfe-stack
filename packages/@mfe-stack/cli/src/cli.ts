import { Command } from 'commander';
import pc from 'picocolors';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { addCommand } from './commands/add.js';
import { graphCommand } from './commands/graph.js';
import { depsCommand } from './commands/deps.js';

const program = new Command();

program
  .name('mfe')
  .description('Development CLI for micro-frontend projects')
  .version('0.1.0')
  .hook('preAction', () => {
    console.log();
    console.log(
      pc.cyan(pc.bold('  @mfe-stack/cli')) + pc.gray(' - MFE Development Tools')
    );
  });

// Add commands
program.addCommand(devCommand);
program.addCommand(buildCommand);
program.addCommand(addCommand);
program.addCommand(graphCommand);
program.addCommand(depsCommand);

// Handle unknown commands
program.on('command:*', (operands) => {
  console.log();
  console.log(pc.red(`Unknown command: ${operands[0]}`));
  console.log();
  console.log('Available commands:');
  console.log(pc.cyan('  dev    ') + 'Start development servers');
  console.log(pc.cyan('  build  ') + 'Build applications for production');
  console.log(pc.cyan('  add    ') + 'Add a new remote micro-frontend');
  console.log(pc.cyan('  graph  ') + 'Visualize MFE dependency graph');
  console.log(pc.cyan('  deps   ') + 'Manage shared dependencies');
  console.log();
  process.exit(1);
});

export function run(): void {
  program.parse();
}
