import { z } from 'zod';
import { createBridge } from '@mfe-stack/core';

type Theme = 'light' | 'dark';

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().default(1),
});

const stateSchema = z.object({
  cart: z.array(productSchema).default([]),
  user: z
    .object({
      name: z.string(),
      isLoggedIn: z.boolean(),
    })
    .optional(),
  theme: z.enum(['light', 'dark']).default('light'),
});

export type CartState = typeof stateSchema._output;

export const cartBridge = createBridge({
  namespace: 'cart',
  schema: stateSchema,
  initialState: {
    cart: [],
    theme: 'light',
  },
});

export function addToCart(product: z.infer<typeof productSchema>): void {
  cartBridge.setState((prev) => {
    const existing = prev.cart.find((p) => p.id === product.id);
    if (!existing) {
      return { cart: [...prev.cart, { ...product, quantity: 1 }] };
    }

    return {
      cart: prev.cart.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ),
    };
  });
}

export function updateQuantity(id: string, delta: number): void {
  cartBridge.setState((prev) => ({
    cart: prev.cart
      .map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
      .filter((p) => p.quantity > 0),
  }));
}

export function removeItem(id: string): void {
  cartBridge.setState((prev) => ({
    cart: prev.cart.filter((p) => p.id !== id),
  }));
}

export function toggleTheme(): void {
  cartBridge.setState((prev) => ({
    theme: prev.theme === 'light' ? 'dark' : 'light',
  }));
}
