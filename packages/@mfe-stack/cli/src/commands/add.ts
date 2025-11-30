import { Command } from 'commander';
import * as p from '@clack/prompts';
import fs from 'fs-extra';
import path from 'path';
import pc from 'picocolors';
import { detectProject, getApps, getRunCommand } from '../utils/project.js';
import { getNextAvailablePort } from '../utils/ports.js';
import { logger } from '../utils/logger.js';

export const addCommand = new Command('add')
  .description('Add a new remote micro-frontend')
  .argument('<name>', 'Name of the remote')
  .option('-f, --framework <framework>', 'Framework (react or vue)')
  .option('-p, --port <port>', 'Port number')
  .action(async (name: string, options) => {
    const project = await detectProject();

    if (!project) {
      logger.error('Not in a create-mfe-stack project');
      logger.dim('  Make sure you are in a directory with turbo.json and an apps/ folder');
      process.exit(1);
    }

    const apps = await getApps(project);

    // Check if app already exists
    if (apps.find((a) => a.name === name)) {
      logger.error(`An app named "${name}" already exists`);
      process.exit(1);
    }

    // Get framework if not provided
    let framework = options.framework;
    if (!framework) {
      const result = await p.select({
        message: 'Select framework',
        options: [
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
        ],
      });

      if (p.isCancel(result)) {
        logger.info('Operation cancelled');
        process.exit(0);
      }

      framework = result as string;
    }

    // Get port if not provided
    const existingPorts = apps.map((a) => a.port);
    const suggestedPort = getNextAvailablePort(existingPorts);

    let port = options.port;
    if (!port) {
      const result = await p.text({
        message: 'Port number',
        placeholder: String(suggestedPort),
        defaultValue: String(suggestedPort),
        validate: (value) => {
          const num = parseInt(value);
          if (isNaN(num) || num < 1 || num > 65535) {
            return 'Please enter a valid port number (1-65535)';
          }
          if (existingPorts.includes(num)) {
            return `Port ${num} is already in use by another app`;
          }
        },
      });

      if (p.isCancel(result)) {
        logger.info('Operation cancelled');
        process.exit(0);
      }

      port = result;
    }

    const portNum = parseInt(port);

    logger.title('📦 Adding New Remote');

    console.log(pc.gray(`  Name:      `) + pc.white(name));
    console.log(pc.gray(`  Framework: `) + pc.white(framework));
    console.log(pc.gray(`  Port:      `) + pc.white(String(portNum)));
    console.log();

    // Get project name from root package.json
    const rootPkgPath = path.join(project.root, 'package.json');
    const rootPkg = await fs.readJson(rootPkgPath);
    const projectName = rootPkg.name?.replace('-monorepo', '') || 'mfe-platform';

    // Create remote directory
    const remotePath = path.join(project.root, 'apps', name);
    await fs.ensureDir(remotePath);

    // Create package.json
    const packageJson = {
      name: `@${projectName}/${name}`,
      version: '0.0.1',
      private: true,
      type: 'module',
      scripts: {
        dev: `vite --port ${portNum}`,
        build: 'tsc && vite build',
        preview: `vite preview --port ${portNum}`,
        lint: 'tsc --noEmit',
      },
      dependencies:
        framework === 'vue'
          ? { vue: '^3.4.0' }
          : { react: '^18.2.0', 'react-dom': '^18.2.0' },
      devDependencies:
        framework === 'vue'
          ? {
              '@originjs/vite-plugin-federation': '^1.3.5',
              '@vitejs/plugin-vue': '^5.0.0',
              typescript: '^5.3.3',
              vite: '^5.0.12',
            }
          : {
              '@originjs/vite-plugin-federation': '^1.3.5',
              '@types/react': '^18.2.48',
              '@types/react-dom': '^18.2.18',
              '@vitejs/plugin-react': '^4.2.1',
              typescript: '^5.3.3',
              vite: '^5.0.12',
            },
    };

    await fs.writeJson(path.join(remotePath, 'package.json'), packageJson, {
      spaces: 2,
    });

    // Create vite.config.ts
    const viteConfig =
      framework === 'vue'
        ? `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: '${name}',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.vue',
      },
      shared: ['vue'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: ${portNum},
    strictPort: true,
  },
  preview: {
    port: ${portNum},
    strictPort: true,
  },
});
`
        : `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '${name}',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: ${portNum},
    strictPort: true,
  },
  preview: {
    port: ${portNum},
    strictPort: true,
  },
});
`;

    await fs.writeFile(path.join(remotePath, 'vite.config.ts'), viteConfig);

    // Create tsconfig files
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        ...(framework === 'vue'
          ? {}
          : { jsx: 'react-jsx' }),
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    };

    const tsconfigNode = {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
        strict: true,
      },
      include: ['vite.config.ts'],
    };

    await fs.writeJson(path.join(remotePath, 'tsconfig.json'), tsconfig, {
      spaces: 2,
    });
    await fs.writeJson(
      path.join(remotePath, 'tsconfig.node.json'),
      tsconfigNode,
      { spaces: 2 }
    );

    // Create src directory and files
    const srcPath = path.join(remotePath, 'src');
    await fs.ensureDir(srcPath);

    if (framework === 'vue') {
      // Vue files
      await fs.writeFile(
        path.join(srcPath, 'App.vue'),
        `<script setup lang="ts">
defineProps<{
  msg?: string
}>()
</script>

<template>
  <div class="${name}-container">
    <h2>{{ msg || '${name} Remote' }}</h2>
    <p>This is the ${name} micro-frontend</p>
  </div>
</template>

<style scoped>
.${name}-container {
  padding: 1rem;
  border: 2px solid #42b883;
  border-radius: 8px;
  margin: 1rem;
}
</style>
`
      );

      await fs.writeFile(
        path.join(srcPath, 'main.ts'),
        `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
`
      );

      // Vue type declaration
      await fs.writeFile(
        path.join(remotePath, 'env.d.ts'),
        `/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
`
      );
    } else {
      // React files
      await fs.writeFile(
        path.join(srcPath, 'App.tsx'),
        `import { useState } from 'react';

interface AppProps {
  msg?: string;
}

function App({ msg }: AppProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="${name}-container" style={{
      padding: '1rem',
      border: '2px solid #61dafb',
      borderRadius: '8px',
      margin: '1rem',
    }}>
      <h2>{msg || '${name} Remote'}</h2>
      <p>This is the ${name} micro-frontend</p>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default App;
`
      );

      await fs.writeFile(
        path.join(srcPath, 'main.tsx'),
        `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
      );

      await fs.writeFile(
        path.join(srcPath, 'vite-env.d.ts'),
        `/// <reference types="vite/client" />
`
      );
    }

    // Create index.html
    const indexHtml =
      framework === 'vue'
        ? `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
        : `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

    await fs.writeFile(path.join(remotePath, 'index.html'), indexHtml);

    // Create README
    await fs.writeFile(
      path.join(remotePath, 'README.md'),
      `# ${name}

A ${framework === 'vue' ? 'Vue' : 'React'} micro-frontend remote application.

## Development

\`\`\`bash
# Start development server
${getRunCommand(project.packageManager, 'dev')}
\`\`\`

## Port

This remote runs on port ${portNum}.

## Exposed Modules

- \`./App\` - Main application component
`
    );

    // Try to update shell's vite.config.ts to include new remote
    const shell = apps.find((a) => a.type === 'shell');
    if (shell) {
      const shellVitePath = path.join(shell.path, 'vite.config.ts');
      if (await fs.pathExists(shellVitePath)) {
        try {
          let shellViteConfig = await fs.readFile(shellVitePath, 'utf-8');

          // Add new remote to remotes object
          const remotesMatch = shellViteConfig.match(/(remotes:\s*{)([^}]*)(})/s);
          if (remotesMatch) {
            const existingRemotes = remotesMatch[2];
            const newRemote = `${name}: 'http://localhost:${portNum}/assets/remoteEntry.js',`;
            
            // Determine indentation from existing remotes or use default
            const indentMatch = existingRemotes.match(/\n(\s+)\w/);
            const indent = indentMatch ? indentMatch[1] : '        ';
            
            // Check if there are existing remotes
            const hasRemotes = existingRemotes.trim().length > 0;
            
            if (hasRemotes) {
              // Append new remote after existing ones
              const trimmedRemotes = existingRemotes.trimEnd();
              const hasTrailingComma = trimmedRemotes.endsWith(',');
              const updatedRemotes = hasTrailingComma 
                ? `${trimmedRemotes}\n${indent}${newRemote}`
                : `${trimmedRemotes},\n${indent}${newRemote}`;
              shellViteConfig = shellViteConfig.replace(
                remotesMatch[0],
                `${remotesMatch[1]}${updatedRemotes}\n      ${remotesMatch[3]}`
              );
            } else {
              shellViteConfig = shellViteConfig.replace(
                remotesMatch[0],
                `${remotesMatch[1]}\n${indent}${newRemote}\n      ${remotesMatch[3]}`
              );
            }

            await fs.writeFile(shellVitePath, shellViteConfig);
            logger.success('Updated shell vite.config.ts with new remote');
          }
        } catch {
          logger.warning("Could not update shell's vite.config.ts automatically");
          logger.dim(`  Add this to the shell's remotes config:`);
          logger.dim(`    ${name}: 'http://localhost:${portNum}/assets/remoteEntry.js'`);
        }
      }
    }

    console.log();
    logger.success(`Added remote "${name}" on port ${portNum}`);
    console.log();
    console.log('  Next steps:');
    console.log(pc.cyan(`    ${getRunCommand(project.packageManager, 'install')}`));
    console.log(pc.cyan(`    mfe dev`));
    console.log();
  });
