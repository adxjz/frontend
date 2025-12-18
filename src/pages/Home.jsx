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

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === '1';
    setIsLoggedIn(loggedIn);
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 1400);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const addToCart = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].qty += 1;
      } else {
        newCart[productId] = { item: product, qty: 1 };
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

  const handleCheckout = () => {
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
    
    const total = checkoutItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    
    navigate('/checkout', { 
      state: { 
        cartItems: checkoutItems, 
        total: total 
      } 
    });
    setCart({});
    setIsCartOpen(false);
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

      {toast.show && (
        <div className="toast" role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      <ProductList onAddToCart={addToCart} onBuyNow={addToCart} />

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <footer className="site-footer">
        <div>© JZ Shop — Aditya</div>
      </footer>
    </main>
  );
}

export default Home;