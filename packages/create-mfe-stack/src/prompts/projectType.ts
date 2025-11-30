import * as p from '@clack/prompts';

export type ProjectType = 'complete' | 'shell' | 'remote';

export async function projectTypePrompt(): Promise<ProjectType | symbol> {
  return p.select({
    message: 'What type of project do you want to create?',
    options: [
      {
        value: 'complete' as const,
        label: 'Complete Platform',
        hint: 'Shell + Remote apps with full MFE setup',
      },
      {
        value: 'shell' as const,
        label: 'Shell Only',
        hint: 'Host application that loads remotes',
      },
      {
        value: 'remote' as const,
        label: 'Remote Only',
        hint: 'Standalone micro-frontend app',
      },
    ],
    initialValue: 'complete' as const,
  });
}
