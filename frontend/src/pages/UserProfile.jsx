import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/api';
import '../styles/UserProfile.css';

function UserProfile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-info-section">
          <h2>Account Information</h2>
          <div className="info-card">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{user?.name || 'Not provided'}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email || 'Not available'}</span>
            </div>
            <div className="info-row">
              <span className="label">Member Since:</span>
              <span className="value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString() 
                  : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        <div className="orders-section">
          <h2>My Orders ({orders.length})</h2>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>You haven't placed any orders yet</p>
              <a href="/products" className="shop-link">Start Shopping</a>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="order-items">
                    <h4>Items:</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span className="item-name">{item.productId?.name || 'Product'}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="address">
                      <strong>Delivery Address:</strong>
                      <p>{order.shippingAddress}</p>
                    </div>
                    <div className="order-total">
                      <strong>Total:</strong>
                      <span>₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
