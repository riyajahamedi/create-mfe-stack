import * as p from '@clack/prompts';

export interface Features {
  stateManagement: boolean;
  designSystem: boolean;
  githubActions: boolean;
  docker: boolean;
}

export async function featuresPrompt(): Promise<Features | symbol> {
  const selectedFeatures = await p.multiselect({
    message: 'Which features would you like to include?',
    options: [
      {
        value: 'stateManagement',
        label: 'Shared State Management',
        hint: 'Cross-MFE state sharing',
      },
      {
        value: 'designSystem',
        label: 'Design System Starter',
        hint: 'Shared component library',
      },
      {
        value: 'githubActions',
        label: 'GitHub Actions CI/CD',
        hint: 'Automated testing and deployment',
      },
      {
        value: 'docker',
        label: 'Docker Configuration',
        hint: 'Containerization setup',
      },
    ],
    initialValues: ['githubActions'],
    required: false,
  });

  if (typeof selectedFeatures === 'symbol') {
    return selectedFeatures;
  }

  return {
    stateManagement: selectedFeatures.includes('stateManagement'),
    designSystem: selectedFeatures.includes('designSystem'),
    githubActions: selectedFeatures.includes('githubActions'),
    docker: selectedFeatures.includes('docker'),
  };
}
