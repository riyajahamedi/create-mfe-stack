import * as p from '@clack/prompts';
import pc from 'picocolors';
import validatePackageName from 'validate-npm-package-name';
import { projectTypePrompt, type ProjectType } from './projectType.js';
import { frameworkPrompt, type Framework } from './framework.js';
import { featuresPrompt, type Features } from './features.js';

export interface ProjectConfig {
  projectName: string;
  projectType: ProjectType;
  framework: Framework;
  features: Features;
  packageManager: 'pnpm' | 'npm' | 'yarn';
}

export async function runPrompts(
  initialProjectName?: string
): Promise<ProjectConfig | null> {
  p.intro(pc.bgCyan(pc.black(' create-mfe-stack ')));

  const projectName = await p.text({
    message: 'What is your project name?',
    placeholder: 'my-mfe-platform',
    initialValue: initialProjectName,
    validate: (value) => {
      if (!value) {
        return 'Project name is required';
      }
      const validation = validatePackageName(value);
      if (!validation.validForNewPackages) {
        return (
          validation.errors?.[0] ||
          validation.warnings?.[0] ||
          'Invalid package name'
        );
      }
      return undefined;
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel('Operation cancelled');
    return null;
  }

  const projectType = await projectTypePrompt();
  if (p.isCancel(projectType)) {
    p.cancel('Operation cancelled');
    return null;
  }

  const framework = await frameworkPrompt();
  if (p.isCancel(framework)) {
    p.cancel('Operation cancelled');
    return null;
  }

  const features = await featuresPrompt();
  if (p.isCancel(features)) {
    p.cancel('Operation cancelled');
    return null;
  }

  const packageManager = await p.select({
    message: 'Which package manager do you want to use?',
    options: [
      {
        value: 'pnpm' as const,
        label: 'pnpm',
        hint: 'recommended',
      },
      {
        value: 'npm' as const,
        label: 'npm',
      },
      {
        value: 'yarn' as const,
        label: 'yarn',
      },
    ],
    initialValue: 'pnpm' as const,
  });

  if (p.isCancel(packageManager)) {
    p.cancel('Operation cancelled');
    return null;
  }

  p.outro(pc.green('Configuration complete!'));

  return {
    projectName: projectName as string,
    projectType: projectType as ProjectType,
    framework: framework as Framework,
    features: features as Features,
    packageManager: packageManager as 'pnpm' | 'npm' | 'yarn',
  };
}
