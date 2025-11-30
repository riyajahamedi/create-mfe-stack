import * as p from '@clack/prompts';
import type { Framework } from '../types.js';

export type { Framework };

export async function frameworkPrompt(): Promise<Framework | symbol> {
  return p.select({
    message: 'Which framework do you want to use?',
    options: [
      {
        value: 'react' as const,
        label: 'React',
        hint: 'React 18 with TypeScript',
      },
      {
        value: 'vue' as const,
        label: 'Vue',
        hint: 'Vue 3 with TypeScript',
      },
    ],
    initialValue: 'react' as const,
  });
}
