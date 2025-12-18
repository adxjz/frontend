import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Order() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLogged = sessionStorage.getItem('isLoggedIn') === '1';
    if (!isLogged) {
      navigate('/');
      return;
    }

    // Load order data
    const orderData = localStorage.getItem('lastOrder');
    if (!orderData) {
      navigate('/');
      return;
    }

    try {
      const parsedOrder = JSON.parse(orderData);
      if (!parsedOrder.items || parsedOrder.items.length === 0) {
        navigate('/');
        return;
      }
      setOrder(parsedOrder);
    } catch (e) {
      console.error('Failed to parse order data', e);
      navigate('/');
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="center-wrap" style={{ padding: '40px' }}>Loading...</div>;
  }

  if (!order) {
    return null;
  }

  const orderDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleString('en-IN') 
    : '';

  const shipping = order.shipping || {};
  const addressParts = [];
  if (shipping.address) addressParts.push(shipping.address);
  if (shipping.city) addressParts.push(shipping.city);
  const fullAddress = addressParts.join(', ') + 
    (shipping.pincode ? ' - ' + shipping.pincode : '');

  return (
    <div className="center-wrap" style={{ padding: '40px' }}>
      <h1>Order Confirmed</h1>
      <p>Thanks — your order is placed. Below is the summary:</p>

      <div style={{ marginTop: '18px' }}>
        {orderDate && (
          <div style={{ 
            marginBottom: '8px', 
            color: '#666', 
            fontSize: '13px' 
          }}>
            Ordered on {orderDate}
          </div>
        )}

        <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
          <div style={{ marginBottom: '8px', fontWeight: '700' }}>Items</div>
          
          {order.items.map((item, index) => {
            const subtotal = Number(item.price) * Number(item.qty);
            return (
              <div 
                key={index}
                className="order-row" 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #f4f4f4'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700' }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: '13px' }}>
                    ₹ {Number(item.price).toLocaleString('en-IN')} each • Qty: {item.qty}
                  </div>
                </div>
                <div style={{ fontWeight: '700' }}>
                  ₹ {subtotal.toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ 
          marginTop: '12px', 
          fontWeight: '700', 
          fontSize: '16px' 
        }}>
          Total: ₹ {Number(order.total).toLocaleString('en-IN')}
        </div>

        <div style={{ marginTop: '14px' }}>
          <h4 style={{ margin: '6px 0 8px 0' }}>Shipping Details</h4>
          <div style={{ fontWeight: '700' }}>{shipping.name || ''}</div>
          <div style={{ color: '#666' }}>
            {shipping.email || ''}
            {shipping.phone ? ' • ' + shipping.phone : ''}
          </div>
          <div style={{ color: '#555' }}>{fullAddress}</div>
        </div>
      </div>

      <div style={{ marginTop: '18px' }}>
        <Link to="/" className="btn add-cart">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default Order;