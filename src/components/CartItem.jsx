function CartItem({ cartItem, onUpdateQuantity, onRemove }) {
  const { item, qty } = cartItem;

  return (
    <div className="cart-item">
      <img src={item.img} alt={item.title} />
      <div className="ci-info">
        <div style={{ fontWeight: 700 }}>{item.title}</div>
        <div style={{ color: '#666' }}>₹ {item.price} each</div>
        <div className="qty-controls">
          <button onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
          <div style={{ minWidth: '28px', textAlign: 'center' }}>{qty}</div>
          <button onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
          <button 
            onClick={() => onRemove(item.id)}
            style={{ 
              marginLeft: '10px', 
              color: '#c00', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;