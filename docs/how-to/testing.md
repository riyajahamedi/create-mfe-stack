# Testing shell and remotes

## Unit/Component tests
- React: Vitest + Testing Library; mock bridge with a test instance.
- Vue: Vitest + Vue Test Utils; same approach for bridge/composables.

### Example (React)
```ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { counterBridge } from '@basic/shared';
import ShellCounter from '../ShellCounter';

describe('ShellCounter', () => {
  it('renders count', () => {
    counterBridge.setState({ count: 2 });
    render(<ShellCounter />);
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});
```

### Example (Vue)
```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Cart from '../Cart.vue';
import { cartBridge } from '@multi-framework/shared';

describe('Cart', () => {
  it('shows items', () => {
    cartBridge.setState({ cart: [{ id: '1', name: 'X', price: 10, quantity: 1 }] });
    const wrapper = mount(Cart);
    expect(wrapper.text()).toContain('X');
  });
});
```

## Mocking remotes in shell tests
- For React shell, mock `import('remote/App')` with a local component when testing shell-only UIs.
- Use `vi.mock('products/App', () => ({ default: () => <div>Mock</div> }))` in Vitest.

## Schema validation tests
- Write small tests per bridge schema to ensure defaults and guards:
```ts
import { stateSchema } from '../cart-schema';
expect(stateSchema.parse({})).toBeTruthy();
```

## E2E (optional)
- Use Playwright/Cypress to run shell + remotes together; start via `pnpm dev` with a test env.
- Assert cross-MFE flows (add to cart in React, see update in Vue).

## Tips
- Reset bridges between tests if state is shared; expose a helper to re-init for tests if needed.
- Keep remote mocks minimal; focus on shell behavior when mocking.
