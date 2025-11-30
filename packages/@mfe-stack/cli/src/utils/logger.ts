import pc from 'picocolors';

export const logger = {
  info: (message: string): void => {
    console.log(pc.blue('ℹ'), message);
  },

  success: (message: string): void => {
    console.log(pc.green('✓'), message);
  },

  warning: (message: string): void => {
    console.log(pc.yellow('⚠'), message);
  },

  error: (message: string): void => {
    console.log(pc.red('✖'), message);
  },

  log: (message: string): void => {
    console.log(message);
  },

  dim: (message: string): void => {
    console.log(pc.dim(message));
  },

  title: (message: string): void => {
    console.log();
    console.log(pc.cyan(pc.bold(`  ${message}`)));
    console.log();
  },

  step: (message: string): void => {
    console.log(pc.gray(`  • ${message}`));
  },

  url: (name: string, url: string): void => {
    console.log(pc.gray(`  • ${name}: `) + pc.green(url));
  },
};
