import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import type { TemplateData } from '../../utils/fs.js';

// We need to mock before importing the module that uses these dependencies
vi.mock('fs-extra');
vi.mock('ejs');

describe('fs utilities', () => {
  const mockData: TemplateData = {
    projectName: 'test-project',
    appName: 'test-app',
    port: 3000,
    features: {
      sharedState: true,
      designSystem: false,
      githubActions: true,
      docker: false,
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
      const fs = await import('fs-extra');
      const { copyTemplateDir } = await import('../../utils/fs.js');
      
      vi.mocked(fs.default.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.default.readdir).mockResolvedValue([] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>);

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.default.ensureDir).toHaveBeenCalledWith('/target');
    });

    it('should copy regular files without processing', async () => {
      const fs = await import('fs-extra');
      const { copyTemplateDir } = await import('../../utils/fs.js');
      
      vi.mocked(fs.default.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.default.readdir).mockResolvedValue(['file.txt'] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>);
      vi.mocked(fs.default.stat).mockResolvedValue({
        isDirectory: () => false,
      } as unknown as Awaited<ReturnType<typeof fs.default.stat>>);
      vi.mocked(fs.default.copy).mockResolvedValue(undefined);

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.default.copy).toHaveBeenCalledWith(
        path.join('/source', 'file.txt'),
        path.join('/target', 'file.txt')
      );
    });

    it('should process .ejs files and render templates', async () => {
      const fs = await import('fs-extra');
      const ejs = await import('ejs');
      const { copyTemplateDir } = await import('../../utils/fs.js');
      
      vi.mocked(fs.default.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.default.readdir).mockResolvedValue(['package.json.ejs'] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>);
      vi.mocked(fs.default.stat).mockResolvedValue({
        isDirectory: () => false,
      } as unknown as Awaited<ReturnType<typeof fs.default.stat>>);
      vi.mocked(fs.default.readFile).mockResolvedValue('{"name": "<%= projectName %>"}' as unknown as Awaited<ReturnType<typeof fs.default.readFile>>);
      vi.mocked(fs.default.writeFile).mockResolvedValue(undefined);
      vi.mocked(ejs.default.render).mockReturnValue('{"name": "test-project"}');

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.default.readFile).toHaveBeenCalledWith(
        path.join('/source', 'package.json.ejs'),
        'utf-8'
      );
      expect(ejs.default.render).toHaveBeenCalled();
      expect(fs.default.writeFile).toHaveBeenCalledWith(
        path.join('/target', 'package.json'),
        '{"name": "test-project"}'
      );
    });

    it('should recursively copy subdirectories', async () => {
      const fs = await import('fs-extra');
      const { copyTemplateDir } = await import('../../utils/fs.js');
      
      vi.mocked(fs.default.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.default.readdir)
        .mockResolvedValueOnce(['subdir'] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>)
        .mockResolvedValueOnce([] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>);
      vi.mocked(fs.default.stat).mockResolvedValue({
        isDirectory: () => true,
      } as unknown as Awaited<ReturnType<typeof fs.default.stat>>);

      await copyTemplateDir('/source', '/target', mockData);

      expect(fs.default.ensureDir).toHaveBeenCalledWith('/target');
      expect(fs.default.ensureDir).toHaveBeenCalledWith(path.join('/target', 'subdir'));
    });

    it('should handle mixed content (files and directories)', async () => {
      const fs = await import('fs-extra');
      const ejs = await import('ejs');
      const { copyTemplateDir } = await import('../../utils/fs.js');
      
      vi.mocked(fs.default.ensureDir).mockResolvedValue(undefined);
      vi.mocked(fs.default.readdir)
        .mockResolvedValueOnce(['dir', 'file.ts', 'template.ejs'] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>)
        .mockResolvedValueOnce([] as unknown as Awaited<ReturnType<typeof fs.default.readdir>>);
      vi.mocked(fs.default.stat)
        .mockResolvedValueOnce({ isDirectory: () => true } as unknown as Awaited<ReturnType<typeof fs.default.stat>>)
        .mockResolvedValueOnce({ isDirectory: () => false } as unknown as Awaited<ReturnType<typeof fs.default.stat>>)
        .mockResolvedValueOnce({ isDirectory: () => false } as unknown as Awaited<ReturnType<typeof fs.default.stat>>);
      vi.mocked(fs.default.copy).mockResolvedValue(undefined);
      vi.mocked(fs.default.readFile).mockResolvedValue('<%= projectName %>' as unknown as Awaited<ReturnType<typeof fs.default.readFile>>);
      vi.mocked(fs.default.writeFile).mockResolvedValue(undefined);
      vi.mocked(ejs.default.render).mockReturnValue('test-project');

      await copyTemplateDir('/source', '/target', mockData);

      // Directory was recursively processed
      expect(fs.default.ensureDir).toHaveBeenCalledWith(path.join('/target', 'dir'));
      // Regular file was copied
      expect(fs.default.copy).toHaveBeenCalledWith(
        path.join('/source', 'file.ts'),
        path.join('/target', 'file.ts')
      );
      // EJS file was rendered
      expect(fs.default.writeFile).toHaveBeenCalledWith(
        path.join('/target', 'template'),
        'test-project'
      );
    });
  });
});
