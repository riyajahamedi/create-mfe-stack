import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';

// Mock external dependencies
vi.mock('find-up', () => ({
  findUp: vi.fn(),
}));

vi.mock('fs-extra', () => ({
  default: {
    pathExists: vi.fn(),
    readdir: vi.fn(),
    readJson: vi.fn(),
    readFile: vi.fn(),
  },
}));

import { findUp } from 'find-up';
import fs from 'fs-extra';
import { detectProject, getApps } from '../../utils/project.js';
import type { MfeProject } from '../../types.js';

describe('project utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectProject', () => {
    it('should return null when no turbo.json found', async () => {
      vi.mocked(findUp).mockResolvedValue(undefined);

      const result = await detectProject();

      expect(result).toBeNull();
    });

    it('should return null when turbo.json exists but no apps directory', async () => {
      vi.mocked(findUp).mockResolvedValue('/project/turbo.json');
      vi.mocked(fs.pathExists).mockResolvedValue(false);

      const result = await detectProject();

      expect(result).toBeNull();
    });

    it('should detect pnpm as package manager', async () => {
      vi.mocked(findUp).mockResolvedValue('/project/turbo.json');
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true) // apps directory
        .mockResolvedValueOnce(true) // pnpm-lock.yaml
        .mockResolvedValueOnce(false); // yarn.lock

      const result = await detectProject();

      expect(result).toEqual({
        root: '/project',
        type: 'monorepo',
        packageManager: 'pnpm',
      });
    });

    it('should detect yarn as package manager', async () => {
      vi.mocked(findUp).mockResolvedValue('/project/turbo.json');
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true) // apps directory
        .mockResolvedValueOnce(false) // pnpm-lock.yaml
        .mockResolvedValueOnce(true); // yarn.lock

      const result = await detectProject();

      expect(result).toEqual({
        root: '/project',
        type: 'monorepo',
        packageManager: 'yarn',
      });
    });

    it('should default to npm as package manager', async () => {
      vi.mocked(findUp).mockResolvedValue('/project/turbo.json');
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true) // apps directory
        .mockResolvedValueOnce(false) // pnpm-lock.yaml
        .mockResolvedValueOnce(false); // yarn.lock

      const result = await detectProject();

      expect(result).toEqual({
        root: '/project',
        type: 'monorepo',
        packageManager: 'npm',
      });
    });
  });

  describe('getApps', () => {
    const mockProject: MfeProject = {
      root: '/project',
      type: 'monorepo',
      packageManager: 'pnpm',
    };

    it('should return empty array when apps directory does not exist', async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(false);

      const result = await getApps(mockProject);

      expect(result).toEqual([]);
    });

    it('should detect shell app correctly', async () => {
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true) // apps directory
        .mockResolvedValueOnce(true) // package.json
        .mockResolvedValueOnce(true); // vite.config.ts

      vi.mocked(fs.readdir).mockResolvedValue([
        { name: 'shell', isDirectory: () => true },
      ] as unknown as ReturnType<typeof fs.readdir>);

      vi.mocked(fs.readJson).mockResolvedValue({
        name: '@project/shell',
        dependencies: { react: '^18.0.0' },
      });

      vi.mocked(fs.readFile).mockResolvedValue(`
        import { defineConfig } from 'vite';
        export default defineConfig({
          server: { port: 3000 },
          plugins: [federation({ remotes: {} })]
        });
      `);

      const result = await getApps(mockProject);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: 'shell',
        type: 'shell',
        framework: 'react',
      });
    });

    it('should detect Vue framework from dependencies', async () => {
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true) // apps directory
        .mockResolvedValueOnce(true) // package.json
        .mockResolvedValueOnce(true); // vite.config.ts

      vi.mocked(fs.readdir).mockResolvedValue([
        { name: 'remote-vue', isDirectory: () => true },
      ] as unknown as ReturnType<typeof fs.readdir>);

      vi.mocked(fs.readJson).mockResolvedValue({
        name: '@project/remote-vue',
        dependencies: { vue: '^3.0.0' },
      });

      vi.mocked(fs.readFile).mockResolvedValue(`
        import { defineConfig } from 'vite';
        export default defineConfig({
          server: { port: 3002 },
        });
      `);

      const result = await getApps(mockProject);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: 'remote-vue',
        type: 'remote',
        framework: 'vue',
        port: 3002,
      });
    });

    it('should sort apps by port', async () => {
      vi.mocked(fs.pathExists)
        .mockResolvedValueOnce(true) // apps directory
        .mockResolvedValueOnce(true) // package.json app1
        .mockResolvedValueOnce(true) // vite.config.ts app1
        .mockResolvedValueOnce(true) // package.json app2
        .mockResolvedValueOnce(true); // vite.config.ts app2

      vi.mocked(fs.readdir).mockResolvedValue([
        { name: 'remote-b', isDirectory: () => true },
        { name: 'shell', isDirectory: () => true },
      ] as unknown as ReturnType<typeof fs.readdir>);

      vi.mocked(fs.readJson)
        .mockResolvedValueOnce({ name: 'remote-b', dependencies: {} })
        .mockResolvedValueOnce({ name: 'shell', dependencies: {} });

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce('server: { port: 3002 }')
        .mockResolvedValueOnce('server: { port: 3000, remotes: {} }');

      const result = await getApps(mockProject);

      expect(result[0].port).toBeLessThanOrEqual(result[1]?.port ?? Infinity);
    });

    it('should skip non-directory entries', async () => {
      vi.mocked(fs.pathExists).mockResolvedValueOnce(true);

      vi.mocked(fs.readdir).mockResolvedValue([
        { name: 'README.md', isDirectory: () => false },
        { name: '.gitkeep', isDirectory: () => false },
      ] as unknown as ReturnType<typeof fs.readdir>);

      const result = await getApps(mockProject);

      expect(result).toEqual([]);
    });
  });
});
