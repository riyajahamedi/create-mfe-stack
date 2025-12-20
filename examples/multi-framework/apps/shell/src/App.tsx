import { Suspense, lazy } from 'react';
import { useBridgeState } from '@mfe-stack/react';
import { cartBridge, toggleTheme } from '@multi-framework/shared';
import './index.css';

const Products = lazy(() => import('products/App'));
const Cart = lazy(() => import('cart/App'));

function Header(): JSX.Element {
  const cart = useBridgeState(cartBridge, 'cart');
  const theme = useBridgeState(cartBridge, 'theme');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="brand">
        <span>🧩</span>
        <span>Multi-Framework Shell</span>
      </div>
      <div className="controls">
        <button className="secondary" onClick={toggleTheme}>
          Theme: {theme}
        </button>
        <div className="badge">Cart: {count}</div>
      </div>
    </header>
  );
}

export default function App(): JSX.Element {
  return (
    <div className="app-shell">
      <Header />
      <main className="main">
        <div className="card grid-remote">
          <h2>Products (React remote)</h2>
          <p className="subtle">Add to cart from React.</p>
          <Suspense fallback={<div>Loading products…</div>}>
            <Products />
          </Suspense>
        </div>

        <div className="card grid-remote">
          <h2>Cart (Vue remote)</h2>
          <p className="subtle">Inspect and edit cart from Vue.</p>
          <Suspense fallback={<div>Loading cart…</div>}>
            <Cart />
          </Suspense>
        </div>
      </main>
      <footer>Shared state flows through @mfe-stack/core across React and Vue.</footer>
    </div>
  );
}
