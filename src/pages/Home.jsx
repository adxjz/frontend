import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import CartPanel from '../components/CartPanel';
import { PRODUCTS } from '../data/products';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [checkoutModal, setCheckoutModal] = useState({ show: false, items: [] });
  const [shippingForm, setShippingForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: ''
  });

  // Load cart and login state on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart({});
      }
    }
    
    const loggedIn = sessionStorage.getItem('isLoggedIn') === '1';
    setIsLoggedIn(loggedIn);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, duration = 1400) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), duration);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const addToCart = (productId, quantity = 1) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      showToast('Product not found');
      return;
    }

    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].qty += quantity;
      } else {
        newCart[productId] = { item: product, qty: quantity };
      }
      return newCart;
    });

    setNotifCount(prev => prev + 1);
    showToast('Added to cart ✔');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].qty += delta;
        if (newCart[productId].qty <= 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleBuyNow = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      setCheckoutModal({
        show: true,
        items: [{ id: productId, title: product.title, price: product.price, qty: 1 }]
      });
    }
  };

  const handleCartCheckout = () => {
    const items = Object.values(cart);
    if (items.length === 0) {
      showToast('Cart is empty');
      return;
    }
    
    const checkoutItems = items.map(c => ({
      id: c.item.id,
      title: c.item.title,
      price: c.item.price,
      qty: c.qty
    }));
    
    setCheckoutModal({ show: true, items: checkoutItems });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const total = checkoutModal.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    
    const order = {
      items: checkoutModal.items,
      total,
      shipping: shippingForm,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Clear cart and form
    setCart({});
    setShippingForm({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
    setCheckoutModal({ show: false, items: [] });
    setIsCartOpen(false);
    
    navigate('/order');
  };

  const cartItemCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <header className="login-header">
            <div className="brand">JZ Shop</div>
            <div className="login-sub">Sign in to continue</div>
          </header>
          <form className="login-form" onSubmit={handleLogin}>
            <label className="field">
              <span className="label">Email or username</span>
              <input
                type="text"
                required
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </label>
            <label className="field">
              <span className="label">Password</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </label>
            <div className="actions">
              <button type="submit" className="btn primary">Login</button>
            </div>
          </form>
          <footer className="login-foot">
            By continuing you agree to our friendly demo terms.
          </footer>
        </div>
      </div>
    );
  }

  return (
    <main className="app center-wrap">
      <header className="site-header">
        <div className="brand">JZ Shop</div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Contact</a>
        </nav>
        <div className="header-actions">
          <button 
            className="icon-btn" 
            title="Notifications"
            onClick={() => {
              setNotifCount(0);
              showToast('Notifications cleared');
            }}
          >
            🔔 {notifCount > 0 && <span className="badge">{notifCount}</span>}
          </button>
          <button 
            className="icon-btn" 
            title="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            🛒 {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      {/* Checkout Modal */}
      {checkoutModal.show && (
        <div className="modal open">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setCheckoutModal({ show: false, items: [] })}
            >
              &times;
            </button>
            <h3>Shipping Details</h3>
            <form onSubmit={handleCheckoutSubmit}>
              <label>
                Full name
                <input
                  name="name"
                  required
                  value={shippingForm.name}
                  onChange={(e) => setShippingForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </label>
              <label>
                Phone
                <input
                  name="phone"
                  type="tel"
                  required
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </label>
              <label>
                Address
                <input
                  name="address"
                  required
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </label>
              <label>
                City
                <input
                  name="city"
                  required
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                />
              </label>
              <label>
                Pincode
                <input
                  name="pincode"
                  required
                  value={shippingForm.pincode}
                  onChange={(e) => setShippingForm(prev => ({ ...prev, pincode: e.target.value }))}
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn add-cart">Confirm & Pay</button>
                <button 
                  type="button" 
                  className="btn buy-now"
                  onClick={() => setCheckoutModal({ show: false, items: [] })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="toast" role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      <ProductList onAddToCart={addToCart} onBuyNow={handleBuyNow} />

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCartCheckout}
      />

      <footer className="site-footer">
        <div>© JZ Shop — Aditya</div>
      </footer>
    </main>
  );
}

export default Home;