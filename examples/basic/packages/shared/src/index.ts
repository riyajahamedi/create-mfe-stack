import { z } from 'zod';
import { createBridge } from '@mfe-stack/core';

type Source = 'shell' | 'counter';

const stateSchema = z.object({
  count: z.number().default(0),
  lastUpdatedBy: z.enum(['shell', 'counter']).optional(),
});

export type CounterState = typeof stateSchema._output;

export const counterBridge = createBridge({
  namespace: 'counter',
  schema: stateSchema,
  initialState: { count: 0 },
});

export function increment(source: Source): void {
  counterBridge.setState((prev) => ({
    count: prev.count + 1,
    lastUpdatedBy: source,
  }));
}

export function decrement(source: Source): void {
  counterBridge.setState((prev) => ({
    count: prev.count - 1,
    lastUpdatedBy: source,
  }));
}
