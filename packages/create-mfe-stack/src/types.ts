export type ProjectType = 'complete' | 'shell' | 'remote';
export type Framework = 'react' | 'vue';
export type PackageManager = 'pnpm' | 'npm' | 'yarn';

export interface Features {
  sharedState: boolean;
  designSystem: boolean;
  githubActions: boolean;
  docker: boolean;
}

export interface ProjectConfig {
  projectName: string;
  projectType: ProjectType;
  framework: Framework;
  features: Features;
  packageManager: PackageManager;
}

export interface GeneratorConfig extends ProjectConfig {
  skipInstall: boolean;
  initGit: boolean;
}

export interface RemoteConfig {
  name: string;
  port: number;
}
