import { useEffect } from 'react';
import CartItem from './CartItem';

function CartPanel({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) {
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.qty, 0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <aside 
      className={`cart-panel ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="cart-panel-inner">
        <button className="close-panel" onClick={onClose}>
          &times;
        </button>
        <h3>Your Cart</h3>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div style={{ padding: '16px', color: '#666' }}>
              Your cart is empty.
            </div>
          ) : (
            cartItems.map(cartItem => (
              <CartItem
                key={cartItem.item.id}
                cartItem={cartItem}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))
          )}
        </div>

        <div className="cart-summary">
          <div className="subtotal">
            Subtotal: <strong>₹ {subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <div className="checkout-row">
            <button 
              className="btn buy-now"
              onClick={onCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CartPanel;
