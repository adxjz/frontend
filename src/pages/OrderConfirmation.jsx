import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (!savedOrder) {
      navigate('/');
      return;
    }

    try {
      const order = JSON.parse(savedOrder);
      setOrderData(order);
    } catch (error) {
      console.error('Error loading order:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="center-wrap" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="center-wrap" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/" className="btn primary">Back to Shop</Link>
      </div>
    );
  }

  const { customer, items, total, orderId, orderDate } = orderData;

  return (
    <div className="center-wrap" style={{ padding: '40px' }}>
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '48px', color: '#10b981', marginBottom: '10px' }}>✅</div>
        <h1 style={{ color: '#10b981', marginBottom: '10px' }}>Order Confirmed!</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Order Details */}
        <div>
          <h3>Order Details</h3>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Order ID:</strong> #{orderId}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Order Date:</strong> {new Date(orderDate).toLocaleDateString('en-IN')}
            </div>
            
            <h4 style={{ marginTop: '25px', marginBottom: '15px' }}>Items Ordered:</h4>
            {items.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none'
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
              fontWeight: 'bold',
              color: '#10b981'
            }}>
              <span>Total Paid:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h3>Delivery Information</h3>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Name:</strong><br />
              {customer.name}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Phone:</strong><br />
              {customer.phone}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Email:</strong><br />
              {customer.email}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Delivery Address:</strong><br />
              {customer.address}
            </div>
            
            <div style={{ 
              marginTop: '25px', 
              padding: '15px', 
              background: '#e6f7ff', 
              borderRadius: '8px',
              border: '1px solid #91d5ff'
            }}>
              <strong>📦 Estimated Delivery:</strong><br />
              <span style={{ color: '#1890ff' }}>3-5 business days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link 
          to="/" 
          className="btn primary"
          style={{ marginRight: '15px', padding: '12px 24px' }}
        >
          Continue Shopping
        </Link>
        <button 
          className="btn buy-now"
          onClick={() => window.print()}
          style={{ padding: '12px 24px' }}
        >
          Print Order
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;