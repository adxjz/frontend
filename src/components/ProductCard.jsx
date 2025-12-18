function ProductCard({ product, onAddToCart, onBuyNow }) {
  return (
    <div className="product">
      <img src={product.img} alt={product.title} />
      <div className="p-body">
        <h3>{product.title}</h3>
        <div className="price">₹ {product.price.toLocaleString('en-IN')}</div>
        <div className="actions">
          <button 
            className="btn add-cart" 
            onClick={() => onAddToCart(product.id)}
          >
            Add to Cart
          </button>
          <button 
            className="btn buy-now" 
            onClick={() => onBuyNow(product.id)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;