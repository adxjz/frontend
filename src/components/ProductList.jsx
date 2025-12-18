import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';

function ProductList({ onAddToCart, onBuyNow }) {
  return (
    <section className="product-section">
      <div className="grid-head">
        <h1 className="title">Featured Products</h1>
        <p className="subtitle">Hand-picked items for you</p>
      </div>
      <div className="product-list">
        {PRODUCTS.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
