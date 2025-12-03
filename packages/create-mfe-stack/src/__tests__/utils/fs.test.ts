import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import { copyTemplateDir, type TemplateData } from '../../utils/fs.js';

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureDir: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    copy: vi.fn(),
  },
}));

// Mock ejs
vi.mock('ejs', () => ({
  default: {
    render: vi.fn((template: string, data: TemplateData) => {
      return template.replace('<%= projectName %>', data.projectName);
    }),
  },
}));

import fs from 'fs-extra';
import ejs from 'ejs';

describe('fs utilities', () => {
  const mockData: TemplateData = {
    projectName: 'test-project',
    appName: 'test-app',
    port: 3000,
    features: {
      typescript: true,
      eslint: true,
      prettier: true,
      testing: false,
      stateManagement: false,
      i18n: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('copyTemplateDir', () => {
    it('should create target directory', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([]);

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.ensureDir).toHaveBeenCalledWith('/target');
    });

    it('should copy regular files without processing', async () => {
      vi.mocked(fs.readdir).mockResolvedValue(['file.txt' as unknown as never]);
      vi.mocked(fs.stat).mockResolvedValue({
        isDirectory: () => false,
      } as unknown as ReturnType<typeof fs.stat>);

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.copy).toHaveBeenCalledWith(
        path.join('/source', 'file.txt'),
        path.join('/target', 'file.txt')
      );
    });

    it('should process .ejs files and render templates', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        'package.json.ejs' as unknown as never,
      ]);
      vi.mocked(fs.stat).mockResolvedValue({
        isDirectory: () => false,
      } as unknown as ReturnType<typeof fs.stat>);
      vi.mocked(fs.readFile).mockResolvedValue(
        '{"name": "<%= projectName %>"}'
      );

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.readFile).toHaveBeenCalledWith(
        path.join('/source', 'package.json.ejs'),
        'utf-8'
      );
      expect(ejs.render).toHaveBeenCalledWith(
        '{"name": "<%= projectName %>"}',
        mockData
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/target', 'package.json'),
        '{"name": "test-project"}'
      );
    });

    it('should recursively copy subdirectories', async () => {
      // First call returns a directory
      vi.mocked(fs.readdir)
        .mockResolvedValueOnce(['subdir' as unknown as never])
        .mockResolvedValueOnce([]);

      vi.mocked(fs.stat).mockResolvedValue({
        isDirectory: () => true,
      } as unknown as ReturnType<typeof fs.stat>);

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.ensureDir).toHaveBeenCalledWith('/target');
      expect(fs.ensureDir).toHaveBeenCalledWith(path.join('/target', 'subdir'));
    });

    it('should handle mixed content (files and directories)', async () => {
      vi.mocked(fs.readdir)
        .mockResolvedValueOnce([
          'dir' as unknown as never,
          'file.ts' as unknown as never,
          'template.ejs' as unknown as never,
        ])
        .mockResolvedValueOnce([]);

      vi.mocked(fs.stat)
        .mockResolvedValueOnce({
          isDirectory: () => true,
        } as unknown as ReturnType<typeof fs.stat>)
        .mockResolvedValueOnce({
          isDirectory: () => false,
        } as unknown as ReturnType<typeof fs.stat>)
        .mockResolvedValueOnce({
          isDirectory: () => false,
        } as unknown as ReturnType<typeof fs.stat>);

      vi.mocked(fs.readFile).mockResolvedValue('<%= projectName %>');

      await copyTemplateDir('/source', '/target', mockData);

      // Directory was recursively processed
      expect(fs.ensureDir).toHaveBeenCalledWith(path.join('/target', 'dir'));
      // Regular file was copied
      expect(fs.copy).toHaveBeenCalledWith(
        path.join('/source', 'file.ts'),
        path.join('/target', 'file.ts')
      );
      // EJS file was rendered
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join('/target', 'template'),
        'test-project'
      );
    });
  });
});
