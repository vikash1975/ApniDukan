import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrderById } from '../services/api';
import '../styles/OrderSuccess.css';

function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [transactionId, setTransactionId] = useState(location.state?.transactionId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order) {
      setLoading(true);
      getOrderById(orderId)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load order');
        })
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-container">
        <div className="error-box">
          <h2>⚠️ Error</h2>
          <p>{error || 'Order not found'}</p>
          <button onClick={() => navigate('/products')} className="home-btn">
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h1>Order Successful!</h1>
        <p className="confirmation-text">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="order-details-box">
          <div className="detail-row">
            <span className="label">Order ID:</span>
            <span className="value">{order._id.substring(0, 8).toUpperCase()}</span>
          </div>

          {transactionId && (
            <div className="detail-row">
              <span className="label">Transaction ID:</span>
              <span className="value">{transactionId}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="label">Order Date:</span>
            <span className="value">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Total Amount:</span>
            <span className="value amount">₹{order.totalPrice.toFixed(2)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Order Status:</span>
            <span className={`value status-badge ${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Shipping Address:</span>
            <span className="value address">{order.shippingAddress}</span>
          </div>
        </div>

        <div className="order-items-box">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-header">
                  <span className="item-name">
                    {item.productId?.name || 'Product'}
                  </span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
                <div className="item-footer">
                  <span className="item-unit-price">
                    ₹{item.price.toFixed(2)} each
                  </span>
                  <span className="item-subtotal">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={() => navigate('/profile/orders')} 
            className="view-orders-btn"
          >
            View All Orders
          </button>
          <button 
            onClick={() => navigate('/products')} 
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>

        <div className="info-message">
          <p>📧 A confirmation email has been sent to your registered email address.</p>
          <p>🚚 You will receive tracking information soon.</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
