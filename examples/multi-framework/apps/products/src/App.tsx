import { useBridgeAction } from '@mfe-stack/react';
import { addToCart, cartBridge } from '@multi-framework/shared';
import './index.css';

const sampleProducts = [
  { id: 'p1', name: 'Noise-cancelling Headphones', price: 199 },
  { id: 'p2', name: 'Ergonomic Chair', price: 329 },
  { id: 'p3', name: 'Ultra-wide Monitor', price: 599 },
  { id: 'p4', name: 'Mechanical Keyboard', price: 149 },
  { id: 'p5', name: 'USB-C Hub', price: 69 },
  { id: 'p6', name: '4K Webcam', price: 119 },
];

export default function Products(): JSX.Element {
  const dispatch = useBridgeAction(cartBridge);

  return (
    <div>
      <p className="tagline">React remote publishes add-to-cart actions.</p>
      <div className="products-grid">
        {sampleProducts.map((product) => (
          <article key={product.id} className="card">
            <h3>{product.name}</h3>
            <div className="price">${product.price.toFixed(2)}</div>
            <button
              onClick={() => {
                addToCart({ ...product, quantity: 1 });
                dispatch('CART_UPDATED', { source: 'products', id: product.id });
              }}
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
