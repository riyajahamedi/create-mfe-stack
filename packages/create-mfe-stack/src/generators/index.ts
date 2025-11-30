import path from 'node:path';
import { execSync } from 'node:child_process';
import fs from 'fs-extra';
import { generateMonorepo } from './monorepo.js';
import { generateShell } from './shell.js';
import { generateRemote } from './remote.js';
import { logger } from '../utils/logger.js';
import { getInstallCommand } from '../utils/package-manager.js';
import type { GeneratorConfig } from '../types.js';

export type { GeneratorConfig };

export async function generateProject(options: GeneratorConfig): Promise<void> {
  const targetDir = path.resolve(process.cwd(), options.projectName);

  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    if (files.length > 0) {
      throw new Error(
        `Directory "${options.projectName}" already exists and is not empty`
      );
    }
  }

  logger.info(`Creating project in ${targetDir}...`);

  // Generate base monorepo structure
  await generateMonorepo(targetDir, options);

  // Generate apps based on project type
  if (options.projectType === 'complete' || options.projectType === 'shell') {
    await generateShell(targetDir, options);
  }

  if (options.projectType === 'complete' || options.projectType === 'remote') {
    await generateRemote(targetDir, options);
  }

  // Generate GitHub Actions if selected
  if (options.features.githubActions) {
    await generateGitHubActions(targetDir, options);
  }

  // Generate Docker files if selected
  if (options.features.docker) {
    await generateDocker(targetDir, options);
  }

  // Initialize git
  if (options.initGit) {
    await initializeGit(targetDir);
  }

  // Install dependencies
  if (!options.skipInstall) {
    await installDependencies(targetDir, options);
  }

  logger.success('Project structure generated!');
}

async function generateGitHubActions(
  targetDir: string,
  options: GeneratorConfig
): Promise<void> {
  logger.info('Generating GitHub Actions workflow...');

  const workflowDir = path.join(targetDir, '.github', 'workflows');
  await fs.ensureDir(workflowDir);

  const ciContent = `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
${options.packageManager === 'pnpm' ? `
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
` : ''}
      - name: Install dependencies
        run: ${getInstallCommand(options.packageManager)}

      - name: Lint
        run: ${options.packageManager === 'npm' ? 'npm run' : options.packageManager} lint

      - name: Build
        run: ${options.packageManager === 'npm' ? 'npm run' : options.packageManager} build
`;

  await fs.writeFile(path.join(workflowDir, 'ci.yml'), ciContent);
}

async function generateDocker(
  targetDir: string,
  options: GeneratorConfig
): Promise<void> {
  logger.info('Generating Docker configuration...');

  const dockerfileContent = `# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm if needed
${options.packageManager === 'pnpm' ? 'RUN npm install -g pnpm' : ''}

# Copy package files
COPY package*.json ./
${options.packageManager === 'pnpm' ? 'COPY pnpm-lock.yaml ./' : ''}
${options.packageManager === 'yarn' ? 'COPY yarn.lock ./' : ''}

# Install dependencies
RUN ${getInstallCommand(options.packageManager)}

# Copy source files
COPY . .

# Build the application
RUN ${options.packageManager === 'npm' ? 'npm run' : options.packageManager} build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/apps/shell/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;

  const dockerComposeContent = `version: '3.8'

services:
  shell:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production

  # Add additional remote services as needed
  # remote1:
  #   build:
  #     context: ./apps/remote1
  #   ports:
  #     - "3001:80"
`;

  const dockerignoreContent = `node_modules
dist
.git
.github
*.log
.env*
.turbo
`;

  await fs.writeFile(path.join(targetDir, 'Dockerfile'), dockerfileContent);
  await fs.writeFile(
    path.join(targetDir, 'docker-compose.yml'),
    dockerComposeContent
  );
  await fs.writeFile(path.join(targetDir, '.dockerignore'), dockerignoreContent);
}

async function initializeGit(targetDir: string): Promise<void> {
  logger.info('Initializing git repository...');

  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    execSync('git add -A', { cwd: targetDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from create-mfe-stack"', {
      cwd: targetDir,
      stdio: 'ignore',
    });
  } catch {
    logger.warning('Failed to initialize git repository');
  }
}

async function installDependencies(
  targetDir: string,
  options: GeneratorConfig
): Promise<void> {
  logger.info('Installing dependencies...');

  const command = getInstallCommand(options.packageManager);

  try {
    execSync(command, { cwd: targetDir, stdio: 'inherit' });
    logger.success('Dependencies installed!');
  } catch {
    logger.warning('Failed to install dependencies. Please run install manually.');
  }
}
