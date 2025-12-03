import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  detectPackageManager,
  getInstallCommand,
  getRunCommand,
  installDependencies,
} from '../../utils/package-manager.js';

describe('package-manager utilities', () => {
  describe('detectPackageManager', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should detect pnpm from user agent', () => {
      process.env.npm_config_user_agent = 'pnpm/9.1.0 node/v20.0.0';
      expect(detectPackageManager()).toBe('pnpm');
    });

    it('should detect yarn from user agent', () => {
      process.env.npm_config_user_agent = 'yarn/1.22.0 node/v20.0.0';
      expect(detectPackageManager()).toBe('yarn');
    });

    it('should detect npm from user agent', () => {
      process.env.npm_config_user_agent = 'npm/10.0.0 node/v20.0.0';
      expect(detectPackageManager()).toBe('npm');
    });

    it('should default to npm when no user agent is set', () => {
      delete process.env.npm_config_user_agent;
      expect(detectPackageManager()).toBe('npm');
    });

    it('should default to npm for unknown user agent', () => {
      process.env.npm_config_user_agent = 'unknown/1.0.0';
      expect(detectPackageManager()).toBe('npm');
    });
  });

  describe('getInstallCommand', () => {
    it('should return pnpm install for pnpm', () => {
      expect(getInstallCommand('pnpm')).toBe('pnpm install');
    });

    it('should return yarn for yarn', () => {
      expect(getInstallCommand('yarn')).toBe('yarn');
    });

    it('should return npm install for npm', () => {
      expect(getInstallCommand('npm')).toBe('npm install');
    });
  });

  describe('getRunCommand', () => {
    it('should return pnpm script for pnpm', () => {
      expect(getRunCommand('pnpm', 'dev')).toBe('pnpm dev');
      expect(getRunCommand('pnpm', 'build')).toBe('pnpm build');
    });

    it('should return yarn script for yarn', () => {
      expect(getRunCommand('yarn', 'dev')).toBe('yarn dev');
      expect(getRunCommand('yarn', 'build')).toBe('yarn build');
    });

    it('should return npm run script for npm', () => {
      expect(getRunCommand('npm', 'dev')).toBe('npm run dev');
      expect(getRunCommand('npm', 'build')).toBe('npm run build');
    });
  });

  describe('installDependencies', () => {
    it('should call execSync with correct command and options', async () => {
      const execSyncMock = vi.fn();
      vi.doMock('node:child_process', () => ({
        execSync: execSyncMock,
      }));

      // Re-import to get the mocked version
      const { installDependencies: mockedInstall } = await import(
        '../../utils/package-manager.js'
      );

      mockedInstall('pnpm', '/test/path');

      expect(execSyncMock).toHaveBeenCalledWith('pnpm install', {
        cwd: '/test/path',
        stdio: 'inherit',
      });
    });
  });
});
