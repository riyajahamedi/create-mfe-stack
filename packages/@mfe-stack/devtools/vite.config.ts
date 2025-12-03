import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, renameSync, rmSync, readFileSync, writeFileSync } from 'fs';

// Plugin to copy extension files and fix paths after build
function copyExtensionFiles(): Plugin {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      
      // Copy manifest.json
      copyFileSync(
        resolve(__dirname, 'src/manifest.json'),
        resolve(distDir, 'manifest.json')
      );
      
      // Ensure icons directory exists
      const iconsDir = resolve(distDir, 'icons');
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }
      
      // Copy icons
      const iconSizes = ['16', '48', '128'];
      for (const size of iconSizes) {
        const iconFile = `icon-${size}.png`;
        const srcPath = resolve(__dirname, 'public/icons', iconFile);
        if (existsSync(srcPath)) {
          copyFileSync(srcPath, resolve(iconsDir, iconFile));
        }
      }
      
      // Copy devtools.html
      copyFileSync(
        resolve(__dirname, 'src/devtools/devtools.html'),
        resolve(distDir, 'devtools/devtools.html')
      );
      
      // Move the panel index.html to correct location
      const srcPanelHtml = resolve(distDir, 'src/devtools/panel/index.html');
      const destPanelDir = resolve(distDir, 'devtools/panel');
      if (!existsSync(destPanelDir)) {
        mkdirSync(destPanelDir, { recursive: true });
      }
      if (existsSync(srcPanelHtml)) {
        // Read and fix the paths in index.html
        let content = readFileSync(srcPanelHtml, 'utf-8');
        // Fix asset paths for extension context (use relative paths)
        content = content.replace(/src="\/devtools\/panel\/index\.js"/g, 'src="index.js"');
        content = content.replace(/href="\/assets\//g, 'href="../../assets/');
        writeFileSync(resolve(destPanelDir, 'index.html'), content);
        
        // Remove the src directory
        rmSync(resolve(distDir, 'src'), { recursive: true, force: true });
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  build: {
    outDir: 'dist',
    emptyDirBeforeWrite: true,
    rollupOptions: {
      input: {
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'content/content-script': resolve(__dirname, 'src/content/content-script.ts'),
        'devtools/devtools': resolve(__dirname, 'src/devtools/devtools.ts'),
        'devtools/panel/index': resolve(__dirname, 'src/devtools/panel/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    sourcemap: true,
    minify: false,
  },
  publicDir: 'public',
});
