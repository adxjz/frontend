import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], total = 0 } = location.state || {};
  
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCustomerData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer: customerData,
      items: cartItems,
      total: total
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('lastOrder', JSON.stringify({
          ...orderData,
          orderId: result.orderId || Date.now(),
          orderDate: new Date().toISOString()
        }));
        navigate('/order-confirmation');
      } else {
        alert('Order failed. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="center-wrap" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No items to checkout</h2>
        <button className="btn primary" onClick={() => navigate('/')}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="center-wrap" style={{ padding: '40px' }}>
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
        {/* Customer Form */}
        <div>
          <h3>Customer Details</h3>
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label>
              Name *
              <input
                type="text"
                name="name"
                required
                value={customerData.name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
            </label>
            
            <label>
              Phone *
              <input
                type="tel"
                name="phone"
                required
                value={customerData.phone}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
            </label>
            
            <label>
              Email *
              <input
                type="email"
                name="email"
                required
                value={customerData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
            </label>
            
            <label>
              Address *
              <textarea
                name="address"
                required
                value={customerData.address}
                onChange={handleInputChange}
                rows="3"
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
            </label>
            
            <button 
              type="submit" 
              className="btn primary"
              disabled={loading}
              style={{ padding: '15px', fontSize: '16px', marginTop: '20px' }}
            >
              {loading ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h3>Order Summary</h3>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    ₹{item.price.toLocaleString('en-IN')} × {item.qty}
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
            
            <div style={{ 
              marginTop: '20px', 
              paddingTop: '20px', 
              borderTop: '2px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              <span>Total:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;