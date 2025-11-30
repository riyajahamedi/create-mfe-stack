/**
 * @mfe-stack/cli types
 */

/**
 * Detected MFE project configuration
 */
export interface MfeProject {
  root: string;
  type: 'monorepo' | 'single';
  packageManager: 'pnpm' | 'npm' | 'yarn';
}

/**
 * Individual MFE application configuration
 */
export interface MfeApp {
  name: string;
  type: 'shell' | 'remote';
  port: number;
  path: string;
  framework: 'react' | 'vue';
}

/**
 * Remote connection between shell and remote apps
 */
export interface RemoteConnection {
  shell: string;
  remote: string;
  url: string;
}

/**
 * Dependency version information
 */
export interface DependencyVersion {
  name: string;
  version: string;
  app: string;
}

/**
 * Dependency conflict information
 */
export interface DependencyConflict {
  name: string;
  versions: DependencyVersion[];
}
